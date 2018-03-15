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

module.exports = arithmeticTable;
