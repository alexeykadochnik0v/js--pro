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

# Зачем TypeScript в React?

<!-- v -->

`TypeScript` - это инструмент, который меняет процесс разработки на этапе написания кода, а не в браузере.

- Раннее обнаружение ошибок: TypeScript - это как статический анализатор в режиме реального времени. Он проверяет типы не во время выполнения программы (runtime), а во время написания (compile time). Пример классической ошибки: вы передаете в компонент проп `isLoading={true}`, а внутри компонента проверяете `if (props.isloading)`. В JavaScript эта ошибка проявится только при тестировании. TypeScript подчеркнет `isloading` красным, так как в интерфейсе пропсов определено `isLoading`.

- Самодокументируемость кода: Глядя на интерфейс пропсов компонента, вы сразу понимаете его API: какие данные он ожидает, обязательные они или нет, какого типа функции нужно передать. Это критически важно при работе в команде, при возвращении к старому коду или при использовании библиотек. Вместо того чтобы читать документацию или искать в коде, как используется компонент, вы смотрите на его тип.

- Улучшенный Developer Experience (DX): IDE (VSCode, WebStorm) использует информацию о типах для предоставления интеллектуального автодополнения. Вы начинаете вводить `props`. — и видите все доступные пропсы с их типами. Вызываете функцию — видите типы ее аргументов. Это ускоряет разработку и снижает когнитивную нагрузку.

- Повышение надежности: TypeScript не позволит вам случайно передать строку туда, где ожидается массив объектов. Он заставляет явно обрабатывать потенциальные `null` или `undefined`, если вы используете строгий режим `(strict: true)`. Это делает код более устойчивым к edge-кейсам.

<!-- v -->

## Базовые требования

Для работы TS с React нужно немного больше, чем просто установить TypeScript.

- `@types/react`, `@types/react-dom`: Это пакеты с *декларациями типов*. Сам React написан на JavaScript, но эти пакеты описывают его API (хуки, компоненты, события) на языке TypeScript. Без них TypeScript не будет знать, что такое `useState`.

- `tsconfig.json`: Файл конфигурации TypeScript.

    - `"jsx": "react-jsx"` (для React 17+) или `"react"` (для старых версий): Директива для компилятора, говорящая "обрабатывай JSX-синтаксис, преобразуя его в вызовы `React.createElement` или новый jsx-рантайм".

    - `"strict": true` - Важнейшая настройка. Включает весь набор строгих проверок. Без этого TypeScript слишком снисходителен (например, позволяет неявные `any`). Настоящая мощь и безопасность TypeScript раскрываются именно в строгом режиме.

<!-- s -->

# Типизация компонентов в React

<!-- v -->

В TypeScript компонент — это либо функция, либо класс

Тип компонента всегда выводится автоматически:
- если компонент — функция, то TS понимает, что это `(props: Props) => JSX.Element;`
- если это класс, то TS знает, что это `Component<Props, State>;`
- если это HOC, render-prop или что-то ещё — тип определяется через generic-и

React-компонент не имеет отдельного “своего” типа, кроме как функция с типизированными параметрами

<!-- v -->

## Типизация компонентов в React (Примеры)

### Компонент как функция, возвращающая JSX

``` ts
    const Hello: () => JSX.Element = () => {
        return <div>Hello</div>;
    };
```

#### Применение
- Простые компоненты без пропсов
- Когда нужен строгий контракт для возвращаемого значения
- Обучающие или вспомогательные компоненты, где важно контролировать возвращаемое значение

#### Минусы
- Нельзя возвращать null (или условный рендер), если понадобится
- Часто лишняя строгая типизация — TS обычно сам выводит тип возвращаемого JSX

<!-- v -->

## Типизация компонентов в React (Примеры)

### Компонент с типизацией пропсов и сигнатуры

``` ts
    type Props = { name: string };

    const User: (props: Props) => JSX.Element = (props) => {
        return <div>{props.name}</div>;
    };
```

#### Применение
- типизация (props: Props) => JSX.Element задаёт сигнатуру всей функции, а не только пропсов
- TS строго проверяет, что пропсы соответствуют Props и что возвращается JSX
- Это даёт полное понимание контракта функции: что она принимает и что возвращает

