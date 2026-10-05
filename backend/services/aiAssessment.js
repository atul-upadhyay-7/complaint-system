/**
 * Uniissuehub - AI safety net.
 *
 * Wraps the local NLP helpers in aiService.js with:
 *   - confidence values for category, priority and sentiment
 *   - deterministic safety rules (no model involved) that always escalate
 *   - a "needs review" flag with human-readable reasons
 *   - a kill switch (AI_ENABLED=false) and a fail-safe if anything throws
 *
 * Design rules:
 *   1. The AI can only RAISE priority, never lower what the student chose.
 *   2. Safety rules are plain regexes. They keep working when AI is disabled
 *      or when the model code throws.
 *   3. Anything uncertain is flagged for a human, not silently decided.
 */
const natural = require('natural');
const logger = require('../utils/logger');
const ai = require('./aiService');

const LEVELS = ['Low', 'Medium', 'High', 'Critical'];
const levelIndex = (p) => LEVELS.indexOf(p);
const maxPriority = (...ps) => ps.filter(p => levelIndex(p) >= 0)
    .reduce((a, b) => (levelIndex(b) > levelIndex(a) ? b : a), 'Low');

// Review thresholds. Initial values were set by judgement before any evaluation run and
// adjusted only while looking at dev-split rows (see backend/eval).
const THRESHOLDS = {
    category: 0.6,    // below this the category suggestion is flagged
    sentiment: 0.5,   // below this the sentiment is "no clear cue"
    mismatch: 0.75,   // AI disagrees with the student's category above this
};

