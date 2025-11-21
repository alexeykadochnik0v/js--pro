const numbers = [2, 7, 4, 9, 1, 6];

const filteredNumbers = numbers.filter((n) => n > 5); // n => n > 5
const sum = filteredNumbers.reduce((acc, n) => acc + n, 0);

console.log(sum); // 22

// JS
// Сначала появились в библиотеках
// underscore, lodash и т.д.
