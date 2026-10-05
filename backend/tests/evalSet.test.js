process.env.NODE_ENV = 'production';
const test = require('node:test');
const assert = require('node:assert/strict');
const { loadSet } = require('../eval/load');
const { assessComplaint } = require('../services/aiAssessment');

const CATS = ['Electricity', 'Water', 'Cleanliness', 'Maintenance', 'Internet', 'Security', 'Food', 'Other'];

test('evaluation set is well formed', () => {
    const set = loadSet();
    assert.ok(set.length >= 150);
    for (const r of set) {
        assert.ok(CATS.includes(r.category), `row ${r.id} category`);
        assert.ok(['Low', 'Medium', 'High', 'Critical'].includes(r.priority), `row ${r.id} priority`);
        assert.ok(['Urgent', 'Frustrated', 'Neutral', 'Polite'].includes(r.sentiment), `row ${r.id} sentiment`);
        assert.ok(r.text.length > 5, `row ${r.id} text`);
    }
    assert.equal(new Set(set.map(r => r.text)).size, set.length, 'duplicate texts');
    const held = set.filter(r => r.split === 'heldout').length;
    assert.ok(held > 40 && held < set.length / 2);
});

// Regression guard: every complaint the dataset labels Critical must come out at least High.
test('no Critical-labelled complaint is rated below High', () => {
    for (const r of loadSet().filter(r => r.priority === 'Critical')) {
        const a = assessComplaint({ title: r.text, description: '', priority: 'Low' });
        assert.ok(['High', 'Critical'].includes(a.priority), `row ${r.id}: ${r.text} -> ${a.priority}`);
    }
});
