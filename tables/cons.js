const { car, cdr, cons, list, append } = require('../list.js');

//--------------------------------------------------------------------------------

const consTable = {
    cons,
    list,
    append,
    car,
    cdr,
    null: []
};

module.exports = consTable;
