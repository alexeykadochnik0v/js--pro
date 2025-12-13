---
title: "Урок 12"
description: "TypeScript в React"
---

# TypeScript в React: типизация компонентов, пропсов и хуков

<!-- v -->

## Как меня слышно и видно?

> Напишите в чат

- **+** если все хорошо
- **–** если есть проблемы со звуком или с видео

<!-- v -->

## Цели занятия

Изучить TypeScript в React.

<!-- v -->

## Краткое содержание

- Компоненты и хуки на TS

<!-- v -->

## Результат

React-компоненты и хуки, типизированные с помощью TypeScript (включая пропсы, стейт и возвращаемые значения)

<!-- v -->

## Компетенции по занятию

- Работать с TypeScript
- Разрабатывать React-компоненты
- Владеть React Hooks и архитектурными паттернами (контекст, кастомные хуки)

<!-- s -->

## Зачем TypeScript в React?

<!-- v -->

<div style="margin: 0 0 20px 0; text-align: left; font-weight: bold; color: #4a89d2">
TypeScript это:
</div>

- Раннее обнаружение ошибок: TypeScript проверяет типы не во время выполнения программы (runtime), а во время написания (compile time).
- Самодокументируемость кода: Глядя на интерфейс пропсов компонента, вы сразу понимаете его API
- Улучшенный Developer Experience (DX)
- Повышение надежности: TypeScript не позволит вам случайно передать строку туда, где ожидается массив объектов

<!-- v -->

<div style="margin: 0 0 20px 0; text-align: left; font-weight: bold; color: #4a89d2">
Базовые требования
</div>

Для работы TS с React нужно немного больше, чем просто установить TypeScript.

- **`@types/react`, `@types/react-dom`**: пакеты с *декларациями типов*. Без них TypeScript не будет знать, что такое `useState`.

- **`tsconfig.json`**: Файл конфигурации TypeScript.

    - **`"jsx": "react-jsx"`**: Директива для компилятора, говорящая "обрабатывай JSX-синтаксис, преобразуя его в новый jsx-рантайм"

    - **`"strict": true`** -  Включает весь набор строгих проверок

<!-- v -->

<div style="margin: 0 0 20px 0; text-align: left; font-weight: bold; color: #4a89d2">
Улучшения работы IntelliSense в TypeScript
</div>

<div style="text-align: left; font-size: 30px">
     <b>Настройка Visual Studio Code для TypeScript</b>
</div>

<ol style="display: block; font-size: 24px">
    <li>Откройте VS Code</li>
    <li>Нажмите Ctrl + Shift + P (или Cmd + Shift + P на macOS), чтобы открыть командную палитру</li>
    <li>Ввкдите Preferences: Open Default Settings (JSON)</li>
</ol>

```tsx
{
  "editor.quickSuggestions": {
    "other": true,
    "comments": false,
    "strings": true
  },
  "editor.suggestOnTriggerCharacters": true,
  "typescript.suggest.autoImports": true,
  "typescript.format.enable": true
}
```

 <div style="text-align: left; font-size: 30px">
    <b>Использование Деклараций типов (Type Definitions)</b>
</div>

<div style="text-align: left; font-size: 24px">
установить нужные декларации типов для используемых библиотек
</div>

```txt
npm install --save-dev @types/react
```

<!-- v -->

<div style="margin: 0 0 20px 0; text-align: left; font-weight: bold; color: #4a89d2">
Улучшения работы IntelliSense в TypeScript
</div>

 <div style="text-align: left;">
     <b>Использование TypeScript конфигурации (tsconfig.json)</b>
</div>

```tsx
{
  "compilerOptions": {
    "target": "ES6", // Указывает стандарт JavaScript
    "module": "ESNext", // Определяет модульную систему
    "strict": true, // Включает строгую типизацию
    "esModuleInterop": true, // Для поддержки CommonJS и ES-модулей
    "resolveJsonModule": true, // Позволяет работать с .json файлами
    "baseUrl": ".", // Базовый путь для относительных импортов
    "paths": {
      "*": ["node_modules/*", "src/*"]
    },
    "allowJs": true, // Разрешает использование JavaScript файлов
    "skipLibCheck": true, // Пропуск проверки типов в библиотеках
    "noEmit": true // Отключает вывод файлов, если не нужно собирать проект
  },
  "include": ["src/**/*.ts"], // Путь к исходным файлам
  "exclude": ["node_modules", "dist", "build"] // Исключить ненужные файлы из обработки TypeScript для улучшуния производительности IntelliSense
}
```

<!-- s -->

## Типизация компонентов в React

<!-- v -->

<div style="margin: 0 0 20px 0; text-align: left; font-weight: bold; color: #4a89d2">
Типизация компонентов в React
</div>

<div style="text-align: left; margin: 50px 0 50px 0; ">
Тип компонента всегда выводится автоматически:
</div>

- **если компонент — функция**, то TS понимает, что это **`(props: Props) => JSX.Element;`**
- **если это HOC, render-prop или что-то ещё** — тип определяется через **generic-и**

<div style="text-align: left; margin-top: 50px; font-weight: bold;">
  React-компонент не имеет отдельного “своего” типа, кроме как функция с типизированными параметрами
</div>

<!-- v -->

<div style="margin: 0 0 20px 0; text-align: left; font-weight: bold; color: #4a89d2">
Type inference
</div>

<div style="text-align: left;">
<b>Ключевой принцип современного TS в React</b>
</div>

<div style="text-align: left;">
Современная экосистема React + TypeScript всё сильнее опирается на type inference, а не на ручное объявление типов
</div>

<br/>

<div style="text-align: left;">
<b>Почему inference — основа?</b>
</div>

<ul style="display: block">
    <li>React — декларативный, а TS умеет выводить типы из деклараций</li>
    <li>Современные API React используют generics, которые выводятся автоматически</li>
    <li>Современный TS делает явные типы избыточными</li>
    <li>Лучшая интеграция с серверными фреймворками (Next.js, Remix)</li>
</ul>


<!-- v -->

<div style="margin: 0 0 20px 0; text-align: left; font-weight: bold; color: #4a89d2">
Компонент как функция, возвращающая JSX
</div>

```tsx
    const Hello: () => JSX.Element = () => {
        return <div>Hello</div>;
    };
```
<div style="margin-top: 30px; text-align: left; font-weight: bold;">
Применение
</div>

