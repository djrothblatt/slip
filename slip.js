const {
    combineTables,
    compose,
    flip,
    partial,
    zipObject
} = require('./helper.js');

const {
    car,
    cdr,
    cons,
    list,
    append
} = require('./list.js');

//--------------------------------------------------------------------------------

const expandQuasiquote = (quasiquoted, table) => {
    if (!Array.isArray(quasiquoted)) {
        return list(quasiquoted);
    }
    if (quasiquoted.length === 0) {
        return list();
    }

    const [head, ...tail] = quasiquoted;
    if (head === 'unquote') { // (unquote sexp) or ,sexp
        return list(evalSexp(tail[0], table));
    }
    if (head === 'unquote-splicing') { // (unquote-splicing sexp) or ,@sexp
        return evalSexp(tail[0], table);
    }
    return append(expandQuasiquote(head, table),
                  expandQuasiquote(tail, table));
};

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
        const [head, ...tail] = sexp;
        // special forms
        if (head === 'quote') {
            return list(...tail[0]);
        }
        if (head === 'quasiquote') {
            return expandQuasiquote(tail, table);
        }
        if (head === 'if') {
            const [test, consequent, alternative] = tail;
            return evalSexp((evalSexp(test, table) ?
                             consequent :
                             alternative), table);
        }
        if (['lambda', 'λ', 'ל'].includes(head)) {
            const [args, body] = tail; // (lambda (arg1 arg2 ...) body)
            return (...params) => evalSexp(body, { ...table, ...zipObject(args, params) });
        }
        if (head === 'define') {
            const [label, val] = tail; // (define label val)
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
        if (head === 'set!') {
            const [label, val] = tail;
            if (!(label in table)) {
                throw new Error(`set! requires that ${label} be defined first. Try (define ${label} ${val})`);
            }
            table[label] = val;
            return null;
        }

        // function call
        const operator = evalSexp(head, table);
        const operands = tail.map(rand => {
            return evalSexp(rand, table);
        });
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