#### Минусы
- Иногда избыточно: TS сам может вывести тип функции по пропсам
- Не всегда нужно указывать явно, если компонент простой

<!-- v -->

## Типизация компонентов в React (Примеры)

### Компонент с типом React.ComponentType

``` ts
    type Props = { age: number };

    const Profile: React.ComponentType<Props> = ({ age }) => {
        return <p>Age: {age}</p>;
    };
```

#### Применение
- HOC, где компонент может быть любым типом
- DI (dependency injection) — передача компонентов как пропсов
- Универсальные UI-библиотеки

#### Минусы
- Неявно добавляет children, даже если компонент их не принимает
- Менее строгий, чем конкретная типизация пропсов и функции

<!-- v -->

## Типизация компонентов в React (Примеры)

### Компонент без children (React.VoidFunctionComponent / VFC)

``` ts
    type Props = { value: string };

    const Tag: React.VoidFunctionComponent<Props> = ({ value }) => {
        return <span>{value}</span>;
    };
```

#### Применение
- Кнопки, иконки, маленькие UI-элементы
- Атомарные компоненты в дизайн-системах (цвет, тень, граница...)
- Предотвращение случайного использования children

#### Минусы
- Редко используется в современном коде.
- Иногда проще просто не использовать children и не указывать VFC.

<!-- v -->

## Типизация компонентов в React (Примеры)

### Generic-компонент

``` ts
    interface ItemProps<T> {
        item: T;
    }

    const Item = <T,>(props: ItemProps<T>): JSX.Element => {
        return <pre>{JSON.stringify(props.item)}</pre>;
    };
```

#### Применение
- Списки, таблицы, универсальные UI-компоненты
- Контейнеры для данных с разными типами
- Типизация динамических данных в формах и API

#### Минусы
- Требует понимания generics
- Без <T,> TS может ошибочно интерпретировать JSX как синтаксис generic

<!-- v -->

## Типизация компонентов в React (Примеры)

### memo-компонент

``` ts
    type Props = { title: string };

    const Title: React.MemoExoticComponent<(props: Props) => JSX.Element> = React.memo(function Title({ title }) {
        return <h1>{title}</h1>;
    });
```

#### Применение
- Компоненты, которые часто перерисовываются и могут быть мемоизированы
- HOC или сложные композиции
- Контроль типов при передаче memo-компонента как пропса

#### Минусы
- Синтаксис громоздкий.
- Часто можно обойтись без явного указания типа.

<!-- v -->

## Типизация компонентов в React (Примеры)

### forwardRef-компонент

``` ts
    type Props = { label: string };

    const Input = React.forwardRef<HTMLInputElement, Props>((props, ref): JSX.Element => {
            return <input ref={ref} placeholder={props.label} />;
        }
    );
```

#### Применение
- Кастомные input, textarea, кнопки
- Интеграция с формами, focus management
- UI-киты, где родитель должен управлять DOM

#### Минусы
- Синтаксис сложнее стрелочной функции без forwardRef
- Часто громоздко для простых компонентов

<!-- v -->

## Типизация компонентов в React (Примеры)

### Классовый компонент

``` ts
    type Props = { count: number };
    type State = { mult: number };

    class Counter extends React.Component<Props, State> {
        state: State = { mult: 2 };

        render(): JSX.Element {
            return <div>{this.props.count * this.state.mult}</div>;
        }
    }
```

#### Применение
- Legacy-код с React <16.8
- ErrorBoundaries (классический подход)
- Сложные компоненты с внутренним состоянием, где Hooks не подходят

#### Минусы
- Классовые компоненты устарели для большинства задач
- Громоздко и менее читаемо, чем функциональные компоненты с Hooks
- Сложнее оптимизировать, чем функциональные

<!-- v -->

## Типизация компонентов в React (Примеры)

### Компонент, принимающий другой компонент

``` ts
    type WrapperProps = {
        Component: React.ComponentType<{ message: string }>;
    };

    const Wrapper = ({ Component }: WrapperProps): JSX.Element => {
        return <Component message="Hello from wrapper!" />;
    };
```