<ul style="display: block">
    <li>Простые компоненты без пропсов</li>
    <li>Когда нужен строгий контракт для возвращаемого значения</li>
    <li>Обучающие или вспомогательные компоненты, где важно контролировать возвращаемое значение</li>
</ul>

<div style="margin-top: 30px; text-align: left; font-weight: bold;">
Минусы
</div>

<ul style="display: block">
    <li> Нельзя возвращать null (или условный рендер), если понадобится</li>
    <li>Часто лишняя строгая типизация — TS обычно сам выводит тип возвращаемого JSX</li>
</ul>

<!-- v -->

<div style="margin: 0 0 20px 0; text-align: left; font-weight: bold; color: #4a89d2">
React.ElementType
</div>

<div style="text-align: left; font-size: 30px;">
Это универсальный тип для любого компонента в React, который может быть передан в JSX
</div>

<div style="text-align: left; font-size: 25px;">
Позволяет работать с компонентами, не уточняя их точный тип, что удобно при создании более абстрактных компонентов или при работе с типами в библиотеках, например, при написании HOC (Higher Order Components).
</div>

```tsx
type CustomButtonProps = {
  component: React.ElementType;
};

const CustomButton: React.FC<CustomButtonProps> = ({ component: Component }) => {
  return <Component>Click me</Component>;
};

const App = () => {
  return (
    <div>
      {/* Используем CustomButton с обычной кнопкой */}
      <CustomButton component="button" />

      {/* Используем CustomButton с кастомным компонентом */}
      <CustomButton component="a" />
    </div>
  );
};
```

<!-- v -->

<div style="margin: 0 0 20px 0; text-align: left; font-weight: bold; color: #4a89d2">
Компонент с типизацией пропсов и сигнатуры
</div>

```tsx
    type Props = { name: string };

    const User: (props: Props) => JSX.Element = (props) => {
        return <div>{props.name}</div>;
    };
```

<div style="margin-top: 30px; text-align: left; font-weight: bold;">
Применение
</div>

<ul style="display: block">
    <li>типизация (props: Props) => JSX.Element задаёт сигнатуру всей функции, а не только пропсов</li>
    <li>TS строго проверяет, что пропсы соответствуют Props и что возвращается JSX</li>
    <li>Это даёт полное понимание контракта функции: что она принимает и что возвращает</li>
</ul>

<div style="margin-top: 30px; text-align: left; font-weight: bold;">
Минусы
</div>

<ul style="display: block">
    <li>Иногда избыточно: TS сам может вывести тип функции по пропсам</li>
    <li>Не всегда нужно указывать явно, если компонент простой</li>
</ul>

<!-- v -->

<div style="margin: 0 0 20px 0; text-align: left; font-weight: bold; color: #4a89d2">
Компонент с типом React.ComponentType
</div>

```tsx
    type Props = { age: number };

    const Profile: React.ComponentType<Props> = ({ age }) => {
        return <p>Age: {age}</p>;
    };
```

<div style="margin-top: 30px; text-align: left; font-weight: bold;">
Применение
</div>

<ul style="display: block">
    <li>HOC, где компонент может быть любым типом</li>
    <li>DI (dependency injection) — передача компонентов как пропсов</li>
    <li>Универсальные UI-библиотеки</li>
</ul>

<div style="margin-top: 30px; text-align: left; font-weight: bold;">
Минусы
</div>

<ul style="display: block">
    <li>Неявно добавляет children, даже если компонент их не принимает</li>
    <li>Менее строгий, чем конкретная типизация пропсов и функции</li>
</ul>

<!-- v -->

<div style="margin: 0 0 20px 0; text-align: left; font-weight: bold; color: #4a89d2">
Generic-компонент
</div>

```tsx
    interface ItemProps<T> {
        item: T;
    }

    const Item = <T,>(props: ItemProps<T>): JSX.Element => {
        return <pre>{JSON.stringify(props.item)}</pre>;
    };
```

<div style="margin-top: 30px; text-align: left; font-weight: bold;">
Применение
</div>

<ul style="display: block">
    <li>Списки, таблицы, универсальные UI-компоненты</li>
    <li>Контейнеры для данных с разными типами</li>
    <li>Типизация динамических данных в формах и API</li>
</ul>

<div style="margin-top: 30px; text-align: left; font-weight: bold;">
Минусы
</div>

<ul style="display: block">
    <li>Требует понимания generics</li>
    <li>Без &lt;T,&gt; TS может ошибочно интерпретировать JSX как синтаксис generic</li>
</ul>

<!-- v -->

<div style="margin: 0 0 20px 0; text-align: left; font-weight: bold; color: #4a89d2">
memo-компонент
</div>

```tsx
    type Props = { title: string };

    const Title: React.MemoExoticComponent<(props: Props) => JSX.Element> = React.memo(function Title({ title }) {
        return <h1>{title}</h1>;
    });
```

<div style="margin-top: 30px; text-align: left; font-weight: bold;">
Применение
</div>

<ul style="display: block">
    <li>Компоненты, которые часто перерисовываются и могут быть мемоизированы</li>
    <li>HOC или сложные композиции</li>
    <li>Контроль типов при передаче memo-компонента как пропса</li>
</ul>

<div style="margin-top: 30px; text-align: left; font-weight: bold;">
Минусы
</div>

<ul style="display: block">
    <li>Синтаксис громоздкий</li>
    <li>Часто можно обойтись без явного указания типа</li>
</ul>

<!-- v -->

<div style="margin: 0 0 20px 0; text-align: left; font-weight: bold; color: #4a89d2">
forwardRef-компонент
</div>

```tsx
    type Props = { label: string };

    const Input = React.forwardRef<HTMLInputElement, Props>((props, ref): JSX.Element => {
            return <input ref={ref} placeholder={props.label} />;
        }
    );
```

<div style="margin-top: 30px; text-align: left; font-weight: bold;">
Применение
</div>

<ul style="display: block">
    <li>Кастомные input, textarea, кнопки</li>
    <li>Интеграция с формами, focus management</li>
    <li>UI-киты, где родитель должен управлять DOM</li>
</ul>

<div style="margin-top: 30px; text-align: left; font-weight: bold;">
Минусы
</div>

<ul style="display: block">
    <li>Синтаксис сложнее стрелочной функции без forwardRef</li>
    <li>Часто громоздко для простых компонентов</li>
</ul>

<!-- v -->

