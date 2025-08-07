---
title: "Урок 3: Основы функционального программирования"
description: "Функции высшего порядка, чистые функции, неизменяемость данных"
---

# OTUS

## Javascript Pro

<!-- v -->

## Как меня слышно и видно?

> Напишите в чат

- **+** если все хорошо
- **–** если есть проблемы со звуком или с видео

<!-- v -->

## Цели занятия

- Освоить базовые концепции функционального программирования в JavaScript
- Понимать принципы чистых функций и их преимущества
- Применять функции высшего порядка в практических задачах
- Работать с неизменяемыми данными

<!-- v -->

## План вебинара:

- Чистые функции
- Immutable data
- Функции как first class citizens
- Функции высшего порядка
- Декларативный VS императивный подходы
- Семантика методов массива
- Композиция и каррирование

<!-- v -->

## Результат занятия

Примеры функций высшего порядка и чистых функций, реализованные на JavaScript

<!-- v -->

## Компетенции по занятию

- **Работа с современным стандартом языка программирования JavaScript**
- **Применение принципов функционального программирования в JavaScript**
- Создание чистых функций без побочных эффектов
- Использование функций высшего порядка для решения задач

<!-- s -->

# OTUS

## Функциональное программирование

<!-- v -->

**Функциональное программирование (ФП)** — предполагает обходиться вычислением результатов функций от исходных данных и результатов других функций, и не предполагает явного хранения состояния программы. Соответственно, не предполагает оно и изменяемости этого состояния.

<!-- v -->

- Есть функции и данные
- Данные иммутабельны, неизменны
- Функции возвращают новые данные на основе входящих значений

<!-- s -->

# OTUS

## Чистые функции

<!-- v -->

**Чистые функции** - выходные данные зависят только от входных. Функции "без побочных эффектов".

<!-- v -->

Является ли функция чистой?

```javascript
const set = new Set();

function hasDuplicates(arr) {
  return arr.some((val) => {
    if (set.has(val)) return true;
    else {
      set.add(val);
      return false;
    }
  });
}
```

<!-- v -->

- если результат чистой функции не используется, её вызов может быть удалён

- результат вызова чистой функции может быть мемоизирован

- если нет никакой зависимости по данным между двумя чистыми функциями, то порядок их вычисления можно поменять

<!-- v -->

## Вопросы?

<!-- s -->

# OTUS

## Immutable data

<!-- v -->

**Что же такое мутация?**

**Мутация** — это изменение существующих данных или структуры, которая их в себе хранит.

<!-- v -->

```javascript
const person = {
  name: "John",
  age: 28,
};
const newPerson = person;
newPerson.age = 30;
console.log(newPerson === person); // истина
console.log(person); // { name: 'John', age: 30 }
```

<!-- v -->

**Иммутабельность** предполагает создание копии существующих данных или структуры, когда необходимы изменения, и добавление этих изменений туда.

### 1. Object.assign():

```javascript
const person = {
  name: "John",
  age: 28,
};
const newPerson = Object.assign({}, person, {
  age: 30,
});
console.log(newPerson === person); // ложь
console.log(person); // { name: 'John', age: 28 }
console.log(newPerson); // { name: 'John', age: 30 }
```

<!-- v -->

```javascript
const person = {
  name: "John",
  age: 28,
};
const newPerson = {
  ...person,
  age: 30,
};
console.log(newPerson === person); // ложь
console.log(newPerson); // { name: 'John', age: 30 }
```

<!-- v -->

```javascript
target = JSON.parse(JSON.stringify(source));
```

ВАЖНО! JSON.stringify упадет, если будут циклические зависимости, а также не будет копировать методы.

<!-- v -->

### Удаление свойств объекта

````javascript
```javascript
const person = {
  name: "John",
  password: "123",
  age: 28,
};
const property = "password";
const newPerson = Object.keys(person).reduce((obj, key) => {
  if (key !== property) {
    return { ...obj, [key]: person[key] };
  }
  return obj;
}, {});

// Способ 2 - деструктуризация
const { redundantProperty, ...newPerson } = person;
````

<!-- v -->

### Заморозка объекта

```javascript
Object.freeze(target);
```

Заморозка объекта будет поверхностной(shallow)  
Для глубокой заморозки объекта ребята из [Mozilla](https://developer.mozilla.org/ru/docs/Web/JavaScript/Reference/Global_Objects/Object/freeze) написали готовый способ

<!-- v -->

### Плюсы и минусы иммутабельности

Плюсы:

- Блокировка для многопоточности больше не является проблемой: если данные не изменяются, нет необходимости в какой-либо блокировке, чтобы синхронизировать разные потоки
- Отслеживать изменения в данных намного проще (достаточно сравнить ссылки на объект)

Минусы:

- Использование иммутабельных структур данных по своей природе является причиной пиковых значений в использовании памяти

<!-- v -->

## Вопросы?

<!-- s -->

# OTUS

## First class functions

<!-- v -->

Функция - полноценный гражданин программы

- Можно передать в качестве аргумента другой функции
- Можно вернуть функцию из другой функции
- Можно присвоить переменной или сохранить в структуре данных

<!-- v -->

### Передача функции как аргумент:

```javascript
function callArgument(cb) {
  cb();
}

