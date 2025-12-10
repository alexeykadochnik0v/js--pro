---
title: "Урок 30: CI/CD и GitHub Actions"
description: "Continuous Integration, Continuous Delivery, Continuous Deployment и автоматизация деплоя с GitHub Actions"
---

# CI/CD и GitHub Actions

## Автоматизация деплоя приложений

<!-- v -->

## Цели занятия

- Понимать и использовать общие концепции CI/CD
- Настраивать деплоймент приложений на основе GitHub Actions
- Опубликовать приложение на собственный VPS с помощью GitHub Actions
- Различать CI, CD (Delivery) и CD (Deployment)
- Работать с self-hosted runners

<!-- v -->

## Краткое содержание

- Deploy и его этапы
- Continuous Integration (CI)
- Continuous Delivery (CD)
- Continuous Deployment (CD)
- Популярные решения CI/CD
- GitHub Actions: workflows, events, jobs, actions, runners
- Практика: деплой на VPS с GitHub Actions

<!-- v -->

## Результат занятия

Рабочий GitHub Actions workflow для автоматического деплоя приложения на VPS при пуше в main ветку

<!-- v -->

## Компетенции по занятию

- **Настраивать CI/CD для Node.js приложений**
- **Работать с GitHub Actions**
- Автоматизировать процессы сборки и деплоя
- Настраивать self-hosted runners
- Понимать различия между CI, Continuous Delivery и Continuous Deployment

<!-- s -->

## Deploy

**Deploy (развертывание)** — процесс доставки приложения от разработчика до конечного пользователя

<!-- v -->

### Типичные шаги деплоя:

1. **Компиляция приложения** (build, auto test, report)
2. **Выгрузка кода** (бинарников) на сервер
3. **Установка зависимостей** (например, `npm install`)
4. **Выполнение тестов**
5. **Публикация приложения**, пакетов, образов

<!-- v -->

### Что относится к CI, CD и CD?

| Этап | Относится к |
|------|-------------|
| Компиляция приложения | **Continuous Integration** |
| Выгрузка кода на сервер | **Continuous Delivery** |
| Установка зависимостей | **Continuous Delivery** |
| Выполнение тестов | **Continuous Delivery** |
| Публикация приложения | **Continuous Deployment** |

<!-- s -->

## Continuous Integration

**Непрерывная интеграция** — практика частого слияния изменений в общую кодовую базу

<!-- v -->

### Как это работает:

1. Разработчики вносят изменения в исходный код
2. Выполняют слияние своих изменений с целевой веткой
3. Изменения проверяются путем **сборки** и запуска **автоматических тестов**
4. Создаются **отчёты** об успешности или неуспешности сборки
5. **Не нужно ждать дня релиза**, чтобы выполнить слияние изменений

<!-- v -->

### Преимущества Continuous Integration:

**Требования:**
- ✅ Написание автоматических тестов
- ✅ Наличие сервера непрерывной интеграции
- ✅ Частое слияние изменений

**Что получаем:**
- ✅ В рабочую среду попадает меньше багов
- ✅ Проблемы интеграции решаются раньше
- ✅ Реже переключение контекста у разработчиков
- ✅ Снижаются затраты на тестирование

<!-- s -->

## Continuous Delivery

**Непрерывная поставка** — продолжение CI, автоматизация процесса выпуска продукта

<!-- v -->

### Ключевые принципы:

- Автоматизирован не только процесс тестирования, но и **процесс выпуска** продукта
- Приложение можно развернуть в любое время **одним нажатием кнопки**
- Рекомендуется выполнять развертывание в рабочей среде **как можно раньше**
- ⚠️ **Важно:** доставка до окружения по кнопке, но не автоматически!

<!-- v -->

### Преимущества Continuous Delivery:

**Требования:**
- ✅ Достаточное количество автотестов
- ✅ Настройка сервера поставки
- ✅ Понимание feature flags

**Что получим:**
- ✅ Простая поставка ПО
- ✅ Чаще выпуск релизов и обратная связь от клиентов
- ✅ Маленькие изменения вносятся быстрее

<!-- s -->

## Continuous Deployment

**Непрерывное развертывание** — каждое изменение автоматически выпускается для клиентов

<!-- v -->

### Особенности:

- Каждое изменение, успешно прошедшее **pipeline**, автоматически выпускается для клиентов
- Сбой возможен только из-за **ошибки во время тестов**
- Разработчики сосредотачиваются на **разработке**, а не релизах
- Отсутствует «**день релиза**»

<!-- v -->

### Преимущества Continuous Deployment:

**Требования:**
- ✅ Очень высокая культура тестирования
- ✅ Документирование изменений вместе с выкатыванием
- ✅ Базирование на feature flags

**Что получим:**
- ✅ Ускорение разработки
- ✅ Снижение рисков за счет мелких поставок
- ✅ Клиенты видят улучшения каждый день

<!-- s -->

## Популярные решения CI/CD

- **GitLab CI/CD** — встроенная CI/CD в GitLab
- **TeamCity** — от JetBrains, мощный и гибкий
- **Jenkins** — старейшая open-source система
- **Travis CI** — популярен для open-source проектов
- **Bitbucket Pipelines** — интеграция с Bitbucket
- **GitHub Actions** — встроенная CI/CD в GitHub ⭐

<!-- s -->

## GitHub Actions

Настраиваемый автоматизированный процесс (**workflow**), запускающий одно или несколько заданий

<!-- v -->

### Основные концепции:

- **Workflow** определяется YAML-файлом в `.github/workflows`
- Репозиторий может содержать **несколько workflows**, каждый со своим набором задач
- Запуск возможен:
  - при **событии** в репозитории (push, PR, release)
  - **вручную**
  - по **расписанию** (cron)