<div style="margin: 0 0 20px 0; text-align: left; font-weight: bold; color: #4a89d2">
Компонент, принимающий другой компонент
</div>

```tsx
    type WrapperProps = {
        Component: (props: { message: string }) => JSX.Element;
    };

    const Wrapper = ({ Component }: WrapperProps): JSX.Element => {
        return <Component message="Hello from wrapper!" />;
    };
```

<div style="margin-top: 30px; text-align: left; font-weight: bold;">
Применение
</div>

<ul style="display: block">
    <li>Абстрагировать логику от конкретной реализации UI `&lt;Dialog as={MyStyledComponent}&#47;&gt;`</li>
    <li>Композиционные UI-компоненты `&lt;Card Header={CardHeader} Body={CardBody} &#47;&gt;`</li>
    <li>Использование DI - компонент сам решает, что рендерить, но реализация передаётся снаружи</li>
</ul>

<div style="margin-top: 30px; text-align: left; font-weight: bold;">
Минусы
</div>

<ul style="display: block">
    <li>Труднее понять цепочку пропсов, особенно уровнями глубже</li>
    <li>Иногда сложно типизировать дополнительные generic-ограничения</li>
</ul>

<!-- v -->

<div style="margin: 0 0 20px 0; text-align: left; font-weight: bold; color: #4a89d2">
React.ElementRef&lt;typeof Component&gt;
</div>

<div style="text-align: left; font-size: 30px">
Этот тип используется, чтобы лучить тип DOM-элемента или компонента, к которому можно прикрепить реф, если компонент является обернутым в forwardRef
</div>

```tsx
import React, { forwardRef, useRef } from 'react';

const Button = forwardRef<HTMLButtonElement, React.ButtonHTMLAttributes<HTMLButtonElement>>(
    (props, ref) => {
        return <button ref={ref} {...props} />;
    }
);

const App = () => {
  // Используем React.ElementRef для получения типа рефа для компонента Button
  const buttonRef = useRef<React.ElementRef<typeof Button>>(null);

  const handleClick = () => {
    if (buttonRef.current) {
      // Теперь можно работать с рефом как с HTMLButtonElement
      buttonRef.current.click();
    }
  };

  return (
    <div>
      <Button ref={buttonRef}>Click me</Button>
      <button onClick={handleClick}>Programmatically click the above button</button>
    </div>
  );
};

export default App;
```

<!-- s -->

## Типизация пропсов в React-компонентах

<!-- v -->

<div style="margin: 0 0 20px 0; text-align: left; font-weight: bold; color: #4a89d2">
Способы типизации пропсов
</div>

<div style="margin: 0 0 20px 0; text-align: left; font-weight: bold; color: #4a89d2">

</div>

```tsx
// Инлайновая типизация через деструктуризацию параметра функции
    const Button = ({ label, onClick }: { label: string; onClick: () => void }) => {
        return <button onClick={onClick}>{label}</button>;
    };

    // Использование
    <Button label="Нажми меня" onClick={() => alert('Клик!')} />

    // Тип пропсов задаётся на месте, прямо в аргументе функции
    // Не нужен отдельный type или interface

// Типизация через параметр функции (явная типизация пропсов)
    function MyComponent(props: MyProps) { return <div>{props.title}</div>; }

    // Тип пропсов задаётся для всего объекта аргумента функции (props)
    // Можно использовать заранее объявленный type или interface
    // Доступ к пропсам через props.propName

// Типизация через деструктуризацию параметра функции с заранее объявленным типом
    function MyComponent({ title, count }: MyProps) { ... }

    // Деструктурируем пропсы и одновременно указываем их тип
    // Используется заранее объявленный type или interface
    // Удобно, когда нужно сразу работать с отдельными переменными пропсов
```

<!-- v -->

### Создание типа для пропсов

<div style="margin: 0 0 20px 0; text-align: left; font-weight: bold; color: #4a89d2">
interface vs type:
</div>

<div style="text-align: left; font-size: 27px;">
<b>interface</b> —  <b>"контракт" или "описание формы объекта"</b>. Его ключевая особенность — <b>декларативное слияние</b> и <b>расширяемость</b> (`extends`). Идеально <b>подходит для описания пропсов, state, API-ответов — сущностей, которые могут развиваться</b>
<div>

```tsx
    interface BaseProps { id: string; }
    interface ButtonProps extends BaseProps {
        title: string;
        onClick: () => void;
    }
```
<div style="text-align: left; font-size: 27px;">
<b>type (Type Alias)</b>: Псевдоним для любого типа. Может описывать не только объект, но и примитив, объединение, кортеж. <b>Не может быть расширен через `extends`</b>, но может быть создан через пересечение (<b>&</b>)
<div>

```tsx
    type Status = 'idle' | 'loading' | 'error'; // Объединение (union)
    type ClickHandler = (event: React.MouseEvent) => void; // Функциональный тип
    type Person = [string, number, boolean]; // Кортеж (tuple)
    type ButtonProps = BaseProps & { // Пересечение (intersection)
        variant: 'primary' | 'secondary';
    };
```

<!-- v -->

### Создание типа для пропсов

<div style="margin: 0 0 20px 0; text-align: left; font-weight: bold; color: #4a89d2">
interface vs type:
</div>

<div style="text-align: left;">
<b>Рекомендация:</b> 
</div>

<br/>
<ul style="display: block">
    <li><b>interface</b> используйте <b>для пропсов, контекстов и классов</b> — расширяемость и читаемость ошибок</li>
    <br/>
    <li><b>type</b> используйте <b>для всего остального (unions, tuples, utility types)</b></li>
</ul>

<!-- v -->

### Продвинутые паттерны для типизации пропсов

<div style="margin: 0 0 20px 0; text-align: left; font-weight: bold; color: #4a89d2">
Типизация children:
</div>

- **React.ReactNode** — это **"всё, что может быть отрендерено в React"**. Самый широкий и правильный тип для children. Включает: **string**, **number**, **boolean**, **null**, **undefined**, **JSX.Element**, **React.Fragment**, массив из всего перечисленного, **React.Portal**. **Используйте по умолчанию.** 

```tsx 
    type ChildrenProp = {
        children: React.ReactNode;
    };
```

- Более узкие типы: **string** (только текст), **JSX.Element** (только один React-элемент, не массив)

<!-- v -->

<div style="margin: 0 0 20px 0; text-align: left; font-weight: bold; color: #4a89d2">
Обычный объект с простыми типами
</div>

