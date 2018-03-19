const cons = (car, cdr) => [car, cdr];
const list = (...items) => items.length === 0 ? [] : cons(items[0], list(...items.slice(1)));

//--------------------------------------------------------------------------------

const combineTables = (...tables) => Object.assign({}, ...tables);
const compose2 = (f, g) => x => f(g(x));
const compose = (...fns) => fns.reduce(compose2, identity);
const flip = (f) => (x, y) => f(y,x);
const identity = (x) => x;
const partial = (f, ...args) => (...moreArgs) => f(...args, ...moreArgs);
const zip = (xs, ys) => xs.map((x, i) => [x, ys[i]]);
const zipObject = (xs, ys) =>
      zip(xs, ys).reduce((obj, [k, v]) => {
          obj[k] = v;
          return obj;
      }, {});

module.exports = {
    cons,
    list,
    combineTables,
    compose,
    flip,
    identity,
    partial,
    zip,
    zipObject
};