#### Применение
- Абстрагировать логику от конкретной реализации UI `<Dialog as={MyStyledComponent} />`
- Композиционные UI-компоненты `<Card Header={CardHeader} Body={CardBody} />`
- Использование Dependency Injection - 
    компонент сам решает, что рендерить, но реализация передаётся снаружи

#### Минусы
- Труднее понять цепочку пропсов, особенно уровнями глубже
- Нельзя подтвердить корректность ref для переданного компонента
- Иногда сложно типизировать дополнительные generic-ограничения
- Нельзя явно ограничить, что компонент должен быть только функциональным, ведь ComponentType допускает классовые компоненты
- Может усложнить отладку: callback-компоненты теряют читаемость


<!-- v -->

## Типизация компонентов в React (Примеры)

### Компонент как render-prop

``` ts
    type Props = {
        render: (count: number) => JSX.Element;
    };

    const Counter: (props: Props) => JSX.Element = ({ render }) => {
        const count = 10;
        return render(count);
    };
```

#### Применение
- Компонент — “контроллер”, а внешняя функция отвечает за UI
- Нужно дать пользователю возможность полностью кастомизировать разметку
- Нужно управлять сложным UI-потоком без контекста или хуков

#### Минусы
- Код может выглядеть многословно и “шумно”
- Глубокая вложенность функций может затруднить чтение
- Хуже автокомплит, чем у компонентного API
- Render-props хуже оптимизируются (каждый ререндер создаёт новую функцию)
- hooks сделали этот подход менее востребованным

<!-- v -->

## Типизация компонентов в React (Примеры)

### Компонент возвращает массив JSX

``` ts
    const List: () => JSX.Element[] = () => {
        return [<li key={1}>One</li>, <li key={2}>Two</li>];
    };
```

#### Применение
- Генераторы элементов списка
- Виртуализация списков
- Когда контейнер (ul/div) задаётся родителем
- Перенос массива элементов в Portal

#### Минусы
- Всегда нужно вручную указывать `key`, иначе React ругается
- Такой компонент нельзя легко обернуть чем-то ещё — он возвращает только массив
- Если нужно добавить разметку — придётся переписывать
- Теряется семантика: часто лучше использовать фрагмент `(<> </>)`

<!-- s -->

# Типизация пропсов в React-компонентах

<!-- v -->

## Способы типизацмм пропсов

### Инлайновая типизация через деструктуризацию параметра функции

```ts
    const Button = ({ label, onClick }: { label: string; onClick: () => void }) => {
        return <button onClick={onClick}>{label}</button>;
    };

    // Использование
    <Button label="Нажми меня" onClick={() => alert('Клик!')} />
```

- Тип пропсов задаётся на месте, прямо в аргументе функции
- Используется деструктуризация + инлайновый тип
- Не нужен отдельный type или interface

### Типизация через параметр функции (явная типизация пропсов)

```ts
    function MyComponent(props: MyProps) { return <div>{props.title}</div>; }
```
- Тип пропсов задаётся для всего объекта аргумента функции (props)
- Можно использовать заранее объявленный type или interface
- Доступ к пропсам через props.propName

### Типизация через деструктуризацию параметра функции с заранее объявленным типом

```ts
    function MyComponent({ title, count }: MyProps) { ... }
```

- Деструктурируем пропсы и одновременно указываем их тип
- Используется заранее объявленный type или interface
- Удобно, когда нужно сразу работать с отдельными переменными пропсов

<!-- v -->

## Создание типа для пропсов

### interface vs type:

- `interface`: Концептуально — это "контракт" или "описание формы объекта". Его ключевая особенность — **декларативное слияние** (если объявить два интерфейса с одним именем, они объединятся) и **расширяемость** (`extends`). Идеально подходит для описания пропсов, state, API-ответов — сущностей, которые могут развиваться

```ts
    interface BaseProps { id: string; }
    interface ButtonProps extends BaseProps {
        title: string;
        onClick: () => void;
    }
```

- `type` **(Type Alias)**: Псевдоним для любого типа. Может описывать не только объект, но и примитив, объединение, кортеж. **Не может быть расширен через** `extends`, но может быть создан через пересечение (`&`)

