---
title: "Урок 2: ООП в JavaScript"
description: "Объектно-ориентированное программирование: классы, прототипы, наследование"
---

# ООП в JavaScript

## Классы, прототипы, наследование

<!-- v -->

## Цели занятия

- Познакомиться с основами объектно-ориентированного программирования в JavaScript
- Понимать различия между классами и прототипами
- Применять принципы инкапсуляции и полиморфизма
- Создавать гибкие архитектуры с использованием ООП

<!-- v -->

## Краткое содержание

- Основы ООП и абстракция
- Классы и наследование
- Прототипы и прототипное наследование
- Инкапсуляция и полиморфизм
- Практическое применение в deepEqual

<!-- v -->

## Результат занятия

Функция deepEqual, реализованная с применением принципов ООП (с использованием классов и прототипов)

<!-- v -->

## Компетенции по занятию

- **Работа с современным стандартом языка программирования JavaScript**
- **Уметь работать с наследованием**
- **Уметь применять ООП в JavaScript** (классы, прототипы, инкапсуляция, полиморфизм)
- Создание масштабируемых архитектур

<!-- s -->

## Что такое ООП?

**Объектно-ориенти́рованное программирование (ООП)** — методология программирования, основанная на представлении программы в виде совокупности объектов

### Основная цель:

**Абстракция** - позволяет обойти ограничение Миллера (7±2), оперируя более крупными единицами информации

<!-- s -->

## Зачем нужна абстракция?

### Проблема сложности:

```javascript
// Без абстракции - много переменных
const nameA = "Bob";
const ageA = 17;
const emailA = "bob@example.com";

const nameB = "Sam";
const ageB = 28;
const emailB = "sam@example.com";

// Сложно управлять и понимать
```

### С абстракцией:

```javascript
// Группировка данных в структуры
const bob = {
  name: "Bob",
  age: 17,
  email: "bob@example.com",
};

const sam = {
  name: "Sam",
  age: 28,
  email: "sam@example.com",
};
```

<!-- s -->

## Объекты = Данные + Поведение

### Добавляем поведение к данным:

```javascript
const bob = {
  name: "Bob",
  age: 17,
  email: "bob@example.com",

  // Поведение - методы объекта
  getGreetPhrase() {
    return this.age > 17 ? "Good morning" : "Hi";
  },

  canVote() {
    return this.age >= 18;
  },

  getInfo() {
    return `${this.name} (${this.age} лет)`;
  },
};

console.log(bob.getGreetPhrase()); // "Hi"
console.log(bob.canVote()); // false
```

<!-- s -->

## ES6 Классы

### Современный синтаксис:

```javascript
class Person {
  constructor(name = "Noname", age = 0) {
    this.name = name;
    this.age = age;
  }

  getGreetPhrase() {
    return this.age > 17 ? "Good morning" : "Hi";
  }

  introduce() {
    return `Меня зовут ${this.name}, мне ${this.age} лет`;
  }

  // Статический метод
  static createAdult(name) {
    return new Person(name, 18);
  }

  // Геттер
  get isAdult() {
    return this.age >= 18;
  }

  // Сеттер с валидацией
  set age(value) {
    if (value >= 0) {
      this._age = value;
    }
  }

  get age() {
    return this._age;
  }
}

const bob = new Person("Bob", 17);
const adult = Person.createAdult("John");
console.log(bob.introduce()); // "Меня зовут Bob, мне 17 лет"
console.log(adult.isAdult); // true
```

<!-- s -->

## Наследование классов

### Расширение функциональности:

```javascript
class Person {
  constructor(name, age) {
    this.name = name;
    this.age = age;
  }

  introduce() {
    return `Меня зовут ${this.name}`;
  }
}

class Employee extends Person {
  constructor(name, age, position, salary) {
    super(name, age); // вызов конструктора родителя
    this.position = position;
    this.salary = salary;
  }

  introduce() {
    return `${super.introduce()}, я работаю ${this.position}`;
  }

  getAnnualSalary() {
    return this.salary * 12;
  }
}

class Manager extends Employee {
  constructor(name, age, salary, teamSize) {
    super(name, age, "менеджером", salary);
    this.teamSize = teamSize;
  }

  introduce() {
    return `${super.introduce()} и управляю командой из ${
      this.teamSize
    } человек`;
  }
}

const manager = new Manager("Alice", 30, 5000, 5);
console.log(manager.introduce());
```