// ─── Safety rules ──────────────────────────────────────────────────────────
// Each rule has a regex and a short label. Negated mentions ("no fire",
// "not a fire", "without sparks") are ignored, as are fire alarm panels.
const SAFETY_RULES = [
    { label: 'fire or smoke', re: /\b(fire|smoke|burning smell|smell of burning|burning plastic)\b(?!\s+(alarm|detector|extinguisher|drill|exit|safety))/i },
    { label: 'sparks or electric shock', re: /\b(spark(s|ing|ed)?|electric(al)? shock|electrocut\w*|got shocked|short[- ]circuit)\b/i },
    { label: 'gas leak', re: /\b(gas leak\w*|smell of gas|gas smell|leaking gas|lpg)\b/i },
    { label: 'flooding or burst pipe', re: /\b(flood(ed|ing)?|burst pipe|water (is )?entering)\b/i },
    { label: 'structural danger', re: /\b(collapse[ds]?|plaster fell|ceiling fell|roof fell|fell from the (roof|ceiling)|railing (has )?come loose|may fall|about to fall|nearly hit|unsafe (roof|ceiling|building))\b/i },
    { label: 'injury or medical', re: /\b(injur(y|ed|ies)|bleeding|ambulance|unconscious|medical (help|emergency)|faint(ed|ing)|vomit\w*|food poisoning)\b/i },
    { label: 'health hazard', re: /\b(bed ?bugs?|worms?|hair (found )?in (the |my )?food|health hazard|food safety|contaminated|sewage (overflow|water))\b/i },
    { label: 'structural crack', re: /\bcracks?\b.{0,30}\b(wall|ceiling|beam|stair\w*|widen\w*)|\b(wall|ceiling|beam|stair\w*)\b.{0,30}\bcracks?\b/i },
    { label: 'personal safety', re: /\b(do(n'?t| not) feel safe|feel(s|ing)? unsafe|not safe (to|at|for))\b/i },
    { label: 'assault or missing person', re: /\b(assault\w*|attacked|molest\w*|missing since|student missing|kidnap\w*|ragging)\b/i },
];
const NEGATION_BEFORE = /\b(no|not|never|without|zero|isn'?t|aren'?t|wasn'?t|nahi|nhi)\s+(\w+\s+){0,2}$/i;

const detectSafety = (text) => {
    const hits = [];
    for (const rule of SAFETY_RULES) {
        const re = new RegExp(rule.re.source, 'gi');
        let m;
        while ((m = re.exec(text)) !== null) {
            const before = text.slice(Math.max(0, m.index - 24), m.index);
            if (NEGATION_BEFORE.test(before)) continue;
            hits.push(rule.label);
            break;
        }
    }
    return hits;
};

// ─── Category with confidence ──────────────────────────────────────────────
const CATEGORY_KEYWORDS = ai._internals ? ai._internals.CATEGORY_KEYWORDS : null;
const escapeRe = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
const kwRegexCache = new Map();
const kwRe = (kw) => {
    const k = kw.trim();
    // Short keywords ("ac", "led", "lan", "ups", "rat") must match whole words, otherwise
    // they hit "account", "called", "plan", "groups", "rate". Longer ones allow suffixes
    // ("light" -> "lights", "leak" -> "leaking").
    if (!kwRegexCache.has(k)) kwRegexCache.set(k, new RegExp(k.length <= 3 ? `\\b${escapeRe(k)}\\b` : `\\b${escapeRe(k)}`, 'i'));
    return kwRegexCache.get(k);
};

const categorizeWithConfidence = (text) => {
    const counts = {};
    for (const [cat, kws] of Object.entries(CATEGORY_KEYWORDS)) {
        counts[cat] = kws.filter(kw => kwRe(kw).test(text)).length;
    }
    const ranked = Object.entries(counts).sort((a, b) => b[1] - a[1]);
    const [topCat, top] = ranked[0];
    const second = ranked[1][1];
    if (top >= 1) {
        // Margin between the best and second-best category, damped for a single hit.
        const margin = (top - second) / (top + second);
        const support = Math.min(1, 0.55 + 0.15 * top);
        return { category: topCat, confidence: round(support * (0.5 + 0.5 * margin)), source: 'keywords' };
    }
    // No keyword evidence: the Bayes model will always answer, so only trust it
    // when it is clearly ahead AND the text shares vocabulary with the training data.
    try {
        const classes = ai._internals.classifier.getClassifications(text.toLowerCase());
        const [a, b] = classes;
        const ratio = b && (a.value + b.value) > 0 ? a.value / (a.value + b.value) : 0.5;
        return { category: a.label, confidence: round(Math.min(0.5, ratio * 0.5)), source: 'bayes-fallback' };
    } catch (_) {
        return { category: 'Other', confidence: 0, source: 'none' };
    }
};

// ─── Priority with confidence ──────────────────────────────────────────────
const priorityWithConfidence = (title, description) => {
    const text = `${title} ${description}`;
    const priority = ai.autoPrioritizeComplaint(title, description);
    const lower = text.toLowerCase();
    const matched = Object.keys(ai._internals.PRIORITY_WEIGHTS).filter(k => lower.includes(k)).length;
    // No keyword at all means the engine fell through to "Low" by default.
    const confidence = matched === 0 ? 0.2 : Math.min(0.9, 0.45 + 0.1 * matched);
    return { priority, confidence: round(confidence), matched };
};

// ─── Sentiment with confidence ─────────────────────────────────────────────
const sentimentWithConfidence = (title, description) => {
    const { sentiment, score } = ai.analyzeSentiment(title, description);
    const text = `${title} ${description}`.toLowerCase();
    const neg = ai._internals.NEGATIVE_WORDS.filter(w => text.includes(w)).length;
    const pos = ai._internals.POSITIVE_WORDS.filter(w => text.includes(w)).length;
    let confidence;
    if (neg && pos) confidence = 0.4;                   // mixed cues
    else if (sentiment === 'Urgent') confidence = 0.8;
    else if (sentiment === 'Frustrated') confidence = 0.65;
    else if (sentiment === 'Polite') confidence = 0.6;
    else confidence = (pos || neg) ? 0.35 : 0.3;        // "Neutral" because no strong cue was found
    return { sentiment, score, confidence: round(confidence), basis: (neg || pos) ? 'cue' : 'none' };
};

const round = (n) => Math.round(n * 100) / 100;

// ─── Public entry point ────────────────────────────────────────────────────
const aiEnabled = () => String(process.env.AI_ENABLED).toLowerCase() !== 'false';

/**
 * Assess a complaint. Never throws.
 * @param {{title:string, description:string, category?:string, priority?:string}} input
 * @returns assessment with final priority, AI suggestions, confidences and review flags
 */
const assessComplaint = ({ title = '', description = '', category = null, priority = null }) => {
    const text = `${title} ${description}`;
    const reasons = [];
    // The submit form does not send a priority today, so it is usually null here.
    const studentPriority = levelIndex(priority) >= 0 ? priority : null;
    const fallbackPriority = studentPriority || 'Medium'; // used only when the AI cannot decide

    // 1. Deterministic safety rules always run, even if AI is off or broken.
    let safety = [];
    try { safety = detectSafety(text); } catch (err) { logger.error(`[AI Safety] ${err.message}`); reasons.push('safety-check-error'); }
    const safetyFlag = safety.length > 0;
    if (safetyFlag) reasons.push(`safety: ${safety.join(', ')}`);

    const base = {
        enabled: aiEnabled(),
        priority: safetyFlag ? maxPriority(fallbackPriority, 'High') : fallbackPriority,
        aiCategory: null, aiPriority: null, aiSentiment: null,
        confidence: { category: null, priority: null, sentiment: null },
        sentimentBasis: null,
        safetyFlag, safetyReasons: safety,
        needsReview: safetyFlag, reviewReasons: reasons,
    };

    if (!base.enabled) {
        base.needsReview = true;
        base.reviewReasons = ['ai-disabled', ...reasons];
        return base;
    }

    try {
        const cat = categorizeWithConfidence(text);
        const pri = priorityWithConfidence(title, description);
        const sen = sentimentWithConfidence(title, description);

        base.aiCategory = cat.category;
        base.aiPriority = pri.priority;
        base.aiSentiment = sen.sentiment;
        base.confidence = { category: cat.confidence, priority: pri.confidence, sentiment: sen.confidence };
        base.sentimentBasis = sen.basis;

        // Rule 1: AI can only raise priority.
        base.priority = maxPriority(studentPriority || 'Low', pri.priority, safetyFlag ? 'High' : 'Low');
        if (studentPriority && levelIndex(pri.priority) - levelIndex(studentPriority) >= 2) reasons.push('ai-raised-priority-by-2+');

        if (cat.confidence < THRESHOLDS.category) reasons.push(`low category confidence (${cat.confidence})`);
        if (category && category !== cat.category && cat.confidence >= THRESHOLDS.mismatch) {
            reasons.push(`category differs from student's choice (${category} vs ${cat.category})`);
        }
        base.needsReview = reasons.length > 0;
        base.reviewReasons = reasons;
    } catch (err) {
        logger.error(`[AI Assessment Error] ${err.message}`);
        base.needsReview = true;
        base.reviewReasons = ['ai-error', ...reasons];
    }
    return base;
};

module.exports = { assessComplaint, detectSafety, categorizeWithConfidence, sentimentWithConfidence, priorityWithConfidence, THRESHOLDS, maxPriority };