```ts
    type Status = 'idle' | 'loading' | 'error'; // Объединение (union)
    type ClickHandler = (event: React.MouseEvent) => void; // Функциональный тип
    type ButtonProps = BaseProps & { // Пересечение (intersection)
        variant: 'primary' | 'secondary';
    };
```

### **Рекомендация**: 

- `interface` используйте для пропсов, контекстов и классов — расширяемость и читаемость ошибок
- `type` используйте для всего остального (unions, tuples, utility types)

<!-- v -->

## React.FC / React.FunctionComponent — **За и Против**

Это был стандартный способ типизации на заре TypeScript + React. Это дженерик-тип, который принимает тип пропсов

*Как это было:* const MyComponent: React.FC<MyProps> = ({ title }) => \<div>{title}</div>;

Исторический "плюс": Ранее React.FC неявно включал children?: React.ReactNode в пропсы компонента. Это было удобно, но и опасно — компонент, который не должен принимать children, все равно их принимал по типам

### Современные минусы:

- Неявныx children больше нет (c React 18), поэтому этот "плюс" исчез

- Проблемы с дженериками: `const List: React.FC<ListProps<T>> = ...` — синтаксически сложнее и может вызывать проблемы с выводом типов

- TypeScript не умеет выводить типы значений по умолчанию из defaultProps в React.FC

- Не является идиоматичным: Сообщество и авторы @types/react склоняются к более простому, прямолинейному подходу без обертки в FC

### Вывод: 

Откажитесь от React.FC. Используйте прямое аннотирование. Это делает сигнатуру компонента чище и понятнее

<!-- v -->

## Продвинутые паттерны для типизации пропсов

### Типизация `children`:

- `React.ReactNode` — это **"всё, что может быть отрендерено в React"**. Самый широкий и правильный тип для `children`. Включает: `string`, `number`, `boolean`, `null`, `undefined`, `JSX.Element`, `React.Fragment`, массив из всего перечисленного, `React.Portal`. **Используйте по умолчанию.** 

```ts 
    type ChildrenProp = {
        children: React.ReactNode;
    };
```

- Более узкие типы: `string` (только текст), `JSX.Element` (только один React-элемент, не массив)

<!-- v -->

## Типизация пропсов в React-компонентах (Примеры)

### Обычный объект с простыми типами

``` ts
    type Props = {
        name: string;
        age: number;
    };

    const User = ({ name, age }: Props) => {
        return <div>{name} — {age}</div>;
    };
```

#### Применение
- Большинство компонентов UI
- Простые компоненты-представления
- Формы, карточки, списки

#### Минусы
- Пропсы могут становиться слишком большими при росте компонента
- Нет поддержки опциональности, если не добавить ?

<!-- v -->

## Типизация пропсов в React-компонентах (Примеры)

### Опциональные пропсы

``` ts
    type Props = {
        title?: string;
    };

    const Header = ({ title = "Default" }: Props) => {
        return <h1>{title}</h1>;
    };
```

#### Применение
- Компоненты, где пропсы не обязательны
- Интерфейсы, в которых предусмотрены значения по умолчанию

#### Минусы
- Если не задать default, нужно обрабатывать undefined вручную

<!-- v -->

## Типизация пропсов в React-компонентах (Примеры)

### Пропсы с массивами и объектами

``` ts
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

#### Применение
- Списки, таблицы, сложный UI

#### Минусы
Может быстро стать слишком громоздким → нужно выносить типы в отдельные интерфейсы

<!-- v -->

## Типизация пропсов в React-компонентах (Примеры)

### Union пропсы

``` ts
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

#### Применение
- Компоненты, поведение которых зависит от режима
- Формы, где поля отличаются по типу

#### Минусы
- При большом количестве вариантов код становится тяжёлым.

<!-- v -->

## Типизация пропсов в React-компонентах (Примеры)

### Пропсы со значением "children"

``` ts
    type Props = {
        children: React.ReactNode;
    };

    const Layout = ({ children }: Props) => {
        return <main>{children}</main>;
    };
```

#### Применение
- Контейнеры и layout-компоненты

#### Минусы
- ReactNode слишком широкий тип → сложно контролировать контент

<!-- v -->

## Типизация пропсов в React-компонентах (Примеры)

### Пропсы-функции