<!-- s -->

## Инкапсуляция

### Приватные поля (ES2022):

```javascript
class BankAccount {
  // Приватные поля
  #balance = 0;
  #accountNumber;

  constructor(accountNumber, initialBalance = 0) {
    this.#accountNumber = accountNumber;
    this.#balance = initialBalance;
  }

  // Публичные методы для работы с приватными данными
  deposit(amount) {
    if (amount > 0) {
      this.#balance += amount;
      return true;
    }
    return false;
  }

  get balance() {
    return this.#balance;
  }
}
```

<!-- s -->

## Приватные методы и геттеры

```javascript
class BankAccount {
  #balance = 0;
  #accountNumber;

  constructor(accountNumber, initialBalance = 0) {
    this.#accountNumber = accountNumber;
    this.#balance = initialBalance;
  }

  withdraw(amount) {
    if (this.#validateTransaction(amount)) {
      this.#balance -= amount;
      return true;
    }
    return false;
  }

  get accountInfo() {
    return `Счет: ${this.#accountNumber}, Баланс: ${this.#balance}`;
  }

  // Приватный метод
  #validateTransaction(amount) {
    return amount > 0 && amount <= this.#balance;
  }
}

const account = new BankAccount("123456", 1000);
// console.log(account.#balance); // SyntaxError: Private field
```

<!-- s -->

## Полиморфизм

### Один интерфейс - разные реализации:

```javascript
class Shape {
  area() {
    throw new Error("Метод area() должен быть переопределен");
  }

  perimeter() {
    throw new Error("Метод perimeter() должен быть переопределен");
  }
}

class Rectangle extends Shape {
  constructor(width, height) {
    super();
    this.width = width;
    this.height = height;
  }

  area() {
    return this.width * this.height;
  }

  perimeter() {
    return 2 * (this.width + this.height);
  }
}

class Circle extends Shape {
  constructor(radius) {
    super();
    this.radius = radius;
  }

  area() {
    return Math.PI * this.radius ** 2;
  }

  perimeter() {
    return 2 * Math.PI * this.radius;
  }
}

// Полиморфное использование
function printShapeInfo(shape) {
  console.log(`Площадь: ${shape.area()}`);
  console.log(`Периметр: ${shape.perimeter()}`);
}

const shapes = [new Rectangle(5, 3), new Circle(4)];

shapes.forEach(printShapeInfo); // Работает для любой фигуры
```

<!-- s -->

## Композиция vs Наследование

### Композиция - предпочтительный подход:

```javascript
// Вместо глубокого наследования
class Flyable {
  fly() {
    return "Летаю";
  }
}

class Swimmable {
  swim() {
    return "Плаваю";
  }
}

class Walkable {
  walk() {
    return "Хожу";
  }
}

// Композиция способностей
class Duck {
  constructor() {
    this.flyable = new Flyable();
    this.swimmable = new Swimmable();
    this.walkable = new Walkable();
  }

  fly() {
    return this.flyable.fly();
  }

  swim() {
    return this.swimmable.swim();
  }

  walk() {
    return this.walkable.walk();
  }
}

class Fish {
  constructor() {
    this.swimmable = new Swimmable();
  }

  swim() {
    return this.swimmable.swim();
  }
}
```

<!-- s -->

## Миксины в JavaScript

### Добавление функциональности через миксины:

```javascript
// Миксин для логирования
const LoggerMixin = {
  log(message) {
    console.log(`[${this.constructor.name}] ${message}`);
  },
};

// Миксин для валидации
const ValidatorMixin = {
  validate(data) {
    return Object.values(data).every((value) => value != null);
  },
};

