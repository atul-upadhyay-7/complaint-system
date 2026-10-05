/**
 * AI evaluation harness.  Usage:  npm run eval:ai [-- --write-doc]
 *
 * Compares the original engine ("baseline": aiService.js alone) with the engine
 * plus the safety net ("with safety net": aiAssessment.js) on the labelled set
 * in ai_eval_set.psv. Everything is reported for the dev split, the held-out
 * split and overall. Tuning looked only at dev rows; held-out totals are shown
 * as a sanity check, not as a blind test.
 */
process.env.NODE_ENV = process.env.NODE_ENV || 'production'; // quiets the logger (warn level)
const fs = require('fs');
const path = require('path');
const ai = require('../services/aiService');
const { assessComplaint } = require('../services/aiAssessment');
const { loadSet } = require('./load');
const M = require('./metrics');

const CATS = ['Electricity', 'Water', 'Cleanliness', 'Maintenance', 'Internet', 'Security', 'Food', 'Other'];
const PRIS = ['Critical', 'High', 'Medium', 'Low'];
const SENS = ['Urgent', 'Frustrated', 'Neutral', 'Polite'];
const rank = (p) => PRIS.length - 1 - PRIS.indexOf(p); // Low=0 ... Critical=3
const pct = (x) => `${(x * 100).toFixed(1)}%`;

const evaluate = (rows) => {
    const base = rows.map(r => ({
        r,
        cat: ai.autoCategorizeComplaint(r.text, ''),
        pri: ai.autoPrioritizeComplaint(r.text, ''),
        sen: ai.analyzeSentiment(r.text, '').sentiment,
    }));
    // The submit form sends no priority, so the final priority is decided by the AI +
    // safety rules alone. Passing 'Low' models that (it is the floor).
    const net = rows.map(r => ({ r, a: assessComplaint({ title: r.text, description: '', priority: 'Low' }) }));

    const out = { n: rows.length };
    out.base = {
        cat: M.accuracy(base.map(x => [x.r.category, x.cat])),
        pri: M.accuracy(base.map(x => [x.r.priority, x.pri])),
        sen: M.accuracy(base.map(x => [x.r.sentiment, x.sen])),
    };
    out.net = {
        cat: M.accuracy(net.map(x => [x.r.category, x.a.aiCategory])),
        pri: M.accuracy(net.map(x => [x.r.priority, x.a.priority])),
        sen: M.accuracy(net.map(x => [x.r.sentiment, x.a.aiSentiment])),
    };

    // Priority safety: under-triage = final priority lower than the true one.
    const sev = (list, get) => {
        const s = list.filter(x => rank(x.r.priority) >= 2);               // truly High or Critical
        const crit = list.filter(x => x.r.priority === 'Critical');
        return {
            nSevere: s.length,
            underTriageSevere: s.length ? s.filter(x => rank(get(x)) < rank(x.r.priority)).length / s.length : 0,
            nCritical: crit.length,
            criticalAtLeastHigh: crit.length ? crit.filter(x => rank(get(x)) >= 2).length / crit.length : 0,
            criticalExact: crit.length ? crit.filter(x => get(x) === 'Critical').length / crit.length : 0,
        };
    };
    out.baseSafety = sev(base, x => x.pri);
    out.netSafety = sev(net, x => x.a.priority);

    // Safety rule precision: flagged items whose true priority is High or Critical.
    const flagged = net.filter(x => x.a.safetyFlag);
    out.safetyRule = {
        flagged: flagged.length,
        precisionHighPlus: flagged.length ? flagged.filter(x => rank(x.r.priority) >= 2).length / flagged.length : 0,
        falseAlarms: flagged.filter(x => rank(x.r.priority) < 2).map(x => x.r.text),
    };

    // Review queue
    const rev = net.filter(x => x.a.needsReview);
    const catWrong = net.filter(x => x.a.aiCategory !== x.r.category);
    const priWrong = net.filter(x => x.a.aiPriority !== x.r.priority);
    out.review = {
        rate: rev.length / net.length,
        catErrorsCaught: catWrong.length ? catWrong.filter(x => x.a.needsReview).length / catWrong.length : 0,
        catConfident: net.filter(x => x.a.confidence.category >= 0.6),
    };
    const conf = out.review.catConfident;
    out.review.catAccConfident = conf.length ? M.accuracy(conf.map(x => [x.r.category, x.a.aiCategory])) : 0;
    out.review.catCoverage = conf.length / net.length;
    const low = net.filter(x => x.a.confidence.category < 0.6);
    out.review.catAccLow = low.length ? M.accuracy(low.map(x => [x.r.category, x.a.aiCategory])) : 0;
    out.review.catLowN = low.length;

    // Sentiment abstention
    const answered = net.filter(x => x.a.confidence.sentiment >= 0.5);
    out.sentAbstain = {
        coverage: answered.length / net.length,
        accAnswered: answered.length ? M.accuracy(answered.map(x => [x.r.sentiment, x.a.aiSentiment])) : 0,
        accAbstained: net.length - answered.length
            ? M.accuracy(net.filter(x => x.a.confidence.sentiment < 0.5).map(x => [x.r.sentiment, x.a.aiSentiment])) : 0,
        nonNeutralMissedSilently: base.filter(x => x.r.sentiment !== 'Neutral' && x.sen === 'Neutral').length,
        nonNeutralTotal: base.filter(x => x.r.sentiment !== 'Neutral').length,
        nonNeutralMissedAndLabelledConfident: net.filter(x => x.r.sentiment !== 'Neutral' && x.a.aiSentiment === 'Neutral' && x.a.confidence.sentiment >= 0.5).length,
    };
    out.rows = { base, net };
    return out;
};