```tsx
    type Props = {
        name: string;
        age: number;
    };

    const User = ({ name, age }: Props) => {
        return <div>{name} — {age}</div>;
    };
```

<div style="margin-top: 30px; text-align: left; font-size: 32px; font-weight: bold;">
Применение
</div>

<ul style="display: block; font-size: 27px">
    <li>Большинство компонентов UI</li>
    <li>Простые компоненты-представления</li>
    <li>Формы, карточки, списки</li>
</ul>

<div style="margin-top: 30px; text-align: left; font-size: 32px; font-weight: bold;">
Минусы
</div>

<ul style="display: block; font-size: 27px">
    <li>Пропсы могут становиться слишком большими при росте компонента</li>
    <li>Нет поддержки опциональности, если не добавить "?"</li>
</ul>

<!-- v -->

<div style="margin: 0 0 20px 0; text-align: left; font-weight: bold; color: #4a89d2">
Опциональные пропсы
</div>

```tsx
    type Props = {
        title?: string;
    };

    const Header = ({ title = "Default" }: Props) => {
        return <h1>{title}</h1>;
    };
```

<div style="margin-top: 30px; text-align: left; font-weight: bold;">
Применение
</div>

<ul style="display: block;">
    <li>Компоненты, где пропсы не обязательны</li>
    <li>Интерфейсы, в которых предусмотрены значения по умолчанию</li>
</ul>

<div style="margin-top: 30px; text-align: left; font-weight: bold;">
Минусы
</div>

<ul style="display: block;">
    <li>Если не задать default, нужно обрабатывать undefined вручную</li>
</ul>

<!-- v -->

<div style="margin: 0 0 20px 0; text-align: left; font-weight: bold; color: #4a89d2">
Пропсы с массивами и объектами
</div>

```tsx
    type Props = {
        items: string[];
        user: { id: number; name: string };
    };

    const List = ({ items, user }: Props) => {
        return (
            <>
            <div>User: {user.name}</div>
            <ul>{items.map((i) => <li key={i}>{i}</li>)}</ul>
            </>
        );
    };
```

<div style="margin-top: 30px; text-align: left; font-weight: bold;">
Применение
</div>

<ul style="display: block;">
    <li>Списки, таблицы, сложный UI</li>
</ul>


<div style="margin-top: 30px; text-align: left; font-weight: bold;">
Минусы
</div>

<ul style="display: block;">
    <li>Может быстро стать слишком громоздким → нужно выносить типы в отдельные интерфейсы</li>
</ul>



<!-- v -->

<div style="margin: 0 0 20px 0; text-align: left; font-weight: bold; color: #4a89d2">
Union пропсы
</div>

```tsx
    type Square = { type: "square"; size: number };
    type Circle = { type: "circle"; radius: number };

    type ShapeProps = Square | Circle;

    const Shape = (props: ShapeProps) => {
        if (props.type === "square") {
            return <div>Square {props.size}</div>;
        }
        return <div>Circle {props.radius}</div>;
    };
```

<div style="margin-top: 30px; text-align: left; font-weight: bold;">
Применение
</div>

<ul style="display: block;">
    <li>Компоненты, поведение которых зависит от режима</li>
    <li>Формы, где поля отличаются по типу</li>
</ul>

<div style="margin-top: 30px; text-align: left; font-weight: bold;">
Минусы
</div>

<ul style="display: block;">
    <li>При большом количестве вариантов код становится тяжёлым.</li>
</ul>

<!-- v -->

<div style="margin: 0 0 20px 0; text-align: left; font-weight: bold; color: #4a89d2">
Пропсы-функции
</div>

```tsx
    type Props = {
        onSelect: (id: number) => void;
    };

    const Item = ({ onSelect }: Props) => {
        return <button onClick={() => onSelect(5)}>Select</button>;
    };
```

<div style="margin-top: 30px; text-align: left; font-weight: bold;">
Применение
</div>

<ul style="display: block;">
    <li>Обработчики событий</li>
    <li>Render callbacks</li>
</ul>

<div style="margin-top: 30px; text-align: left; font-weight: bold;">
Минусы
</div>

<ul style="display: block;">
    <li>Иногда приходится указывать типы явно, если не получается inference</li>
</ul>

<!-- v -->

<div style="margin: 0 0 20px 0; text-align: left; font-weight: bold; color: #4a89d2">
Пропсы как generic (универсальные пропсы)
</div>

```tsx
    type Props<T> = {
        value: T;
        onChange: (v: T) => void;
    };

    const Field = <T,>({ value, onChange }: Props<T>) => {
        return (
            <input
            value={String(value)}
            onChange={(e) => onChange(e.target.value as T)}
            />
        );
    };
```

<div style="margin-top: 30px; text-align: left; font-size: 32px; font-weight: bold;">
Применение
</div>

<ul style="display: block; font-size: 27px;">
    <li>Формы, списки, универсальные элементы UI</li>
    <li>Контролируемые компоненты</li>
</ul>

<div style="margin-top: 30px; text-align: left; font-size: 32px; font-weight: bold;">
Минусы
</div>

<ul style="display: block; font-size: 27px;">
    <li>Код становится сложнее</li>
    <li>Не всегда очевидно, какой тип использовать в JSX</li>
</ul>

<!-- v -->

<div style="margin: 0 0 20px 0; text-align: left; font-weight: bold; color: #4a89d2">
Полиморфный компонент (as проп)
</div>

```tsx
    type AsProp<C extends React.ElementType> = {
        as?: C;
    } & React.ComponentPropsWithoutRef<C>;

    const Text = <C extends React.ElementType = "span">(props: AsProp<C>) => {
        const { as: Component = "span", ...rest } = props;
        return <Component {...rest} />;
    };
```

<div style="margin-top: 30px; text-align: left; font-size: 32px; font-weight: bold;">
Применение
</div>

<ul style="display: block; font-size: 27px;">
    <li>Создание универсальных компонентов, которые могут быть чем угодно (блок, ссылка, кнопка)</li>
    <li>Дизайн-системы, UI фреймворки</li>
</ul>

<div style="margin-top: 30px; text-align: left; font-size: 32px; font-weight: bold;">
Минусы
</div>

<ul style="display: block; font-size: 27px;">
    <li>Сложная типизация, которую новичкам понять сложно</li>
    <li>Высокая вероятность ошибиться</li>
    <li>Усложняет структуру пропсов и IDE-подсказки</li>