``` ts
    type Props = {
        onSelect: (id: number) => void;
    };

    const Item = ({ onSelect }: Props) => {
        return <button onClick={() => onSelect(5)}>Select</button>;
    };
```

#### Применение
- Обработчики событий
- Render callbacks

#### Минусы
- Иногда приходится указывать типы явно, если не получается inference

<!-- v -->

## Типизация пропсов в React-компонентах (Примеры)

### Пропсы как generic (универсальные пропсы)

``` ts
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

#### Применение
- Формы, списки, универсальные элементы UI
- Контролируемые компоненты

#### Минусы
- Код становится сложнее
- Не всегда очевидно, какой тип использовать в JSX

<!-- v -->

## Типизация пропсов в React-компонентах (Примеры)

### Пропсы с "children как функция" (render props)

``` ts
    type Props = {
        children: (open: boolean) => React.ReactNode;
    };

    const Toggle = ({ children }: Props) => {
        const open = true;
        return children(open);
    };
```

#### Применение
- Dropdown, tooltip, modal
- Headless UI-компоненты
- Логические компоненты без конкретной разметки

#### Минусы
- Немного сложнее понять на чтении
- IDE хуже подсказывают структуру, чем при обычном JSX

<!-- v -->

## Типизация пропсов в React-компонентах (Примеры)

### Полиморфный компонент (as проп)

``` ts
    type AsProp<C extends React.ElementType> = {
        as?: C;
    } & React.ComponentPropsWithoutRef<C>;

    const Text = <C extends React.ElementType = "span">(props: AsProp<C>) => {
        const { as: Component = "span", ...rest } = props;
        return <Component {...rest} />;
    };
```

#### Применение
- Создание универсальных компонентов, которые могут быть чем угодно (блок, ссылка, кнопка)
- Дизайн-системы, UI фреймворки
- Хедлесс UI компоненты

#### Минусы
- Сложная типизация, которую новичкам понять сложно
- Высокая вероятность ошибиться
- Усложняет структуру пропсов и IDE-подсказки

<!-- v -->

## Типизация пропсов в React-компонентах (Примеры)

### Пропсы для порталов

``` ts
    type PortalProps = {
        container: HTMLElement;
        children: React.ReactNode;
    };

    const Portal = ({ container, children }: PortalProps) => {
        return ReactDOM.createPortal(children, container);
    };
```

#### Применение
- Модалки
- Тултипы / поповеры
- меню с "изоляцией"

#### Минусы
- Нужно аккуратно работать с жизненным циклом контейнера (он может исчезнуть раньше времени)
- Иногда важно следить за стилями (z-index)

<!-- v -->

## Типизация пропсов в React-компонентах (Примеры)

### Пропы от контекста

``` ts
    type Theme = "light" | "dark";

    type Props = {
        theme: Theme;
    };

    const ThemedBox = ({ theme }: Props) => (
        <div className={theme}>Hello</div>
    );
```

Здесь проп theme может приходить извне или через контекст.

``` ts
    const ThemeContext = React.createContext<Theme>("light");
```

#### Применение
- Темизация
- Локализация
- Пользовательские настройки

#### Минусы
- Невозможно контролировать "кто" передал некорректный проп, если контекст неправильный
- Иногда темы становятся огромными объектами → сложнее типизировать

<!-- v -->

## Типизация пропсов в React-компонентах (Примеры)

### Ограниченные пропсы (tagged union)

``` ts
    type Props =
      | { mode: "view"; itemId: number }
      | { mode: "edit"; item: { id: number; text: string } };
```

#### Применение
- Компоненты с разными режимами отображения
- Формы edit/create/view
- Табы, панели, сложные UI состояния

#### Минусы
- При десятках вариантов union становится огромным
- Нужно внимательно писать логику проверки mode

<!-- v -->

## Типизация пропсов в React-компонентах (Примеры)

### Children как функция с generic

``` ts
    type Props<T> = {
        items: T[];
        children: (item: T) => React.ReactNode;
    };
