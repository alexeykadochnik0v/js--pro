// Сложно вычисляемая функция. Хэш высчитывала.
// const sum = (a, b) => {
//     // Кэша
//     const result = a + b
//     return result
// } // Проще тестировать и т.д.

// const setSumToLS = (a, b, sum) {
//     localStorage.setItem('sum_${a}_${b}', result)
// }

// const res = sum(2, 4);
// setSumToLS(2, 4, res);

// const sum1 = (a, b) => {
//     const result = a + b
//     localStorage.setItem('sum_${a}_${b}', result)
//     return result
// }

const sum2 = (obj) => {
    const res = obj.a + obj.b;

    obj.a = 100;

    return res;
}

const myObj = { a: 2, b: 2 };

console.log('Before', myObj);

console.log(sum2(myObj));

console.log('After', myObj);