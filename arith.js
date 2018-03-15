const makeVariadicArith = (fn, identity, requiredArgs=0) => (...args) =>
    args.length >= requiredArgs ?
    args.reduce(fn, identity) :
    new Error(`Requires ${requiredArgs} arguments!`);

const arithmeticTable = {
    "+": makeVariadicArith((x, y) => x + y, 0),
    "-": makeVariadicArith((x, y) => x - y, 0, 1),
    "*": makeVariadicArith((x, y) => x * y, 1),
    "/": makeVariadicArith((x, y) => x / y, 1, 1),
    "=": (first, ...rest) => rest.every(val => val === first),
    "/=": (first, ...rest) => {
        const seen = [first];
        for (const item of rest) {
            if (seen.some(x => item === x)) {
                return false;
            }
            seen.push(item);
        };
        return true;
    }
};

module.exports = arithmeticTable;
