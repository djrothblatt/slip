const arithmeticTable     = require('./tables/arith.js');
const consTable           = require('./tables/cons.js');
const truthTable          = require('./tables/truth.js');
const { makeInterpreter } = require('./slip.js');

//--------------------------------------------------------------------------------

const stdin = process.openStdin();
const interpreter = makeInterpreter(arithmeticTable, consTable, truthTable);
stdin.addListener('data', d => console.log(interpreter(d.toString().trim())));