<!-- s -->

## GitHub Actions — Events

**Событие** — триггер, запускающий workflow

### Примеры событий:

```yaml
on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main]
  workflow_dispatch: # ручной запуск
  schedule:
    - cron: '0 0 * * 0' # каждое воскресенье в полночь
```

<!-- s -->

## GitHub Actions — Jobs

**Job** — набор шагов, исполняемых на одном runner

<!-- v -->

### Особенности:

- **Шаг** — shell-команда или вызов action
- Шаги выполняются **последовательно**
- Могут **передавать данные** друг другу
- Jobs могут выполняться **параллельно** или **последовательно** (с зависимостями)

```yaml
jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - name: Install dependencies
        run: npm install
      - name: Run tests
        run: npm test
```

<!-- s -->

## GitHub Actions — Actions

**Action** — специальное приложение для автоматизации часто повторяющихся задач

<!-- v -->

### Примеры популярных Actions:

- `actions/checkout@v3` — клонирование репозитория
- `actions/setup-node@v3` — настройка Node.js
- `docker/login-action@v2` — аутентификация в Docker Hub
- Можно создавать **свои actions** или использовать [GitHub Marketplace](https://github.com/marketplace?type=actions)

<!-- s -->

## GitHub Actions — Runner

**Runner** — сервер, который запускает workflows

### Типы:

- **GitHub-hosted** — предоставляется GitHub (ubuntu-latest, windows-latest, macos-latest)
- **Self-hosted** — ваш собственный сервер (VPS, физический сервер)

⚠️ Runner выполняет только **одно задание** одновременно

<!-- s -->

## Практика: деплой на VPS

### Настройка VPS (например, Jino)

1. Покупаем самый дешёвый VPS
2. Создаём сервер, получаем домен
3. Устанавливаем Ubuntu 22
4. Смотрим SSH-port (может отличаться от 22)
5. Используем web-терминал

<!-- v -->

### Установка Docker на VPS:

```bash
# Следуем официальной документации
# https://docs.docker.com/engine/install/ubuntu/

# Обновляем систему
sudo apt-get update
sudo apt-get install ca-certificates curl gnupg

# Добавляем GPG ключ Docker
sudo install -m 0755 -d /etc/apt/keyrings
curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo gpg --dearmor -o /etc/apt/keyrings/docker.gpg

# Устанавливаем Docker
sudo apt-get update
sudo apt-get install docker-ce docker-ce-cli containerd.io
```

<!-- v -->

### Создание пользователя deploy:

```bash
# Создаём пользователя
useradd -m deploy

# Устанавливаем пароль
passwd deploy

# Добавляем в группу docker
usermod -aG docker deploy

# Устанавливаем bash как shell
chsh -s /bin/bash deploy

# Переходим под пользователя deploy
su deploy
cd /home/deploy
```

<!-- s -->

## Self-Hosted Runner

### Настройка на сервере:

1. Переходим в **Settings** → **Actions** → **Runners** → **New self-hosted runner**
2. Выбираем **Linux**
3. Выполняем команды из секций **Download** и **Configure**:

```bash
# Download
mkdir actions-runner && cd actions-runner
curl -o actions-runner-linux-x64-2.xyz.0.tar.gz -L https://...
tar xzf ./actions-runner-linux-x64-2.xyz.0.tar.gz

# Configure
./config.sh --url https://github.com/YOUR_USERNAME/YOUR_REPO --token YOUR_TOKEN

# Run
./run.sh
```

4. Проверяем статус runner в GitHub (должен стать зелёным)

<!-- s -->

## GitHub Workflow для деплоя

### Создаём `.github/workflows/deploy.yml`:

```yaml
name: Deploy to VPS

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: self-hosted
    steps:
      - name: Checkout code
        uses: actions/checkout@v3

      - name: Build Docker image
        run: docker build -t myapp:latest .

      - name: Stop old container
        run: docker stop myapp || true

      - name: Remove old container
        run: docker rm myapp || true

      - name: Run new container
        run: |
          docker run -d \
            --name myapp \
            --restart unless-stopped \
            -p 80:3000 \
            myapp:latest
```

<!-- s -->

## Вопросы?

Ставим «+», если вопросы есть  
Ставим «–», если вопросов нет

<!-- s -->

## Рефлексия

Проверка достижения целей:
- ✅ Понимаете ли вы концепции CI/CD?
- ✅ Можете ли настроить GitHub Actions для деплоя?
- ✅ Готовы ли опубликовать приложение на VPS?
- Какие сложности возникли при настройке?
- Что хотелось бы изучить глубже?

<!-- s -->

## Тезисы

Сегодня:
- Разобрались с концепциями CI, Continuous Delivery и Continuous Deployment
- Изучили GitHub Actions: workflows, events, jobs, actions, runners
- Настроили self-hosted runner на VPS
- Создали автоматический деплой приложения через GitHub Actions
- Опубликовали приложение на сервере

<!-- s -->

## Дополнительные материалы

1. [GitHub Actions Documentation](https://docs.github.com/en/actions)
2. [GitHub Actions: Continuous Integration](https://docs.github.com/en/actions/automating-builds-and-tests)
3. [GitHub Actions: Continuous Deployment](https://docs.github.com/en/actions/deployment)
4. [GitHub Actions Marketplace](https://github.com/marketplace?type=actions)
5. [Self-hosted runners](https://docs.github.com/en/actions/hosting-your-own-runners)
6. [Docker Installation Guide](https://docs.docker.com/engine/install/ubuntu/)
7. [Пример репозитория](https://github.com/koshelnikov/otus-jspro-docker)
