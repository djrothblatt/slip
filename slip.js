const {
    combineTables,
    compose,
    flip,
    partial,
    zipObject
} = require('./helper.js');

const {
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
      .replace(/\n/g, ' ')
      .replace(/\(/g, ' ( ')
      .replace(/\)/g, ' ) ')
      .trim()
      .split(/ +/);

const parseToken = (token) => {
    const maybeNumber = parseFloat(token);
    if (!Number.isNaN(maybeNumber)) {
        return maybeNumber;
    }
    return token;
};

const parseSexp = (tokens) => {
    let unmatchedParens = 0;
    const parsed = [[]];
    tokens.forEach(token => {
        if (token === '(') {
            unmatchedParens++;
            parsed.push([]);
        } else if (token === ')') {
            unmatchedParens--;
            if (unmatchedParens < 0) {
                throw { name: 'ParseError', message: 'UnmatchedCloseParenError'};
            }
            const temp = parsed.pop();
            parsed[parsed.length - 1].push(temp);
        } else {
            parsed[parsed.length - 1].push(parseToken(token));
        }
    });
    if (unmatchedParens !== 0) {
        throw { name: 'ParseError', message: 'UnmatchedOpenParenError'};
    }
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
        if (head === 'let') {
            // TODO: add named let
            const [bindings, body] = tail; // (let (b1 b2 ...) body)
            const evaluatedBindings = bindings.reduce(
                (out, [variable, value]) => {
                    out[variable] = evalSexp(value, table);
                    return out;
                },
                {...table});
            return evalSexp(body, { ...table, ...evaluatedBindings });
        }
        if (head === 'let*') {
            const [bindings, body] = tail; // (let* (b1 b2 ...) body)
            const evaluatedBindings = bindings.reduce(
                (out, [variable, value]) => {
                    out[variable] = evalSexp(value, out);
                    return out;
                },
                {...table}
            );
            return evalSexp(body, { ...table, ...evaluatedBindings });
        }
        if (['lambda', 'λ', 'ל'].includes(head)) {
            const [args, body] = tail; // (lambda (arg1 arg2 ...) body)
            return (...params) => evalSexp(body, { ...table, ...zipObject(args, params) });
        }
        if (head === 'begin') { // (begin form1 ...)
            return tail.reduce((_, form) => evalSexp(form, table), null);
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
        return operator(...operands);
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