</ul>

<!-- v -->

<div style="margin: 0 0 20px 0; text-align: left; font-weight: bold; color: #4a89d2">
HTML-атрибуты + кастомные пропсы
</div>

```tsx
    type Props = React.ButtonHTMLAttributes<HTMLButtonElement> & {
        variant?: "primary" | "outline";
    };
```

<div style="margin-top: 30px; text-align: left; font-weight: bold;">
Применение
</div>

<ul style="display: block;">
    <li>UI-компоненты: Inputs, Buttons, Cards</li>
    <li>Дизайн-системы</li>
    <li>Повторное использование DOM-атрибутов</li>
</ul>

<div style="margin-top: 30px; text-align: left; font-weight: bold;">
Минусы
</div>

<ul style="display: block;">
    <li>Можно случайно перекрыть важные HTML пропсы</li>
    <li>Типы HTML-атрибутов довольно тяжёлые (влияют на скорость анализа TS)</li>
</ul>

<!-- v -->

<div style="margin: 0 0 20px 0; text-align: left; font-weight: bold; color: #4a89d2">
React.ComponentProps<'button'>
</div>

<div style="text-align: left; font-size: 30px">
Это утилита типа, которая извлекает пропсы для элемента &lt;button&gt;, как они используются в компоненте React
</div>

<br/>
<div style="text-align: left; font-size: 24px">
Используя <b>React.ComponentProps<'button'></b>, получаем все стандартные свойства и обработчики событий для HTML-элемента кнопки, такие как: <b>onClick, disabled, type, атрибуты aria-* (например, aria-label), className, style, children (содержимое кнопки)</b>
</div>

```tsx
// `ButtonProps` будет содержать все пропсы для стандартной кнопки <button>
type ButtonProps = React.ComponentProps<'button'>;

const MyButton: React.FC<ButtonProps> = (props) => {
  return <button {...props} />;
};

// Теперь вы можете использовать MyButton с теми же пропсами, что и у обычной кнопки <button>
const App = () => (
  <div>
    <MyButton onClick={() => alert('Нажата кнопка!')} disabled={false}>
      Нажми меня
    </MyButton>
  </div>
);
export default App;
```

<!-- v -->

<div style="margin: 0 0 20px 0; text-align: left; font-weight: bold; color: #4a89d2">
React.ComponentPropsWithoutRef<'input'>
</div>

<div style="text-align: left; font-size: 30px">
Это утилита типа, которая извлекает пропсы для элемента &lt;input&gt; (как в стандартном HTML), за исключением пропса ref
</div>

<br/>
<div style="text-align: left; font-size: 24px">
Это полезно, когда вы создаете компонент, который оборачивает стандартный элемент, например, &lt;input&gt;, и хотите контролировать поведение ref отдельно, например, используя forwardRef.
</div>

```tsx
import React, { forwardRef } from 'react';

// Тип пропсов для <input> без учета ref
type InputProps = React.ComponentPropsWithoutRef<'input'>;

const MyInput = forwardRef<HTMLInputElement, InputProps>((props, ref) => {
  return <input {...props} ref={ref} />;
});

const App = () => (
  <div>
    <MyInput type="text" placeholder="Введите что-то" />
  </div>
);

export default App;
```

<!-- v -->

<div style="margin: 0 0 20px 0; text-align: left; font-weight: bold; color: #4a89d2">
as const
</div>

<div style="text-align: left; font-size: 32px">
В TypeScript конструкция as const делает литералы максимально “узкими” и неизменяемыми, превращая выражение в read-only литеральный тип, а не расширяет его до более общего типа.
</div>

<br/>

<div style="text-align: left; font-size: 32px">
<b>Что делает as const?</b>
</div>

<div style="text-align: left; font-size: 27px">
1. Фиксирует конкретные литеральные значения 
</div>

```tsx
let a = "hello" as const;
// Тип: "hello"
```
<div style="text-align: left; font-size: 27px">
2. Делает объект или массив неизменяемым (readonly)
</div> 

```tsx
const obj = { x: 10, y: 20 } as const;
// Тип: { readonly x: 10; readonly y: 20 }
```

<div style="text-align: left; font-size: 27px">
3.Особенно полезно для константных данных
</div> 

```tsx
const COLORS = ["red", "green", "blue"] as const;
// Тип: readonly ["red", "green", "blue"]
```

<!-- v -->

<div style="margin: 0 0 20px 0; text-align: left; font-weight: bold; color: #4a89d2">
Контроль union-типов в TypeScript
</div>

<div style=" text-align: left;">
<b>Основные способы контроля (type narrowing)</b>
</div>

<div style=" text-align: left;">
<b>a) typeof для примитивов</b>
</div>

```tsx
    function process(val: string | number) {
        if (typeof val === "string") {
            console.log(val.toUpperCase()); // string
        } else {
            console.log(val.toFixed(2));    // number
        }
    }
```

<div style=" text-align: left;">
Примечание: typeof работает только для примитивов: string, number, boolean, symbol, bigint, undefined.
</div>

<!-- v -->

<div style=" text-align: left;">
<b>b) instanceof для объектов</b>
</div>

```tsx
    interface Cat {type: 'cat'; meow: () => void;}

    interface Dog { type: 'dog'; bark: () => void;}
       
    type Animal = Cat | Dog;

    function interactWithAnimal(animal: Animal) {
        if (animal.type === 'cat') {
            animal.meow();
        } else if (animal.type === 'dog') {
            animal.bark();
        } else {
            console.log('Unknown animal!');
        }
    }

    const cat: Cat = { type: 'cat', meow: () => console.log('Meow!') };
    const dog: Dog = { type: 'dog', bark: () => console.log('Woof!') };

    interactWithAnimal(cat); // Meow!
    interactWithAnimal(dog); // Woof!
```

<div style=" text-align: left;">
instanceof проверяет конструктор объекта.
</div>

<!-- v -->

<div style=" text-align: left;">
<b>c) Пользовательские type guards (функции-проверки)</b>
</div>

```tsx
   interface Square { kind: "square"; size: number }
    interface Circle { kind: "circle"; radius: number }

    type Shape = Square | Circle;

    function area(shape: Shape) {
        if (shape.kind === "square") {
            return shape.size ** 2;
        } else {
            return Math.PI * shape.radius ** 2;
        }
    }
```

