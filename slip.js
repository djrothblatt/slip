const {
    combineTables,
    compose,
    flip,
    partial,
    zipObject
}                     = require('./helper.js');
const arithmeticTable = require('./arith.js');
const consTable       = require('./cons.js');

//--------------------------------------------------------------------------------

const lexSexp = (string) => string
      .replace(/\(/g, ' ( ')
      .replace(/\)/g, ' ) ')
      .trim()
      .split(/ +/);

const parseToken = (token) => parseFloat(token) || token;

const parseSexp = (tokens) => {
    const parsed = [[]];
    tokens.forEach(token => {
        if (token === '(') {
            parsed.push([]);
        } else if (token === ')') {
            const temp = parsed.pop();
            parsed[parsed.length - 1].push(temp);
        } else {
            parsed[parsed.length - 1].push(parseToken(token));
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
        // special forms
        if (['lambda', 'λ', 'ל'].includes(car)) {
            const [args, body] = cdr; // (lambda (arg1 arg2 ...) body)
            return (...params) => evalSexp(body, { ...table, ...zipObject(args, params) });
        }
        if (car === 'define') {
            const [label, val] = cdr; // (define label val)
            if (Array.isArray(label)) { // (define (name args) val)
                // eventually we'll have macros and we can implement this with them
                // till then, we add the defun-style define here
                const [name, ...args] = label;
                evalSexp(['define', name, ['lambda', args, val]], table);
            } else {
                table[label] = evalSexp(val, table);
            }
            return null; // define shouldn't return anything useful
        }
        if (car === 'set!') {
            const [label, val] = cdr;
            if (!(label in table)) {
                throw new Error(`set! requires that ${label} be defined first. Try (define ${label} ${val})`);
            }
            table[label] = val;
            return null;
        }

        // function call
        const operator = evalSexp(car, table);
        const operands = cdr.map(rand => evalSexp(rand, table));
        return operator.call(null, ...operands);
    }

    return table[sexp] || sexp;
};

const stringToSexp = compose(parseSexp, lexSexp);

const makeInterpreter = (...tables) => compose(partial(flip(evalSexp), combineTables(...tables)), stringToSexp);

module.exports = {
    stringToSexp,
    evalSexp,
    makeInterpreter
};
