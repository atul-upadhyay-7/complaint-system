/**
 * ─────────────────────────────────────────────────────────
 *  UniIssueHub — Local AI Engine (No API required)
 *  Uses the `natural` NLP library for:
 *    1. Naive Bayes classifier → auto-categorize complaint
 *    2. Weighted keyword scoring → auto-prioritize (High/Medium/Low)
 * ─────────────────────────────────────────────────────────
 */

const natural = require('natural');
const logger = require('../utils/logger');

const tokenizer = new natural.WordTokenizer();
const stemmer = natural.PorterStemmer;

// ─── 1. CATEGORY CLASSIFIER ────────────────────────────────────────────────
// Train a Naive Bayes classifier with representative complaint phrases.
// The more training data, the better it gets.

const classifier = new natural.BayesClassifier();

// ELECTRICITY
const electricityPhrases = [
    'light not working', 'bulb fused', 'power cut', 'electricity gone', 'no power',
    'fan not working', 'ac not working', 'air conditioner broken', 'socket not working',
    'switchboard damaged', 'power failure', 'short circuit', 'electric shock',
    'wiring issue', 'generator not working', 'inverter down', 'transformer issue',
    'room is dark', 'lights off', 'tube light', 'LED not working', 'UPS failure',
    'power supply', 'electricity problem', 'electrical fault', 'no electricity',
    'voltage fluctuation', 'power fluctuation', 'plug not working', 'extension cord',
];
electricityPhrases.forEach(p => classifier.addDocument(p, 'Electricity'));

// WATER
const waterPhrases = [
    'water not coming', 'no water supply', 'tap broken', 'pipe leaking', 'water leak',
    'drinking water', 'water shortage', 'bathroom water', 'washroom water',
    'overhead tank empty', 'water tank', 'drainage blocked', 'drain overflow',
    'toilet leaking', 'flush not working', 'water pressure low', 'hot water',
    'geyser not working', 'water pump', 'water motor', 'water supply stopped',
    'pipeline broken', 'water contaminated', 'dirty water', 'muddy water',
    'water board', 'plumbing issue', 'toilet clogged', 'bathroom flood',
];
waterPhrases.forEach(p => classifier.addDocument(p, 'Water'));

// INTERNET
const internetPhrases = [
    'wifi not working', 'internet down', 'no internet', 'network issue',
    'wifi slow', 'broadband issue', 'router problem', 'connection dropped',
    'disconnecting frequently', 'lan cable', 'network cable', 'connectivity issue',
    'internet speed slow', 'data not connecting', 'hotspot issue', 'wifi password',
    'no connectivity', 'network failure', 'internet not accessible', 'port blocked',
    'proxy issue', 'dns not resolving', 'internet unreliable', 'ping high',
];
internetPhrases.forEach(p => classifier.addDocument(p, 'Internet'));

// CLEANLINESS
const cleanlinessPhrases = [
    'room not cleaned', 'dirty room', 'garbage not collected', 'trash overflow',
    'dustbin full', 'sweeping not done', 'mopping not done', 'bathroom dirty',
    'toilet not cleaned', 'bad smell', 'foul odor', 'insects in room',
    'cockroach', 'rats in hostel', 'mice', 'mosquitoes', 'pest infestation',
    'dusty', 'unclean', 'not swept', 'cleaning staff absent', 'litter',
    'waste not removed', 'hygiene issue', 'sewage smell', 'unhygienic',
];
cleanlinessPhrases.forEach(p => classifier.addDocument(p, 'Cleanliness'));

// MAINTENANCE
const maintenancePhrases = [
    'door broken', 'window broken', 'lock not working', 'broken lock',
    'ceiling fan', 'chair broken', 'table damaged', 'bed broken', 'furniture damaged',
    'wall crack', 'roof leaking', 'ceiling damaged', 'paint peeling',
    'cupboard broken', 'almirah damaged', 'mirror broken', 'shelf fallen',
    'door hinge', 'window glass broken', 'room needs repair', 'maintenance required',
    'infrastructure', 'building damage', 'structural issue', 'broken fixture',
    'handle missing', 'latch broken', 'cabinet damaged', 'shelf broken',
];
maintenancePhrases.forEach(p => classifier.addDocument(p, 'Maintenance'));