<div style=" text-align: left;">
Этот способ очень мощный и чаще всего используется в TypeScript
</div>

<!-- v -->

<div style=" text-align: left;">
<b>d) Проверка по ключам (discriminated unions)</b>
</div>

```tsx
    interface Square { kind: "square"; size: number }
    interface Circle { kind: "circle"; radius: number }

    type Shape = Square | Circle;

    function area(shape: Shape) {
        if (shape.kind === "square") {
            return shape.size ** 2;
        } else {
            return Math.PI * shape.radius ** 2;
        }
    }
```

<div style=" text-align: left;">
Этот способ очень мощный и чаще всего используется в TypeScript
</div>

<!-- s -->

## Типизация конфигов и deps-массивов

<!-- v -->

<div style="margin: 0 0 20px 0; text-align: left; font-weight: bold; color: #4a89d2">
satisfies
</div>

<div style="margin-top: 30px; text-align: left; font-weight: bold;">
<b>satisfies</b> — идеальный способ типизировать конфиги и deps-массивы
</div>

<div style="margin-top: 30px; text-align: left; font-weight: bold;">
Оператор <b>satisfies</b> позволяет:
</div>

<ul style="display: block;">
    <li>проверять объект на соответствие типу</li>
    <li>не обрезать выводимый тип (в отличие от as)</li>
    <li>сохранять узкие литеральные типы</li>
</ul>

<div style="margin-top: 30px; text-align: left; font-weight: bold;">
Используется чаще всего в конфигурациях, где важно соответствие типу, но при этом хочется иметь точные литеральные значения
</div>

<!-- v -->

<div style="margin: 0 0 20px 0; text-align: left; font-weight: bold; color: #4a89d2">
Типизация deps-массивов
</div>

<div style=" text-align: left;">
Допустим, у нас есть массив зависимостей:
</div>

```tsx
   const deps = ['auth', 'db', 'logger'] satisfies string[];
```

<div style=" text-align: left;">
TypeScript проверит, что элементы — строки, но сам массив сохранит литеральные типы:
</div>

```tsx
   // deps: readonly ["auth", "db", "logger"]
```

<div style=" text-align: left;">
Типизация с конкретным набором допустимых значений
</div>

```tsx
    type DepName = 'auth' | 'db' | 'logger';

    const deps = ['auth', 'db'] satisfies DepName[];

    // Если написать неверное значение — будет ошибка:

    const deps = ['auth', 'wrong'] satisfies DepName[];// ❌ Type '"wrong"' is not assignable to type 'DepName'
```
<!-- v -->

<div style="margin: 0 0 20px 0; text-align: left; font-weight: bold; color: #4a89d2">
конфигурация с satisfies
</div>

```tsx
    interface Config {
        port: number;
        mode: 'dev' | 'prod';
        deps: string[];
    }

    const config = {
        port: 3000,
        mode: 'dev',
        deps: ['db', 'cache']
    } satisfies Config;
```

<div style=" text-align: left;">
<b>Преимущество:</b>
получаем автокомплит, проверку соответствия, но без кастинга.
</div>

<!-- v -->

<div style="margin: 0 0 20px 0; text-align: left; font-weight: bold; color: #4a89d2">
Проверка соответствия набора handlers объекту
</div>

```tsx
    type Handlers = {
        start: () => void;
        stop: () => void;
    };

    const handlers = {
        start: () => console.log('start'),
        stop: () => console.log('stop'),
    } satisfies Handlers;
```

<div style=" text-align: left;">
Если забыть ключ:
</div>

```tsx
    const handlers = {
        start: () => {}
    } satisfies Handlers;
    // ❌ Property 'stop' is missing
```
<!-- s -->

## Типизация хуков

<!-- v -->

<div style="margin: 0 0 20px 0; text-align: left; font-weight: bold; color: #4a89d2">
useState
</div>

<div style="text-align: left; font-size: 32px">
Базовая типизация
</div>


```tsx
    const [count, setCount] = React.useState<number>(0);
```

<div style="text-align: left; font-size: 32px">
Частая ошибка
</div>


```tsx
    const [state, setState] = useState(null);
```

<div style="text-align: left; font-size: 32px">
TS выводит тип null, и позже нельзя изменить тип.
</div>

<div style="text-align: left; font-size: 32px">
Исправление
</div>

```tsx
    const [state, setState] = useState<string | null>(null);
```

<div style="text-align: left; font-size: 32px">
Типизация сложного объекта
</div>


```tsx
    type User = { id: number; name: string };
    const [user, setUser] = useState<User | null>(null);
```

<!-- v -->

<div style="margin: 0 0 20px 0; text-align: left; font-weight: bold; color: #4a89d2">
useReducer
</div>

<div style="text-align: left; font-size: 32px">
<b>useReducer</b> требует полной типизации state machine (конечного автомата)

<b>Discriminated Union для `Action`</b>: Это паттерн, когда каждое действие (action) имеет поле `type` с литеральным типом (например, `'increment'`). TypeScript может затем сузить тип действия в редюсере, основываясь на этом поле, и обеспечить безопасный доступ к специфичным полям `payload`.
</div>


```tsx
    type State = { count: number; user?: string };                  //! ограниченный набор состояний

    // Определяем действия как объединение (union) разных объектов
    type Action =                                                                   //! входные события (actions/events)
    | { type: 'increment' } // Действие без доп. данных
    | { type: 'decrement' }
    | { type: 'set'; payload: number } // Действие с payload типа number
    | { type: 'login'; payload: { user: string } }; // Действие с payload-объектом
                                                   
    function reducer(state: State, action: Action): State {      //! правила переходов
        switch (action.type) {
            case 'increment':
                return { ...state, count: state.count + 1 };
            case 'decrement':
                return { ...state, count: state.count - 1 };
            case 'set':
                // TypeScript ЗНАЕТ, что здесь action имеет тип { type: 'set'; payload: number }
                return { ...state, count: action.payload };
            case 'login':
                // Здесь action имеет тип { type: 'login'; payload: { user: string } }
                return { ...state, user: action.payload.user };
            default:
                // Если мы добавим новое действие в union, но забудем case,
                // TypeScript укажет, что action имеет тип never, что сигнализирует об ошибке.
                const exhaustiveCheck: never = action;
                return state;
        }
    }
```

<!-- v -->

<div style="margin: 0 0 20px 0; text-align: left; font-weight: bold; color: #4a89d2">
useEffect / useLayoutEffect
</div>

