// аргументы по умолчанию
const defaultParams = (arg1, answer = 42) => {};
console.log(defaultParams.length); // 0
// остаточные параметры, rest
const restParams = (arg1, ...args) => {};
console.log(restParams.length); // 0
// деструктуризация
const destructuring = ({ target }) => {};
console.log(destructuring.length); // 1

/*
fn.length показывает количество объявленных параметров функции,
до первого параметра, у которого есть значение по умолчанию, 
rest-параметр (...args) или деструктуризация с дефолтом.
*/
