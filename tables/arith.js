const makeVariadicArith = (fn, identity, requiredArgs=0) => (...args) =>
    args.length >= requiredArgs ?
    args.reduce(fn, identity) :
    new Error(`Requires ${requiredArgs} arguments!`);

const makeVariadicComparison = (fn) => (first, ...rest) =>
      !!rest.reduce((val, next) => {
          if (val !== false) {
              if (fn(val, next)) {
                  return next;
              }
              return false;
          }
          return false;
      }, first);

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
    },
    "<": makeVariadicComparison((val, next) => val < next),
    "<=": makeVariadicComparison((val, next) => val <= next),
    ">": makeVariadicComparison((val, next) => val > next),
    ">=": makeVariadicComparison((val, next) => val >= next),
    "zero?": (n) => n === 0,
    "positive?": (n) => n > 0,
    "negative?": (n) => n < 0
};

module.exports = arithmeticTable;
