# JavaScript Professional

> Публичная версия (GitHub Pages): https://alexeykadochnik0v.github.io/js--pro/

Это репозиторий курса ["OTUS JavaScript Professional"](https://otus.ru/lessons/javascript-professional/)

<details>
  <summary>Структура репозитория</summary>

Репозиторий имеет следующую структуру:

- В корне проекта находятся файлы настроек проекта и используемых инструментов
- В директории `lessons` находятся под-директории по маске `lesson{XX}` с материалами для каждого занятия
- Занятия сгруппированы по 7 модулям в соответствии с программой курса:
  - Модуль 1: Продвинутые основы JavaScript и TypeScript (занятия 1-4)
  - Модуль 2: Инфраструктура фронтенда и базовые подходы (занятия 5-8)
  - Модуль 3: React и экосистема (занятия 9-16)
  - Модуль 4: Vue и экосистема (занятия 17-21)
  - Модуль 5: Архитектура и SSR (занятия 22-23)
  - Модуль 6: Backend, серверные технологии и контейнеризация (занятия 24-30)
  - Модуль 7: Проектная работа (занятия 31-33)
  </details>

<details>
  <summary>Работа с репозиторием</summary>

Репозиторий обслуживается инструментами на базе Node.js. Для работы понадобится `node.js` и `npm` (в качестве пакетного менеджера).

```bash
# Склонируйте репозиторий
git clone https://github.com/JavaScript-Basic-OTUS/otus--jspro

# Установите зависимости
cd otus--jspro && npm install

# Создайте директорию для нового занятия
mkdir lessons/lessonXX

# Создайте файл для нового занятия
touch lessons/lessonXX/lesson.md

# Запустите reveal-md в режиме разработки
npm run dev -- lessons/lessonXX/lesson.md
```

При коммите должны сработать husky-хуки для проверки и форматирования измененных файлов. Дополнительная проверка настроена через github-actions.

При мерже пуллреквеста в мастер можно публиковать материалы на GitHub Pages этого репозитория: https://alexeykadochnik0v.github.io/js--pro/

> Почему на Pages может отображаться «сплошной текст» без заголовков и форматирования?
>
> GitHub Pages отдает `index.md` как обычную страницу (или пропускает через Jekyll) и не подключает Reveal.js. Для корректного отображения нужно сгенерировать статический сайт из Reveal-md (HTML + ассеты) и разместить его в `docs/`.

### Публикация презентаций Reveal-md на GitHub Pages

1. Сгенерировать статическую версию главной страницы (индекса):

   ```bash
   npx reveal-md lessons/index.md --static docs --static-dirs ".reveal-md,lessons"
   ```

   - В `docs/` появится `index.html` и необходимые файлы Reveal.js.
   - Опция `--static-dirs` скопирует пользовательские стили `/.reveal-md` и исходные markdown-файлы, если они упоминаются.

2. Добавить файл, отключающий обработку Jekyll (важно для путей с подчеркиваниями):

   ```bash
   echo > docs/.nojekyll
   ```

3. В настройках репозитория включить GitHub Pages с источником `Branch: main` и папкой `/docs`.

4. Открыть сайт: https://alexeykadochnik0v.github.io/js--pro/

Дополнительно можно добавить npm-скрипт:

```json
{
  "scripts": {
    "build:index": "reveal-md lessons/index.md --static docs --static-dirs .reveal-md,lessons"
  }
}
```

И затем выполнять:

```bash
npm run build:index && git add docs && git commit -m "build: pages" && git push
```

Если для занятия (для демонстрации или для активностей) нужно запускать примеры кода - используйте codesandbox, разместив код в поддиректории соответствующего урока (чтобы держать все материалы в одном месте).

</details>
