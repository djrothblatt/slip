const repl                = require('repl');
const arithmeticTable     = require('./tables/arith.js');
const consTable           = require('./tables/cons.js');
const truthTable          = require('./tables/truth.js');
const { makeInterpreter } = require('./slip.js');

//--------------------------------------------------------------------------------

const interpreter = makeInterpreter(arithmeticTable, consTable, truthTable);

const r = repl.start({
    prompt: 'slip> ',
    eval: (cmd, context, filename, callback) => {
        let res;
        try {
            res = interpreter(cmd);
        } catch (e) {
            if (e.message === 'UnmatchedOpenParenError') {
                return callback(new repl.Recoverable(e));
            }
        }
        callback(null, res);
    }
});
