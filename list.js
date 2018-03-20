
/* List Accessors */
const car = ([head, _]) => head;
const cdr = ([_, tail]) => tail;

/* List Constructors */
const cons = (car, cdr) => [car, cdr];
const list = (...items) => items.length === 0 ? [] : cons(items[0], list(...items.slice(1)));

/* List Operations */
const append = (...lists) => {
     if (lists.length === 0) {
         return [];
     }
    const [firstList, ...rest] = lists;
    const first = car(firstList);
    if (first === undefined || Array.isArray(first) && first.length === 0) {
        return append(...rest);
    }
    return cons(first, (append(cdr(firstList), ...rest)));
};

module.exports = {
    car,
    cdr,
    cons,
    list,
    append
};