<div style="text-align: left;">
В React типизация уже встроена, и полноценная сигнатура выглядит так:
</div>

```tsx
    function useEffect(
        effect: () => (void | (() => void)),
        deps?: readonly unknown[]
    ): void;
```

<div style="text-align: left;">
Разберём:
</div>

<ul style="display: block;">
    <li><b>effect</b> — функция, которая либо ничего не возвращает, либо возвращает cleanup функцию</li>
    <li><b>deps</b> — массив зависимостей, только для чтения (readonly), элементы — unknown</li>
</ul>

<!-- v -->

<div style="margin: 0 0 20px 0; text-align: left; font-weight: bold; color: #4a89d2">
useEffect / useLayoutEffect
</div>

<div style="text-align: left; font-size: 27px">
Типизация здесь минимальна, но важна для чистоты кода
</div>


```tsx
    useEffect(() => {
        const timer = setTimeout(() => {}, 1000);
        // Возвращаемая функция ДОЛЖНА быть без возвращаемого значения
        return () => clearTimeout(timer); // OK
        // return 5; // Ошибка
    }, []);
```

<div style="text-align: left; font-size: 27px">
Если необходимо ограничить зависимости, можно сделать так:
</div>


```tsx
    function useMyHook(value: string) {
        useEffect(() => {
            console.log(value);
        }, [value] satisfies readonly [string]);
    }
```

<div style="text-align: left; font-size: 27px">
Нельзя возвращать async-функцию
</div>

```tsx
    useEffect(async () => { ... }, []); // ошибка
      useEffect(() => {(async () => {})();}, []); // а так можно:
```

<!-- v -->

<div style="margin: 0 0 20px 0; text-align: left; font-weight: bold; color: #4a89d2">
useRef
</div>

<div style="text-align: left; font-size: 32px">
<b>useRef</b> - <b>может хранить мутируемое значение</b>, доступное на протяжении всего жизненного цикла компонента, но <b>также может хранить ссылку на DOM-элемент</b>. Типизация отличается принципиально
</div>

<br/>

<div style="text-align: left; font-size: 32px">
<b>useRef c DOM-элементом </b>
</div>

<ul style="display: block; font-size: 27px">
    <li>Создаем реф: `const inputRef = useRef<HTMLInputElement>(null)`. Обязательно `null`! Это требование React для инициализации</li>
    <li>Вешаем на элемент: &lt;input ref={inputRef} /&gt;</li>
    <li>Используем: inputRef.current имеет тип HTMLInputElement | null. <b>ПРОВЕРКА НА NULL ОБЯЗАТЕЛЬНА!</b> Потому что на момент первого рендера (при вызове useRef) элемент еще не создан, и свойство current будет null</li>
</ul>

```tsx
    const handleClick = () => {
        if (inputRef.current) { // TypeScript знает, что здесь current - HTMLInputElement
            inputRef.current.focus(); // Без проверки будет ошибка TS
        }
    };
```
<!-- v -->

<div style="margin: 0 0 20px 0; text-align: left; font-weight: bold; color: #4a89d2">
useRef
</div>

<div style="text-align: left; font-size: 32px">
<b>Мутируемое значение(instance variable)</b>
</div>

```tsx
    const intervalId = useRef<number | undefined>(undefined); // Для setInterval
    const previousValue = useRef<string>(''); // Для хранения предыдущего значения пропса
    // При инициализации можно задать любое значение нужного типа
    // Особенность: Меняем .current напрямую, это не вызовет ререндер
    useEffect(() => {
        intervalId.current = window.setInterval(() => {});
        return () => clearInterval(intervalId.current);
    }, []);
```

<div style="text-align: left; font-size: 32px">
Здесь .current можно менять без проверок. Важно: тип не включает null (если вы сами его не добавили)
</div>

<!-- v -->

<div style="margin: 0 0 20px 0; text-align: left; font-weight: bold; color: #4a89d2">
useMemo / useCallback
</div>

<div style="text-align: left;">
<b>useMemo</b>
</div>

```tsx
    const sum = useMemo<number>(() => a + b, [a, b]);
```

<br/>

<div style="text-align: left;">
<b>useCallback</b>
</div> 

<div style="text-align: left; font-size: 27px">
Важно явно аннотировать параметры функции, так как они не могут быть выведены из пустой зависимости
</div> 

```tsx
    // Без аннотации event будет тип `any`
    const badHandler = useCallback((event) => { console.log(event.clientX); }, []);

    // С аннотацией - тип безопасен
    const goodHandler = useCallback((event: React.MouseEvent<HTMLButtonElement>) => {
        console.log(event.clientX);
    }, []);
```

<div style="text-align: left; font-size: 27px">
Указываем generic, если TS не может вывести тип сам
</div> 

```tsx
    const handleClick = useCallback<(id: number) => void>(
        (id) => console.log(id),
        [],
    );
```

<!-- v -->

<div style="margin: 0 0 20px 0; text-align: left; font-weight: bold; color: #4a89d2">
useContext
</div>

<div style="text-align: left; font-size: 27px">
<b>Проблема</b>: Без TypeScript контекст может вернуть undefined по умолчанию, и вы об этом узнаете в рантайме
</div> 

<div style="text-align: left; font-size: 27px">
<b>Решение</b>: Создать строго типизированный контекст и кастомный хук-обертку
</div>

```tsx
    // 1. Определяем тип значения контекста
    interface ThemeContextType {
        mode: 'light' | 'dark';
        toggleMode: () => void;
    }

    // 2. Создаем контекст. Важно: передаем ЗНАЧЕНИЕ ПО УМОЛЧАНИЮ
    // Здесь мы НЕ МОЖЕМ создать адекватное значение, т.к. нет провайдера
    // Поэтому ставим `undefined` и явно указываем это в типе
    const ThemeContext = React.createContext<ThemeContextType | undefined>(undefined);
    // 3. Провайдер в коде будет передавать реальное значение: <ThemeContext.Provider value={{mode, toggleMode}}>
    // 4. Кастомный хук для потребления. Его задача — гарантировать, что контекст используется внутри провайдера
    
    export function useTheme() {
    const context = useContext(ThemeContext); // Тип: ThemeContextType | undefined
    if (context === undefined) {
        // Эта ошибка сработает на этапе разработки, если хук вызван вне провайдера
        throw new Error('useTheme must be used within a ThemeProvider');
    }
    return context; // Тип: ThemeContextType (undefined отсеяно)
    }

    // Теперь везде используем useTheme() и получаем гарантированно ThemeContextType
```

