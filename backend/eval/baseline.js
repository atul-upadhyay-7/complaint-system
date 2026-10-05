const ai = require('../services/aiService');
const { loadSet } = require('./load');
const M = require('./metrics');
const set = loadSet();
const run = (rows) => ({
  cat: rows.map(r => [r.category, ai.autoCategorizeComplaint(r.text, '')]),
  pri: rows.map(r => [r.priority, ai.autoPrioritizeComplaint(r.text, '')]),
  sen: rows.map(r => [r.sentiment, ai.analyzeSentiment(r.text, '').sentiment]),
});
for (const s of ['dev','heldout','all']) {
  const rows = s==='all'?set:set.filter(r=>r.split===s); const o = run(rows);
  console.log(s, rows.length, 'cat', M.accuracy(o.cat).toFixed(3), 'pri', M.accuracy(o.pri).toFixed(3), 'sen', M.accuracy(o.sen).toFixed(3));
}
const o = run(set);
const L=['Urgent','Frustrated','Neutral','Polite'];
console.log(M.perClass(o.sen,L).map(r=>`${r.label} p${r.precision.toFixed(2)} r${r.recall.toFixed(2)}`).join(' | '));
const P=['Critical','High','Medium','Low'];
console.log(M.perClass(o.pri,P).map(r=>`${r.label} p${r.precision.toFixed(2)} r${r.recall.toFixed(2)}`).join(' | '));
// critical misses
set.forEach((r,i)=>{ if(r.priority==='Critical' && o.pri[i][1]!=='Critical') console.log('CRIT MISS',r.id,o.pri[i][1],r.text); });
