// ✅ детерминированная функция
function add(a, b) {
  return a + b;
}

console.log(add(2, 3)); // 5
console.log(add(2, 3)); // 5 — всегда одинаково

// ❌ недетерминированная (использует случайность)
function randomAdd(a) {
  return a + Math.random();
}

console.log(randomAdd(2)); // каждый раз другое значение