```

#### Применение
- Headless UI
- Динамические списки
- Абстракция логики списка от рендера

#### Минусы
- Усложняет JSX
- Разработчики путают children как функцию с обычным JSX

<!-- v -->

## Типизация пропсов в React-компонентах (Примеры)

### Пропы с React.ComponentType

``` ts
    type Props = {
        component: React.ComponentType<{ active: boolean }>;
    };
```

#### Применение
- HOC
- С DI компонентами
- Заменяемые компоненты (themeable systems)

#### Минусы
- Добавляет children по умолчанию
- Иногда нужно использовать React.ElementType вместо ComponentType

<!-- v -->

## Типизация пропсов в React-компонентах (Примеры)

### HTML-атрибуты + кастомные пропсы

``` ts
    type Props = React.ButtonHTMLAttributes<HTMLButtonElement> & {
        variant?: "primary" | "outline";
    };
```

#### Применение
- UI-компоненты: Inputs, Buttons, Cards
- Дизайн-системы
- Повторное использование DOM-атрибутов

#### Минусы
- Можно случайно перекрыть важные HTML пропсы
- Типы HTML-атрибутов довольно тяжёлые (влияют на скорость анализа TS)

<!-- s -->

# Типизация хуков

<!-- v -->

## Типизация хуков 

### useState

#### Базовая типизация

``` ts
    const [count, setCount] = React.useState<number>(0);
```

##### Частая ошибка

``` ts
    const [state, setState] = useState(null);
```

TS выводит тип null, и позже нельзя изменить тип.

##### Исправление

``` ts
    const [state, setState] = useState<string | null>(null);
```

#### Типизация сложного объекта

``` ts
    type User = { id: number; name: string };
    const [user, setUser] = useState<User | null>(null);
