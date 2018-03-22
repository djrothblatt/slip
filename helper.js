const symb = (val) => typeof val === 'string' ? Symbol.for(val) : val;
const combineTables = (...tables) => Object.assign({}, ...tables);
const compose2 = (f, g) => x => f(g(x));
const compose = (...fns) => fns.reduce(compose2, identity);
const flip = (f) => (x, y) => f(y,x);
const identity = (x) => x;
const partial = (f, ...args) => (...moreArgs) => f(...args, ...moreArgs);
const zip = (xs, ys) => xs.map((x, i) => [x, ys[i]]);
const unzip = (xs) => xs.reduce((out, [left, right]) => [(out[0]).concat([left]),
                                                       (out[1]).concat([right])],
                               [[], []]);
const symbKeys = (pairs) => pairs.map(([k, v]) => [symb(k), v]);
const pairsToObject = (pairs) =>
      pairs.reduce((obj, [k, v]) => {
          obj[k] = v;
          return obj;
      }, {});
const symbKeysToObject = compose(pairsToObject, symbKeys);
const symbEntries = compose(symbKeysToObject, Object.entries);
const zipObject = compose(symbKeysToObject, zip);
module.exports = {
    symb,
    symbEntries,
    combineTables,
    compose,
    flip,
    identity,
    partial,
    unzip,
    zip,
    pairsToObject,
    zipObject
};