// Функция для применения миксинов
function applyMixins(targetClass, ...mixins) {
  mixins.forEach((mixin) => {
    Object.getOwnPropertyNames(mixin).forEach((name) => {
      if (name !== "constructor") {
        targetClass.prototype[name] = mixin[name];
      }
    });
  });
}

class User {
  constructor(name, email) {
    this.name = name;
    this.email = email;
  }
}

// Применяем миксины
applyMixins(User, LoggerMixin, ValidatorMixin);

const user = new User("John", "john@example.com");
user.log("Пользователь создан"); // [User] Пользователь создан
console.log(user.validate(user)); // true
```

<!-- s -->

## Практический пример: deepEqual с ООП

### Архитектура решения:

```javascript
// Абстрактный базовый класс для сравнения
class Comparator {
  compare(a, b) {
    throw new Error("Метод compare должен быть переопределен");
  }

  canHandle(value) {
    throw new Error("Метод canHandle должен быть переопределен");
  }
}

// Сравнение примитивных типов
class PrimitiveComparator extends Comparator {
  canHandle(value) {
    return value == null || typeof value !== "object";
  }

  compare(a, b) {
    return a === b;
  }
}

// Сравнение массивов
class ArrayComparator extends Comparator {
  canHandle(value) {
    return Array.isArray(value);
  }

  compare(a, b, context) {
    if (!Array.isArray(b) || a.length !== b.length) {
      return false;
    }

    return a.every((item, index) => context.deepEqual(item, b[index]));
  }
}

// Сравнение объектов
class ObjectComparator extends Comparator {
  canHandle(value) {
    return value != null && typeof value === "object" && !Array.isArray(value);
  }

  compare(a, b, context) {
    if (typeof b !== "object" || b == null || Array.isArray(b)) {
      return false;
    }

    const keysA = Object.keys(a);
    const keysB = Object.keys(b);

    if (keysA.length !== keysB.length) {
      return false;
    }

    return keysA.every(
      (key) => keysB.includes(key) && context.deepEqual(a[key], b[key])
    );
  }
}
```

<!-- s -->

## DeepEqual: главный класс

```javascript
class DeepEqualEngine {
  constructor() {
    this.comparators = [
      new PrimitiveComparator(),
      new ArrayComparator(),
      new ObjectComparator(),
    ];
    this.visited = new WeakSet();
  }

  deepEqual(a, b) {
    // Проверка на циклические ссылки
    if (typeof a === "object" && a !== null) {
      if (this.visited.has(a)) {
        return a === b;
      }
      this.visited.add(a);
    }

    // Поиск подходящего компаратора
    const comparator = this.findComparator(a);
    if (!comparator) {
      throw new Error(`Не найден компаратор для типа: ${typeof a}`);
    }

    return comparator.compare(a, b, this);
  }

  findComparator(value) {
    return this.comparators.find((comp) => comp.canHandle(value));
  }

  // Метод для добавления новых компараторов
  addComparator(comparator) {
    if (!(comparator instanceof Comparator)) {
      throw new Error("Компаратор должен наследоваться от класса Comparator");
    }
    this.comparators.unshift(comparator); // добавляем в начало для приоритета
  }
}

// Использование
const engine = new DeepEqualEngine();

const obj1 = { a: 1, b: [2, 3], c: { d: 4 } };
const obj2 = { a: 1, b: [2, 3], c: { d: 4 } };

console.log(engine.deepEqual(obj1, obj2)); // true
```

<!-- s -->

## Расширение функциональности

### Добавление нового компаратора:

```javascript
// Компаратор для дат
class DateComparator extends Comparator {
  canHandle(value) {
    return value instanceof Date;
  }

  compare(a, b) {
    return b instanceof Date && a.getTime() === b.getTime();
  }
}

// Компаратор для регулярных выражений
class RegExpComparator extends Comparator {
  canHandle(value) {
    return value instanceof RegExp;
  }

  compare(a, b) {
    return b instanceof RegExp && a.source === b.source && a.flags === b.flags;
  }
}

// Добавляем новые компараторы
const engine = new DeepEqualEngine();
engine.addComparator(new DateComparator());
engine.addComparator(new RegExpComparator());