```

<!-- v -->

## Типизация хуков 

### useReducer

`useReducer` требует полной типизации state machine (конечного автомата)

Discriminated Union для `Action`: Это паттерн, когда каждое действие (action) имеет поле `type` с литеральным типом (например, `'increment'`). TypeScript может затем сузить тип действия в редюсере, основываясь на этом поле, и обеспечить безопасный доступ к специфичным полям `payload`.

```ts
    type State = { count: number; user?: string };                  //! ограниченный набор состояний

    // Определяем действия как объединение (union) разных объектов
    type Action =                                                   //! входные события (actions/events)
    | { type: 'increment' } // Действие без доп. данных
    | { type: 'decrement' }
    | { type: 'set'; payload: number } // Действие с payload типа number
    | { type: 'login'; payload: { user: string } }; // Действие с payload-объектом
                                                   
    function reducer(state: State, action: Action): State {         //! правила переходов
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

## Типизация хуков 

### useEffect / useLayoutEffect

В React типизация уже встроена, и полноценная сигнатура выглядит так:

```ts
    function useEffect(
        effect: () => (void | (() => void)),
        deps?: readonly unknown[]
    ): void;
```

##### Разберём:

- effect — функция, которая либо ничего не возвращает, либо возвращает cleanup функцию
- deps — массив зависимостей, только для чтения (readonly), элементы — unknown

Типизация здесь минимальна, но важна для чистоты кода

```ts
    useEffect(() => {
        const timer = setTimeout(() => {}, 1000);
        // Возвращаемая функция ДОЛЖНА быть без возвращаемого значения
        return () => clearTimeout(timer); // OK
        // return 5; // Ошибка
    }, []);
```

Если необходимо ограничить зависимости, можно сделать так:

```ts
    function useMyHook(value: string) {
        useEffect(() => {
            console.log(value);
        }, [value] satisfies readonly [string]);
    }
```

#### Нельзя возвращать async-функцию

```ts
    useEffect(async () => { ... }, []); // ошибка
```

А так можно:
    
```ts
    useEffect(() => {
        (async () => {})();
    }, []);
```

<!-- v -->

## Типизация хуков 

### useRef

`useRef` **может хранить мутируемое значение**, доступное на протяжении всего жизненного цикла компонента, но **также может хранить ссылку на DOM-элемент**. Типизация отличается принципиально

#### useRef c DOM-элементом

- Создаем реф: `const inputRef = useRef<HTMLInputElement>(null)`. Обязательно `null`! Это требование React для инициализации

- Вешаем на элемент: `<input ref={inputRef} />`

- Используем: `inputRef.current` имеет тип `HTMLInputElement | null`. **ПРОВЕРКА НА NULL ОБЯЗАТЕЛЬНА!** Потому что на момент первого рендера (при вызове `useRef`) элемент еще не создан, и свойство `current` будет `null`

```ts
    const handleClick = () => {
        if (inputRef.current) { // TypeScript знает, что здесь current - HTMLInputElement
            inputRef.current.focus(); // Без проверки будет ошибка TS
        }
    };
```
#### Мутируемое значение (instance variable):

```ts
    const intervalId = useRef<number | undefined>(undefined); // Для setInterval
    const previousValue = useRef<string>(''); // Для хранения предыдущего значения пропса
    // При инициализации можно задать любое значение нужного типа
    // Особенность: Меняем .current напрямую, это не вызовет ререндер
    useEffect(() => {
        intervalId.current = window.setInterval(() => {});
        return () => clearInterval(intervalId.current);
    }, []);
```

Здесь `.current` можно менять без проверок. Важно: тип не включает `null` (если вы сами его не добавили)

<!-- v -->

## Типизация хуков 

### useMemo / useCallback

#### useMemo

```ts
    const sum = useMemo<number>(() => a + b, [a, b]);
```

- Если указать generic — TS гарантирует тип результата
- Если не указать → выводится автоматически из return


#### useCallback: 

- Важно явно аннотировать параметры функции, так как они не могут быть выведены из пустой зависимости

```ts
    // Без аннотации event будет типа `any`
    const badHandler = useCallback((event) => { console.log(event.clientX); }, []);

    // С аннотацией - тип безопасен
    const goodHandler = useCallback((event: React.MouseEvent<HTMLButtonElement>) => {
        console.log(event.clientX);
    }, []);
```

- Указываем generic, если TS не может вывести тип сам

```ts
    const handleClick = useCallback<(id: number) => void>(
        (id) => console.log(id),
        [],
    );
```

<!-- v -->

## Типизация хуков 

### useContext

**Проблема:** Без TypeScript контекст может вернуть undefined по умолчанию, и вы об этом узнаете в рантайме

**Решение:** Создать строго типизированный контекст и кастомный хук-обертку

```ts
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

## Типизация хуков 

### useSyncExternalStore

```ts
    const state = useSyncExternalStore(
        subscribe,
        getSnapshot,
        getServerSnapshot,
    );
```

###### Тип выводится из getSnapshot:
```ts
    function getSnapshot(): User {
        return store.get();
    }
```

###### Теперь:

```ts
    const state: User
```

<!-- v -->

## Типизация хуков 

### Кастомные хуки

Это просто функции, поэтому их типизация — это типизация аргументов и возвращаемого значения

#### Пример useLocalStorage:

```ts
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

# Best Practices и частые ошибки

## Практики:

- Избегание `any`: `any` отключает проверку типов для значения. Используйте `unknown` если тип действительно неизвестен, а затем сужайте его с помощью проверок (typeof, instanceof, type guards)

```ts
    function safeParse(json: string): unknown { return JSON.parse(json); }
    const data = safeParse('...');
    if (data && typeof data === 'object' && 'id' in data && typeof data.id === 'number') {
    // Здесь TypeScript знает, что data - это объект с числовым полем id
    }
```

- Экспорт типов пропсов: `export type { ButtonProps };`. Позволяет переиспользовать типы при композиции компонентов (например, в HOC или Storybook)

## Ошибки:

`useRef` без `null` для DOM: `const ref = useRef<HTMLDivElement>()` — это ошибка. Инициализатор обязателен. Без него `current` будет `undefined`, что несовместимо с ожидаемым React типом, и может привести к сбоям

Не проверка `ref.current` на `null`: Самая частая причина ошибок "Cannot read properties of null". TypeScript заставляет вас это сделать, если вы указали правильный тип (`HTMLDivElement | null`)

<!-- v -->

## Полезные материалы

**DefinitelyTyped** — это популярный открытый (public) репозиторий с типовыми декларациями для библиотек JavaScript, которые сами по себе не содержат TypeScript-типов.

**https://github.com/DefinitelyTyped/DefinitelyTyped/blob/master/types/react/index.d.ts**
