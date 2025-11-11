const sum = (x, y, z) => x + y + z;

const curriedSum = curry(sum);

console.log(curriedSum(1)(2));
console.log(curriedSum(1)(2)(3));     // 6
// console.log(curriedSum(1, 2)(3));     // 6
// console.log(curriedSum(1)(2, 3));     // 6
// console.log(curriedSum(1, 2, 3));     // 6

function curry(fn) {
  return function curried(...args) {
    // если аргументов достаточно → вызываем оригинальную функцию
    if (args.length >= fn.length) {
      return fn(...args);
    }
    // иначе возвращаем новую функцию, ожидающую оставшиеся аргументы
    return (...nextArgs) => curried(...args, ...nextArgs);
  };
}