<!-- v -->

<div style="margin: 0 0 20px 0; text-align: left; font-weight: bold; color: #4a89d2">
useSyncExternalStore
</div>

```tsx
    const state = useSyncExternalStore(
        subscribe,
        getSnapshot,
        getServerSnapshot,
    );
```

<div style="text-align: left;">
Тип выводится из getSnapshot:
</div>

```tsx
    function getSnapshot(): User {
        return store.get();
    }
```

<div style="text-align: left;">
Теперь:
</div>

```tsx
    const state: User
```

<!-- v -->

<div style="margin: 0 0 20px 0; text-align: left; font-weight: bold; color: #4a89d2">
Кастомные хуки
</div>

<div style="text-align: left;">
Это просто функции, поэтому их типизация — это типизация аргументов и возвращаемого значения
</div>

<br/>

<div style="text-align: left;">
    Пример useLocalStorage
</div>

```tsx
    // T - тип значения, которое мы храним. Начальное значение initialValue должно быть типа T.
    function useLocalStorage<T>(key: string, initialValue: T): [T, (value: T) => void] {
        const [storedValue, setStoredValue] = useState<T>(() => {
            // Логика чтения из localStorage...
        });
        const setValue = (value: T) => {
            // Логика записи...
            setStoredValue(value);
        };
        return [storedValue, setValue];
    }
    // Использование: const [name, setName] = useLocalStorage<string>('name', 'Аноним');
```

<!-- s -->

## Типизация событий в React

<!-- v -->

<div style="margin: 0 0 20px 0; text-align: left; font-weight: bold; color: #4a89d2">
Типизация стандартных событий
</div>

<div style="text-align: left; font-size: 27px;">
События типизируются с использованием типа <b>React.SyntheticEvent</b>, который является оберткой над стандартными DOM-событиями. 
<p>Важно помнить, что в React используются специфичные типы для различных событий, такие как React.MouseEvent, React.KeyboardEvent, React.ChangeEvent и другие</p>
</div>

```tsx
//Пример для onClick
const MyComponent: React.ElementType = () => {
const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    console.log('Button clicked at', event.clientX, event.clientY);
};

return <button onClick={handleClick}>Click me</button>;
};

//Пример для onChange на input
const MyComponent: React.ElementType = () => {
const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    console.log('Input changed:', event.target.value);
};

return <input type="text" onChange={handleChange} />;
};
```

<!-- v -->

<div style="margin: 0 0 20px 0; text-align: left; font-weight: bold; color: #4a89d2">
Типизация других событий
</div>

<div style="text-align: left; font-size: 27px;">
React поддерживает типизацию событий для всех стандартных DOM-событий. Вот несколько примеров для различных типов событий:
</div>

```tsx
//////////// onMouseEnter / onMouseLeave: //////////// 

const handleMouseEnter = (event: React.MouseEvent<HTMLDivElement>) => {
    console.log('Mouse entered the div', event.clientX, event.clientY);
};

const handleMouseLeave = (event: React.MouseEvent<HTMLDivElement>) => {
    console.log('Mouse left the div');
};

return (
    <div onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>
        Hover over me!
    </div>
);

//////////// onKeyDown / onKeyUp: //////////// 

const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    console.log('Key pressed:', event.key);
};

return <input type="text" onKeyDown={handleKeyDown} />;

//////////// onSubmit: //////////// 

const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    console.log('Form submitted');
};

return <form onSubmit={handleSubmit}><button type="submit">Submit</button></form>;
```

<!-- s -->

## Типизация форм в React

<!-- v -->

<div style="text-align: left; font-size: 27px;">
В React можно типизировать формы, применяя типы непосредственно к компонентам и их пропсам. Рассмотрим пример, как можно типизировать форму, используя TypeScript.
</div>

```tsx
import React, { useState } from 'react';

// Типизация данных формы
interface FormData {
  name: string;
  age: number;
}

// Типизация пропсов формы
interface FormProps {
  onSubmit: (data: FormData) => void;
}


const MyForm = ({ onSubmit }: FormProps) => {
  const [formData, setFormData] = useState<FormData>({
    name: '',
    age: 0,
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: name === 'age' ? parseInt(value) : value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData); // Передаем данные формы
  };

  return (
    <form onSubmit={handleSubmit}>
      ...
    </form>
  );
};
```

<!-- s -->

### Best Practices и частые ошибки

<br/>

<div style="text-align: left;">
   <b>Избегание any:</b> any отключает проверку типов для значения. <b>Используйте unknown</b> если тип действительно неизвестен, а затем сужайте его с помощью проверок (typeof, instanceof, type guards)
</div>


```tsx
    function safeParse(json: string): unknown { return JSON.parse(json); }
    const data = safeParse('...');
    if (data && typeof data === 'object' && 'id' in data && typeof data.id === 'number') {
    // Здесь TypeScript знает, что data - это объект с числовым полем id
    }
```

<div style="text-align: left;">
   <b>Экспорт типов пропсов : export type { ButtonProps };</b>. Позволяет переиспользовать типы при композиции компонентов (например, в HOC или Storybook)
</div>

<!-- v -->

### Best Practices и частые ошибки

<div style="text-align: left; font-size: 40px">
   <b>Ошибки:</b>
</div>

<br/>

<div style="text-align: left;">
   <b>useRef без null для DOM</b>: 
   <b style="color: green">const ref = useRef&lt;HTMLDivElement&gt;()</b> — <b style="color: red">это ошибка</b>. Инициализатор обязателен. Без него `current` будет `undefined`, что несовместимо с ожидаемым React типом, и может привести к сбоям
</div>

<br>

<div style="text-align: left;">
<b>Не проверка `ref.current` на `null`</b>: Самая частая причина ошибок <b style="color: red">"Cannot read properties of null"</b>. TypeScript заставляет вас это сделать, если вы указали правильный тип (`HTMLDivElement | null`)
</div>
<!-- v -->

### Полезные материалы

<div style="text-align: left;">
<a href='https://github.com/DefinitelyTyped/DefinitelyTyped/blob/master/types/react/index.d.ts'>DefinitelyTyped</a> — это популярный открытый (public) репозиторий с типовыми декларациями для библиотек JavaScript, которые сами по себе не содержат TypeScript-типов.
</div>

