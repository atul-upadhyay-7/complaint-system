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

module.exports = { autoCategorizeComplaint, autoPrioritizeComplaint };
