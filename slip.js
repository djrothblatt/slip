const {
    flip,
    partial,
    compose,
    combineTables
}                     = require('./helper.js');
const arithmeticTable = require('./arith.js');
const consTable       = require('./cons.js');

//--------------------------------------------------------------------------------

const lexSexp = (string) => string
      .replace(/\(/g, ' ( ')
      .replace(/\)/g, ' ) ')
      .trim()
      .split(/ +/);

const parseSexp = (tokens) => {
    const parsed = [[]];
    tokens.forEach(token => {
        if (token === '(') {
            parsed.push([]);
        } else if (token === ')') {
            const temp = parsed.pop();
            parsed[parsed.length - 1].push(temp);
        } else {
            parsed[parsed.length - 1].push(token);
        }
    });
    const inner = parsed[0];
    if (Array.isArray(inner)) {
        return inner[0];
    }
    return inner;
};

const evalSexp = (sexp, table={}) => {
    if (Array.isArray(sexp)) {
        const [car, ...cdr] = sexp;
        const operator = evalSexp(car, table);
        const operands = cdr.map(rand => evalSexp(rand, table));
        return operator(...operands);
    }

    return parseFloat(sexp) || table[sexp] || sexp;
};

const stringToSexp = compose(parseSexp, lexSexp);

const makeInterpreter = (...tables) => compose(partial(flip(evalSexp), combineTables(...tables)), stringToSexp);