const set = loadSet();
const splits = { dev: set.filter(r => r.split === 'dev'), heldout: set.filter(r => r.split === 'heldout'), all: set };
const res = Object.fromEntries(Object.entries(splits).map(([k, v]) => [k, evaluate(v)]));

const report = () => {
    const L = [];
    const row = (cells) => L.push(`| ${cells.join(' | ')} |`);
    const head = (cells) => { row(cells); row(cells.map(() => '---')); };
    L.push('# Uniissuehub AI evaluation', '');
    L.push('Generated by `npm run eval:ai` (backend). Do not edit by hand.', '');
    L.push('## What this measures', '');
    L.push(`- ${set.length} labelled campus complaints in \`backend/eval/ai_eval_set.psv\` (synthetic, written in the style of hostel complaints, including negation, Hinglish and non-complaints; no real student data). Labels follow the rubric below.`);
    L.push(`- Split: ${splits.dev.length} dev rows and ${splits.heldout.length} held-out rows (every third row). Thresholds and rules were adjusted only while looking at dev rows. The harness printed held-out totals too, so they are a sanity check on the dev work, not a blind test. The baseline column does not depend on any tuning.`);
    L.push('- **Baseline** = the original engine alone (`aiService.js`). **With safety net** = `aiAssessment.js` (confidence, safety rules, only-raise priority).');
    L.push('- The submit form does not send a priority, so the final priority comes only from the AI and the safety rules (modelled as a student priority of Low, the floor). If a student does pick a priority, the AI can only raise it.');
    L.push('- The labels were written by one person (the developer), so they are a reasonable reference but not ground truth. Treat the numbers as a regression benchmark, not as a claim about accuracy on real traffic.', '');
    L.push('Rubric: **Critical** = immediate danger to people (fire, shock, gas, flooding, injury, collapse). **High** = essential service out for long, theft/harassment, health risk, exam impact. **Medium** = ordinary fault. **Low** = cosmetic or suggestion.');
    L.push('Sentiment: **Urgent** = danger or time-critical. **Frustrated** = explicit dissatisfaction or repeated unresolved problem. **Polite** = courteous request or thanks. **Neutral** = plain factual report.', '');

    L.push('## Headline results', '');
    head(['Metric', 'Baseline (all)', 'With safety net (all)', 'Baseline (held-out)', 'With safety net (held-out)']);
    const a = res.all, h = res.heldout;
    row(['Category accuracy', pct(a.base.cat), pct(a.net.cat), pct(h.base.cat), pct(h.net.cat)]);
    row(['Priority exact accuracy', pct(a.base.pri), pct(a.net.pri), pct(h.base.pri), pct(h.net.pri)]);
    row([`Under-triage of High/Critical items (n=${a.netSafety.nSevere}/${h.netSafety.nSevere})`, pct(a.baseSafety.underTriageSevere), pct(a.netSafety.underTriageSevere), pct(h.baseSafety.underTriageSevere), pct(h.netSafety.underTriageSevere)]);
    row([`Critical items rated at least High (n=${a.netSafety.nCritical}/${h.netSafety.nCritical})`, pct(a.baseSafety.criticalAtLeastHigh), pct(a.netSafety.criticalAtLeastHigh), pct(h.baseSafety.criticalAtLeastHigh), pct(h.netSafety.criticalAtLeastHigh)]);
    row(['Sentiment accuracy (all items)', pct(a.base.sen), pct(a.net.sen), pct(h.base.sen), pct(h.net.sen)]);
    L.push('', 'Under-triage = the final priority is lower than the true one. Lower is better.', '');

    L.push('## Review queue and confidence', '');
    head(['Metric', 'Dev', 'Held-out', 'All']);
    const cols = [res.dev, res.heldout, res.all];
    row(['Complaints flagged "needs review"', ...cols.map(c => pct(c.review.rate))]);
    row(['Wrong category suggestions that were flagged for review', ...cols.map(c => pct(c.review.catErrorsCaught))]);
    row(['Category accuracy when confidence >= 0.6', ...cols.map(c => `${pct(c.review.catAccConfident)} (covers ${pct(c.review.catCoverage)})`)]);
    row(['Category accuracy when confidence < 0.6', ...cols.map(c => `${pct(c.review.catAccLow)} (n=${c.review.catLowN})`)]);
    row(['Safety rule fires on', ...cols.map(c => `${c.safetyRule.flagged} items`)]);
    row(['Safety rule precision (flagged items truly High/Critical)', ...cols.map(c => pct(c.safetyRule.precisionHighPlus))]);
    L.push('');

    L.push('## Sentiment (baseline engine is unchanged in this stage)', '');
    head(['Metric', 'Dev', 'Held-out', 'All']);
    row(['Accuracy on items with a clear cue (confidence >= 0.5)', ...cols.map(c => `${pct(c.sentAbstain.accAnswered)} (covers ${pct(c.sentAbstain.coverage)})`)]);
    row(['Accuracy on items with no clear cue', ...cols.map(c => pct(c.sentAbstain.accAbstained))]);
    row(['Non-neutral complaints the baseline labelled Neutral', ...cols.map(c => `${c.sentAbstain.nonNeutralMissedSilently} of ${c.sentAbstain.nonNeutralTotal}`)]);
    row(['...of those, still shown as a confident Neutral with the safety net', ...cols.map(c => String(c.sentAbstain.nonNeutralMissedAndLabelledConfident))]);
    L.push('', 'With the safety net a Neutral label without any cue word gets confidence 0.3, so the UI can hide it instead of presenting it as a fact. Improving the sentiment model itself is planned for the next stage.', '');

    L.push('## Per-class sentiment (baseline engine, all items)', '');
    head(['Class', 'Support', 'Precision', 'Recall', 'F1']);
    const pcs = M.perClass(a.rows.base.map(x => [x.r.sentiment, x.sen]), SENS);
    pcs.forEach(r => row([r.label, r.support, pct(r.precision), pct(r.recall), pct(r.f1)]));
    L.push('', `Macro F1: ${pct(M.macroF1(pcs))}`, '');

    L.push('## Priority confusion (final priority with safety net; rows = true, columns = predicted)', '');
    const cm = M.confusion(a.rows.net.map(x => [x.r.priority, x.a.priority]), PRIS);
    head(['true \\ pred', ...PRIS]);
    PRIS.forEach(t => row([t, ...PRIS.map(p => cm[t][p])]));
    L.push('');

    if (a.safetyRule.falseAlarms.length) {
        L.push('## Safety rule false alarms (flagged but labelled below High)', '');
        a.safetyRule.falseAlarms.forEach(t => L.push(`- ${t}`));
        L.push('');
    }
    L.push('## Known limits', '');
    L.push('- Small synthetic set written by the developer; real complaints will be messier.');
    L.push('- Keyword engines miss paraphrases. The confidence values are heuristics, not calibrated probabilities.');
    L.push('- Category is advisory only: the student chooses it. Priority is the only AI output that changes routing, and it can only go up.');
    return L.join('\n') + '\n';
};

const md = report();
if (process.argv.includes('--write-doc')) {
    const out = path.join(__dirname, '..', '..', 'docs', 'AI_EVALUATION.md');
    fs.mkdirSync(path.dirname(out), { recursive: true });
    fs.writeFileSync(out, md);
    console.log(`Wrote ${out}`);
} else {
    console.log(md);
}
module.exports = { res };
