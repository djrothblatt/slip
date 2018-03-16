const combineTables = (...tables) => Object.assign({}, ...tables);
const compose = (...fns) => fns.reduce(compose2, identity);
const compose2 = (f, g) => x => f(g(x));
const flip = (f) => (x, y) => f(y,x);
const identity = (x) => x;
const partial = (f, ...args) => (...moreArgs) => f(...args, ...moreArgs);
const zip = (xs, ys) => xs.map((x, i) => [x, ys[i]]);
const zipObject = (xs, ys) => {
    const obj = {};
    zip(xs, ys)
        .forEach(([x, y]) => obj[x] = y);

    return obj;
};

module.exports = {
    combineTables,
    compose,
    flip,
    identity,
    partial,
    zip,
    zipObject
};