// SECURITY
const securityPhrases = [
    'theft', 'stolen', 'robbery', 'missing belongings', 'intruder', 'outsider',
    'security guard absent', 'cctv not working', 'camera broken',
    'gate open', 'main gate issue', 'unauthorized entry', 'suspicious person',
    'harassment', 'fight', 'eve teasing', 'ragging', 'unsafe',
    'security concern', 'no guard', 'late night', 'feeling unsafe',
];
securityPhrases.forEach(p => classifier.addDocument(p, 'Security'));

// FOOD
const foodPhrases = [
    'food quality bad', 'mess food', 'food not good', 'canteen food',
    'food stale', 'expiry food', 'food poisoning', 'unhygienic food',
    'menu not followed', 'less quantity', 'no food', 'mess not open',
    'cold food served', 'food not cooked', 'raw food', 'food complaint',
    'mess timing', 'canteen closed', 'dietary issue', 'vegetarian food',
];
foodPhrases.forEach(p => classifier.addDocument(p, 'Food'));

// OTHER
['general complaint', 'other issue', 'miscellaneous', 'not sure', 'other problem'].forEach(
    p => classifier.addDocument(p, 'Other')
);

// Train the classifier
classifier.train();
logger.info('[AI Engine] Naive Bayes classifier trained successfully.');

// ─── 2. PRIORITY SCORING ENGINE ────────────────────────────────────────────
// Weighted keyword dictionary. Higher weight = more severe.

const PRIORITY_WEIGHTS = {
    // ── Critical triggers (score ≥ 15 → Critical)
    'fire': 20, 'smoke': 18, 'electrocution': 20, 'electric shock': 18,
    'gas leak': 20, 'flood': 18, 'structural collapse': 20, 'roof fell': 18,
    'emergency': 15, 'danger': 15, 'accident': 15, 'injury': 15,
    'hospital': 15, 'medical': 14, 'ambulance': 15, 'bleeding': 15,

    // ── High priority triggers (score 8-14 → High if total ≥ 8)
    'urgent': 10, 'immediate': 10, 'asap': 9, 'critical': 10, 'severe': 9,
    'completely stopped': 9, 'not working at all': 9, 'no power since': 8,
    'no water since': 8, 'days': 7, 'week': 7, 'exam': 8, 'examination': 8,
    'theft': 10, 'stolen': 10, 'harassment': 12, 'ragging': 14, 'fight': 10,
    'food poisoning': 12, 'cockroach': 8, 'rats': 8, 'mice': 8,
    'sewage': 9, 'overflow': 8, 'flooded': 10, 'burst pipe': 10,
    'safety': 7, 'unsafe': 9, 'dangerous': 10, 'security': 7,
    'short circuit': 10, 'sparks': 9, 'wiring': 8, 'gas': 12,

    // ── Medium priority (score 3-7 → Medium if total ≥ 3)
    'broken': 4, 'damaged': 4, 'not working': 4, 'issue': 2, 'problem': 2,
    'complaint': 1, 'slow': 3, 'bad': 3, 'dirty': 4, 'leak': 5, 'leaking': 5,
    'smell': 4, 'odor': 4, 'blocked': 4, 'clogged': 5, 'stuck': 3,
    'inconvenience': 2, 'uncomfortable': 3, 'missing': 4, 'absent': 3,
    'hot': 3, 'cold': 3, 'noise': 3, 'loud': 3, 'disturbing': 4,

    // ── Low priority (score < 3 → Low)
    'request': 1, 'suggestion': 1, 'replace': 2, 'paint': 2, 'minor': -2,
    'small': -1, 'slightly': -2, 'sometimes': -1, 'occasionally': -1,
};

/**
 * Calculates a priority level from text using keyword scoring
 * @param {string} text - combined title + description
 * @returns {'Critical'|'High'|'Medium'|'Low'}
 */
const computePriority = (text) => {
    const lower = text.toLowerCase();
    let score = 0;

    for (const [keyword, weight] of Object.entries(PRIORITY_WEIGHTS)) {
        if (lower.includes(keyword)) {
            score += weight;
        }
    }

    // Urgency amplifiers: repeated words, ALL CAPS words, exclamation marks
    const capsWords = (text.match(/\b[A-Z]{3,}\b/g) || []).length;
    const exclamations = (text.match(/!/g) || []).length;
    score += capsWords * 2 + exclamations * 1;

    logger.info(`[AI Priority] Score: ${score} for text snippet: "${text.slice(0, 60)}..."`);

    if (score >= 15) return 'Critical';
    if (score >= 8) return 'High';
    if (score >= 3) return 'Medium';
    return 'Low';
};

