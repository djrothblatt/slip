const arithmeticTable     = require('./arith.js');
const consTable           = require('./cons.js');
const { makeInterpreter } = require('./slip.js');

//--------------------------------------------------------------------------------

const stdin = process.openStdin();
const interpreter = makeInterpreter(arithmeticTable, consTable);
stdin.addListener('data', d => console.log(interpreter(d.toString().trim())));
