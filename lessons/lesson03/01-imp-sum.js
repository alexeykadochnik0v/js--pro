const numbers = [2, 7, 4, 9, 1, 6];

let sum = 0; // явно создаём переменную
for (let i = 0; i < numbers.length; i++) {
  if (numbers[i] > 5) {
    sum += numbers[i];
  }
}

console.log(sum);

// Здесь разработчик контролирует каждый шаг: цикл, проверку, накопление суммы.