// ─── 3. EXPORTED FUNCTIONS ─────────────────────────────────────────────────

/**
 * Auto-categorize a complaint using Naive Bayes NLP
 * @param {string} title
 * @param {string} description
 * @returns {string} - One of the Complaint categories
 */
const autoCategorizeComplaint = (title, description) => {
    try {
        const text = `${title} ${description}`;
        const result = classifier.classify(text);
        logger.info(`[AI Category] "${title}" → ${result}`);
        return result;
    } catch (err) {
        logger.error(`[AI Category Error] ${err.message}`);
        return 'Other';
    }
};

/**
 * Auto-prioritize a complaint using keyword scoring
 * @param {string} title
 * @param {string} description
 * @returns {'Critical'|'High'|'Medium'|'Low'}
 */
const autoPrioritizeComplaint = (title, description) => {
    try {
        const text = `${title} ${description}`;
        const priority = computePriority(text);
        logger.info(`[AI Priority] "${title}" → ${priority}`);
        return priority;
    } catch (err) {
        logger.error(`[AI Priority Error] ${err.message}`);
        return 'Medium';
    }
};

// ─── 4. SENTIMENT / URGENCY ANALYSIS ───────────────────────────────────────

const NEGATIVE_WORDS = [
    'angry', 'frustrated', 'terrible', 'horrible', 'worst', 'unacceptable',
    'disgusting', 'pathetic', 'useless', 'waste', 'ridiculous', 'nonsense',
    'furious', 'outraged', 'fed up', 'sick of', 'tired of', 'annoyed',
    'disappointed', 'hurt', 'unbearable', 'intolerable', 'appalling',
];
const POSITIVE_WORDS = [
    'please', 'kindly', 'request', 'thank', 'grateful', 'appreciate',
    'suggestion', 'recommend', 'would be nice', 'if possible',
];

/**
 * Analyze sentiment/urgency of complaint text
 * @returns {{ sentiment: 'Urgent'|'Frustrated'|'Neutral'|'Polite', score: number }}
 */
const analyzeSentiment = (title, description) => {
    try {
        const text = `${title} ${description}`.toLowerCase();
        let negScore = 0;
        let posScore = 0;

        NEGATIVE_WORDS.forEach(w => { if (text.includes(w)) negScore++; });
        POSITIVE_WORDS.forEach(w => { if (text.includes(w)) posScore++; });

        // Amplifiers
        const exclamations = (text.match(/!/g) || []).length;
        const capsWords = (`${title} ${description}`.match(/\b[A-Z]{3,}\b/g) || []).length;
        negScore += exclamations * 0.5 + capsWords * 0.5;

        let sentiment, score;
        if (negScore >= 3) { sentiment = 'Urgent'; score = Math.min(negScore * 20, 100); }
        else if (negScore >= 1) { sentiment = 'Frustrated'; score = 40 + negScore * 15; }
        else if (posScore >= 2) { sentiment = 'Polite'; score = 20; }
        else { sentiment = 'Neutral'; score = 30; }

        logger.info(`[AI Sentiment] "${title.slice(0, 40)}" → ${sentiment} (neg:${negScore} pos:${posScore})`);
        return { sentiment, score: Math.round(score) };
    } catch (err) {
        logger.error(`[AI Sentiment Error] ${err.message}`);
        return { sentiment: 'Neutral', score: 30 };
    }
};

// ─── 5. RESOLUTION TIME ESTIMATOR ──────────────────────────────────────────

const RESOLUTION_TIMES = {
    Electricity: { Low: '3-5 days', Medium: '1-2 days', High: '4-8 hours', Critical: '1-2 hours' },
    Water: { Low: '2-4 days', Medium: '1-2 days', High: '3-6 hours', Critical: '1-2 hours' },
    Internet: { Low: '3-5 days', Medium: '1-3 days', High: '6-12 hours', Critical: '2-4 hours' },
    Cleanliness: { Low: '3-5 days', Medium: '1-2 days', High: '4-8 hours', Critical: '2-4 hours' },
    Maintenance: { Low: '5-7 days', Medium: '2-4 days', High: '1-2 days', Critical: '4-8 hours' },
    Security: { Low: '1-2 days', Medium: '4-8 hours', High: '1-2 hours', Critical: '30 min' },
    Food: { Low: '2-3 days', Medium: '1 day', High: '2-4 hours', Critical: '1 hour' },
    Other: { Low: '5-7 days', Medium: '3-5 days', High: '1-2 days', Critical: '4-8 hours' },
};

