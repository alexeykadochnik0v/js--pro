// ✅ чистая
function square(x) {
  return x * x;
}

// ❌ нечистая — использует и меняет внешнюю переменную
let count = 0;
function increment() {
  count++;
  return count;
}
