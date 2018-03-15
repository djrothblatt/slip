const flip = (f) => (x, y) => f(y,x);
const partial = (f, ...args) => (...moreArgs) => f(...args, ...moreArgs);
const compose2 = (f, g) => x => f(g(x));
const identity = (x) => x;
const compose = (...fns) => fns.reduce(compose2, identity);

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

const makeVariadicArith = (fn, identity, requiredArgs=0) => (...args) =>
    args.length >= requiredArgs ?
    args.reduce(fn, identity) :
    new Error(`Requires ${requiredArgs} arguments!`);

const arithmeticTable = {
    "+": makeVariadicArith((x, y) => x + y, 0),
    "-": makeVariadicArith((x, y) => x - y, 0, 1),
    "*": makeVariadicArith((x, y) => x * y, 1),
    "/": makeVariadicArith((x, y) => x / y, 1, 1)
};

const stringToSexp = compose(parseSexp, lexSexp);
const evalSexp = (sexp, table) => interpretSexp(sexp[0], table);

const makeInterpreter = (table) => compose(partial(flip(evalSexp), table), stringToSexp);

const arithmeticInterpreter = makeInterpreter(arithmeticTable);
