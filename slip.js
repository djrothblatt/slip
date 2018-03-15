const { flip, partial, compose } = require('./helper');
const arithmeticTable            = require('./arith');

//--------------------------------------------------------------------------------

const lexSexp = (string) => string.replace(/\(/g, '( ').replace(/\)/g, ' )').split(' ');

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
    return parsed[0];
};

const interpretSexp = (sexp, table={}) => {
    if (sexp instanceof Array) {
        const [car, ...cdr] = sexp;
        const operator = interpretSexp(car, table);
        const operands = cdr.map(rand => interpretSexp(rand, table));
        return operator(...operands);
    }

    return parseFloat(sexp) || table[sexp] || sexp;
};

const stringToSexp = compose(parseSexp, lexSexp);

const evalSexp = (sexp, table) => interpretSexp(sexp[0], table);

const makeInterpreter = (...tables) => compose(partial(flip(evalSexp), combineTables(...tables)), stringToSexp);
