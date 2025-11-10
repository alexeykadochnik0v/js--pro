const numbers = [2, 7, 4, 9, 1, 6];

const sum = numbers
    .filter(n => n > 5)
    .reduce((acc, n) => acc + n, 0);

console.log(sum); // 22