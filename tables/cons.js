const consTable = {
    cons: (car, cdr) => [car, cdr],
    car: ([head, _]) => head,
    cdr: ([_, tail]) => tail,
    null: []
};

module.exports = consTable;