function sayHello() {
  console.log("Hello!");
}

callArgument(sayHello);
```

<!-- v -->

### Возврат функции как результат:

```javascript
function getHello() {
  return function () {
    console.log("Hello!");
  };
}

const sayHello = getHello();
sayHello();
```

<!-- v -->

### Сохранение в структурах данных

```javascript
function sayHello() {
  console.log("Hello!");
}
function sayDratuti() {
  console.log("Dratuti!");
}
function sayBonjour() {
  console.log("Bonjour!");
}

const sayArray = [];
sayArray.push(sayHello);
sayArray.push(sayDratuti);
sayArray.push(sayBonjour);
sayArray.forEach((say) => say());
```

<!-- v -->

## Вопросы?

<!-- s -->

# OTUS

## Функции высшего порядка

<!-- v -->

**Функция высшего порядка** — в программировании функция, принимающая в качестве аргументов другие функции или возвращающая другую функцию в качестве результата.

<!-- v -->

### Мемоизация

**Мемоизация** — в программировании сохранение результатов выполнения функций для предотвращения повторных вычислений.

```javascript
function memoize(fn) {
  const cache = new Map();

  return function (...args) {
    const key = JSON.stringify(args);

    if (cache.has(key)) {
      console.log("Из кэша:", key);
      return cache.get(key);
    }

    const result = fn.apply(this, args);
    cache.set(key, result);
    console.log("Вычислено:", key);
    return result;
  };
}
```

<!-- v -->

```javascript
// Дорогая функция
function fibonacci(n) {
  if (n <= 1) return n;
  return fibonacci(n - 1) + fibonacci(n - 2);
}

// Мемоизированная версия
const memoizedFib = memoize(fibonacci);

console.time("Первый вызов");
console.log(memoizedFib(40)); // Долго
console.timeEnd("Первый вызов");

console.time("Второй вызов");
console.log(memoizedFib(40)); // Мгновенно!
console.timeEnd("Второй вызов");
```

<!-- v -->

## Вопросы?

<!-- s -->

# OTUS

## Декларативный VS императивный подходы

<!-- v -->

Императивный подход отвечает на вопрос КАК?

Декларативный подход отвечает на вопрос ЧТО?

<!-- v -->

**Задача:** удвоить все элементы массива и найти сумму элементов массива

### Императивный стиль:

```javascript
function double(arr) {
  let results = [];
  for (let i = 0; i < arr.length; i++) {
    results.push(arr[i] * 2);
  }
  return results;
}

function add(arr) {
  let result = 0;
  for (let i = 0; i < arr.length; i++) {
    result += arr[i];
  }
  return result;
}
```

<!-- v -->

### Декларативный стиль:

```javascript
function double(arr) {
  return arr.map((item) => item * 2);
}

function add(arr) {
  return arr.reduce((prev, current) => prev + current, 0);
}
```

<!-- v -->

## Вопросы?

<!-- s -->

# OTUS

## Семантика методов массива

<!-- v -->

### Основные методы:

- `map()` - преобразование элементов
- `filter()` - фильтрация элементов
- `reduce()` - сведение к одному значению
- `forEach()` - перебор элементов
- `some()` / `every()` - проверка условий

<!-- v -->

## Вопросы?

<!-- s -->

# OTUS

## Композиция и каррирование

<!-- v -->

**Композиция** - объединение функций для создания новых функций

```javascript
const compose = (f, g) => (x) => f(g(x));

const addOne = (x) => x + 1;
const double = (x) => x * 2;

const addOneThenDouble = compose(double, addOne);

console.log(addOneThenDouble(3)); // (3 + 1) * 2 = 8
```

<!-- v -->

**Каррирование** - преобразование функции с несколькими аргументами в последовательность функций с одним аргументом

```javascript
function curry(fn) {
  return function curried(...args) {
    if (args.length >= fn.length) {
      return fn.apply(this, args);
    } else {
      return function (...args2) {
        return curried.apply(this, args.concat(args2));
      };
    }
  };
}

function sum(a, b, c) {
  return a + b + c;
}

const curriedSum = curry(sum);

console.log(curriedSum(1)(2)(3)); // 6
console.log(curriedSum(1, 2)(3)); // 6
console.log(curriedSum(1)(2, 3)); // 6
```

<!-- v -->

## Опрос о занятии
