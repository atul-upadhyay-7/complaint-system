process.env.NODE_ENV = 'production'; // quiet logger
const test = require('node:test');
const assert = require('node:assert/strict');
const { assessComplaint, detectSafety, maxPriority } = require('../services/aiAssessment');

const run = (text, extra = {}) => assessComplaint({ title: text, description: '', ...extra });

test('safety rules force at least High and flag for review', () => {
    for (const t of [
        'Sparking from the switchboard near my bed',
        'Smell of gas near the kitchen',
        'Fire in the pantry, smoke is spreading',
        'Student got an electric shock from the geyser switch',
        'Ceiling plaster fell near my bed',
        'A student is injured after a fight',
        'Burst pipe is flooding the corridor',
    ]) {
        const a = run(t, { priority: 'Low' });
        assert.equal(a.safetyFlag, true, t);
        assert.ok(['High', 'Critical'].includes(a.priority), `${t} -> ${a.priority}`);
        assert.equal(a.needsReview, true, t);
    }
});

test('safety rules ignore negations and fire alarm panels', () => {
    assert.deepEqual(detectSafety('There is no fire, only a loose cover'), []);
    assert.deepEqual(detectSafety('Fire alarm panel shows a fault light'), []);
    assert.deepEqual(detectSafety('Fan is not working'), []);
});

test('AI can only raise the priority the student chose', () => {
    const a = run('Tube light in the corridor is fused', { priority: 'High' });
    assert.equal(a.priority, 'High');
    const b = run('Tube light in the corridor is fused', { priority: 'Critical' });
    assert.equal(b.priority, 'Critical');
    const c = run('No water since two days, this is terrible', { priority: 'Low' });
    assert.ok(['High', 'Critical'].includes(c.priority));
    assert.equal(maxPriority('Low', 'High', 'Medium'), 'High');
});

test('without a student priority the AI decides, falling back to Medium only when it cannot', () => {
    assert.equal(run('Slow drip from the tap, minor').priority, 'Low');
    process.env.AI_ENABLED = 'false';
    try {
        assert.equal(run('Fan in room 12 is not working').priority, 'Medium');
    } finally { delete process.env.AI_ENABLED; }
});

test('kill switch: AI_ENABLED=false returns no AI output but keeps safety rules', () => {
    process.env.AI_ENABLED = 'false';
    try {
        const a = run('Fan is not working');
        assert.equal(a.enabled, false);
        assert.equal(a.aiCategory, null);
        assert.equal(a.aiSentiment, null);
        assert.equal(a.needsReview, true);
        assert.ok(a.reviewReasons.includes('ai-disabled'));
        const s = run('Sparking from the socket', { priority: 'Low' });
        assert.equal(s.safetyFlag, true);
        assert.equal(s.priority, 'High');
    } finally { delete process.env.AI_ENABLED; }
});

test('unrecognised text gets low category confidence and a review flag', () => {
    const a = run('Parking space is not enough for bikes');
    assert.ok(a.confidence.category < 0.6, `confidence ${a.confidence.category}`);
    assert.equal(a.needsReview, true);
});

test('clear single-topic text is confident and not flagged', () => {
    const a = run('Wifi is not connecting and the internet router is down');
    assert.equal(a.aiCategory, 'Internet');
    assert.ok(a.confidence.category >= 0.6);
    assert.equal(a.needsReview, false);
});

test('short keywords do not match inside longer words', () => {
    const a = run('Need a bonafide certificate for a bank account');
    assert.notEqual(a.aiCategory, 'Electricity');
});

test('neutral text with no cue words has low sentiment confidence', () => {
    const a = run('The door lock is broken');
    assert.equal(a.sentimentBasis, 'none');
    assert.ok(a.confidence.sentiment < 0.5);
});

test('student category that the AI confidently disagrees with is flagged', () => {
    const a = run('Wifi router is down and internet is not working', { category: 'Food' });
    assert.equal(a.needsReview, true);
    assert.ok(a.reviewReasons.some(r => r.includes("student's choice")));
});

test('never throws on empty or odd input', () => {
    for (const input of [{}, { title: '' }, { title: null, description: undefined }, { title: 'x'.repeat(5000) }]) {
        const a = assessComplaint(input);
        assert.ok(a && typeof a.needsReview === 'boolean');
    }
});

test('assessment shape contains everything the model stores', () => {
    const a = run('Fan in room 12 is not working', { category: 'Electricity' });
    for (const k of ['priority', 'aiCategory', 'aiPriority', 'aiSentiment', 'confidence', 'sentimentBasis', 'safetyFlag', 'needsReview', 'reviewReasons']) {
        assert.ok(k in a, k);
    }
    assert.ok(['Low', 'Medium', 'High', 'Critical'].includes(a.priority));
});
