
// аргументы по умолчанию
const defaultParams = (answer = 42) => { }
defaultParams.length // 0
// остаточные параметры, rest
const restParams = (...args) => { }
restParams.length // 0
// деструктуризация
const destructuring = ({ target }) => { }
destructuring.length // 1

/*
fn.length показывает количество объявленных параметров функции,
до первого параметра, у которого есть значение по умолчанию, rest-параметр (...args) или деструктуризация с дефолтом.
*