const fs = require('fs');
const path = require('path');

// Rows are "category|priority|sentiment|text". Every third row (index % 3 === 2)
// is the held-out split: it was fixed before any tuning and is never used to
// choose thresholds, keywords or rules.
const loadSet = () => fs.readFileSync(path.join(__dirname, 'ai_eval_set.psv'), 'utf8')
    .split('\n').filter(Boolean).map((line, i) => {
        const [category, priority, sentiment, ...rest] = line.split('|');
        return { id: i + 1, split: i % 3 === 2 ? 'heldout' : 'dev', category, priority, sentiment, text: rest.join('|') };
    });

module.exports = { loadSet };
