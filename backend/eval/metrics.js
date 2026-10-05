// Small metrics helpers for the AI evaluation (no dependencies).
const accuracy = (pairs) => pairs.length ? pairs.filter(([t, p]) => t === p).length / pairs.length : 0;

const confusion = (pairs, labels) => {
    const m = {};
    labels.forEach(t => { m[t] = {}; labels.forEach(p => { m[t][p] = 0; }); });
    pairs.forEach(([t, p]) => { if (m[t] && p in m[t]) m[t][p]++; });
    return m;
};

const perClass = (pairs, labels) => labels.map(l => {
    const tp = pairs.filter(([t, p]) => t === l && p === l).length;
    const fp = pairs.filter(([t, p]) => t !== l && p === l).length;
    const fn = pairs.filter(([t, p]) => t === l && p !== l).length;
    const precision = tp + fp ? tp / (tp + fp) : 0;
    const recall = tp + fn ? tp / (tp + fn) : 0;
    const f1 = precision + recall ? (2 * precision * recall) / (precision + recall) : 0;
    return { label: l, support: tp + fn, precision, recall, f1 };
});

const macroF1 = (rows) => {
    const used = rows.filter(r => r.support > 0);
    return used.length ? used.reduce((s, r) => s + r.f1, 0) / used.length : 0;
};

module.exports = { accuracy, confusion, perClass, macroF1 };
