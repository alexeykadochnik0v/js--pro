// факториал (n!)
function factorial(n) {
  if (n === 0) return 1; // базовый случай
  return n * factorial(n - 1); // рекурсивный вызов
}

console.log(factorial(5)); // 120

// ✅ чистая рекурсивная функция
function sum(arr) {
  if (arr.length === 0) return 0;
  const [head, ...tail] = arr;
  return head + sum(tail);
}

console.log(sum([1, 2, 3])); // 6

function sumTail(arr, acc = 0) {
  if (arr.length === 0) return acc;
  const [head, ...tail] = arr;
  return sumTail(tail, acc + head);
}