// Теперь можем сравнивать даты и регулярные выражения
const date1 = new Date("2023-01-01");
const date2 = new Date("2023-01-01");
console.log(engine.deepEqual(date1, date2)); // true

const regex1 = /test/gi;
const regex2 = /test/gi;
console.log(engine.deepEqual(regex1, regex2)); // true
```

<!-- s -->

## Паттерн Strategy в действии

### Конфигурируемое сравнение:

```javascript
class ConfigurableDeepEqual {
  constructor(options = {}) {
    this.options = {
      ignoreArrayOrder: false,
      caseSensitive: true,
      ignoreUndefined: false,
      ...options,
    };

    this.setupComparators();
  }

  setupComparators() {
    this.comparators = [
      new PrimitiveComparator(),
      this.options.ignoreArrayOrder
        ? new UnorderedArrayComparator()
        : new ArrayComparator(),
      new ObjectComparator(),
    ];
  }

  deepEqual(a, b) {
    // Реализация с учетом опций
    return this.compareWithOptions(a, b);
  }
}

// Разные стратегии сравнения
const strictEngine = new ConfigurableDeepEqual({
  caseSensitive: true,
});

const flexibleEngine = new ConfigurableDeepEqual({
  ignoreArrayOrder: true,
  caseSensitive: false,
});
```

<!-- s -->

## Принципы хорошего ООП дизайна

### SOLID принципы:

1. **Single Responsibility** - каждый класс отвечает за одну задачу
2. **Open/Closed** - открыт для расширения, закрыт для изменения
3. **Liskov Substitution** - объекты можно заменять их наследниками
4. **Interface Segregation** - интерфейсы должны быть специфичными
5. **Dependency Inversion** - зависимость от абстракций, не от конкретики

### В нашем примере:

- ✅ Каждый компаратор отвечает за свой тип данных
- ✅ Можно добавлять новые компараторы без изменения существующих
- ✅ Все компараторы взаимозаменяемы через базовый класс
- ✅ Интерфейс компаратора минимален и специфичен
- ✅ DeepEqualEngine зависит от абстракции Comparator

<!-- s -->

## Выбор подходящих сущностей

### Процесс выделения объектов:

**Пример:** Система покупки в интернет-магазине

1. **Описываем процесс словами:**

   - Пользователь выбирает **товар** из **каталога**
   - Добавляет товар в **корзину**
   - Оформляет **заказ** с указанием **адреса доставки**
   - Производит **оплату** через **платежную систему**

2. **Выделяем сущности:**

   - `Product` (товар)
   - `Catalog` (каталог)
   - `Cart` (корзина)
   - `Order` (заказ)
   - `Address` (адрес)
   - `PaymentSystem` (платежная система)

3. **Определяем ответственности:**
   - `Product` - хранит информацию о товаре
   - `Cart` - управляет списком выбранных товаров
   - `Order` - координирует процесс заказа

<!-- s -->

## Домашнее задание

### Цель:

Сделать глубокое сравнение объектов (deepEqual) с применением ООП

### Требования:

1. **Использовать классы** для организации кода
2. **Применить наследование** для разных типов компараторов
3. **Реализовать инкапсуляцию** - скрыть внутреннюю логику
4. **Обеспечить полиморфизм** - единый интерфейс для всех компараторов
5. **Поддержать расширяемость** - возможность добавления новых типов

### Дополнительные задачи:

- Обработка циклических ссылок
- Конфигурируемые опции сравнения
- Поддержка специальных типов (Date, RegExp, Map, Set)
- Создание фабрики компараторов
- Добавление логирования и метрик

### Архитектурные требования:

- Следование SOLID принципам
- Использование паттернов Strategy и Factory
- Покрытие тестами всех компонентов

<!-- s -->

## Q&A

**Вопросы по ООП в JavaScript?**

- Классы vs прототипы - когда что использовать?
- Как правильно проектировать иерархию классов?
- Инкапсуляция и приватные поля
- Композиция vs наследование
- Применение SOLID принципов

**Переходим к практической реализации!**