/**
 * Estimate resolution time based on category + priority
 */
const estimateResolutionTime = (category, priority) => {
    try {
        const catTimes = RESOLUTION_TIMES[category] || RESOLUTION_TIMES['Other'];
        const eta = catTimes[priority] || catTimes['Medium'];
        logger.info(`[AI ETA] ${category}/${priority} → ${eta}`);
        return eta;
    } catch (err) {
        return '2-4 days';
    }
};

// ─── 6. DUPLICATE / SIMILAR COMPLAINT DETECTION (TF-IDF) ──────────────────

const TfIdf = natural.TfIdf;

/**
 * Check if a new complaint is similar to existing ones using TF-IDF cosine similarity
 * @param {string} newText - title + description of new complaint
 * @param {Array} existingComplaints - array of { _id, title, description, status }
 * @returns {{ isDuplicate: boolean, similarComplaints: Array, highestScore: number }}
 */
const detectDuplicates = (newText, existingComplaints) => {
    try {
        if (!existingComplaints || existingComplaints.length === 0) {
            return { isDuplicate: false, similarComplaints: [], highestScore: 0 };
        }

        const tfidf = new TfIdf();

        // Add new complaint as first document
        tfidf.addDocument(newText.toLowerCase());

        // Add existing complaints
        existingComplaints.forEach(c => {
            tfidf.addDocument(`${c.title} ${c.description}`.toLowerCase());
        });

        const similarities = [];
        const newTerms = {};

        // Get TF-IDF terms for the new document
        tfidf.listTerms(0).forEach(item => {
            newTerms[item.term] = item.tfidf;
        });

        // Compare with each existing complaint
        for (let i = 1; i <= existingComplaints.length; i++) {
            const existingTerms = {};
            tfidf.listTerms(i).forEach(item => {
                existingTerms[item.term] = item.tfidf;
            });

            // Cosine similarity
            const allTerms = new Set([...Object.keys(newTerms), ...Object.keys(existingTerms)]);
            let dotProduct = 0, magA = 0, magB = 0;
            allTerms.forEach(term => {
                const a = newTerms[term] || 0;
                const b = existingTerms[term] || 0;
                dotProduct += a * b;
                magA += a * a;
                magB += b * b;
            });
            const similarity = (magA && magB) ? dotProduct / (Math.sqrt(magA) * Math.sqrt(magB)) : 0;

            if (similarity > 0.35) {
                similarities.push({
                    complaint: existingComplaints[i - 1],
                    score: Math.round(similarity * 100),
                });
            }
        }

        similarities.sort((a, b) => b.score - a.score);
        const top = similarities.slice(0, 3);
        const highestScore = top.length > 0 ? top[0].score : 0;

        logger.info(`[AI Duplicate] Found ${top.length} similar complaints (highest: ${highestScore}%)`);
        return {
            isDuplicate: highestScore > 70,
            similarComplaints: top,
            highestScore,
        };
    } catch (err) {
        logger.error(`[AI Duplicate Error] ${err.message}`);
        return { isDuplicate: false, similarComplaints: [], highestScore: 0 };
    }
};

// ─── 7. COMBINED ANALYSIS (for /ai-suggest endpoint) ───────────────────────

/**
 * Run all AI analyses on text and return combined result
 */
const analyzeComplaint = (title, description, existingComplaints = []) => {
    const category = autoCategorizeComplaint(title, description);
    const priority = autoPrioritizeComplaint(title, description);
    const sentiment = analyzeSentiment(title, description);
    const estimatedTime = estimateResolutionTime(category, priority);
    const duplicates = detectDuplicates(`${title} ${description}`, existingComplaints);

    return {
        category,
        priority,
        sentiment,
        estimatedTime,
        duplicates,
    };
};

module.exports = {
    autoCategorizeComplaint,
    autoPrioritizeComplaint,
    analyzeSentiment,
    estimateResolutionTime,
    detectDuplicates,
    analyzeComplaint,
};
