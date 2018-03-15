const flip = (f) => (x, y) => f(y,x);
const partial = (f, ...args) => (...moreArgs) => f(...args, ...moreArgs);
const identity = (x) => x;
const compose2 = (f, g) => x => f(g(x));
const compose = (...fns) => fns.reduce(compose2, identity);

module.exports = {
    flip,
    partial,
    compose,
    identity
};
