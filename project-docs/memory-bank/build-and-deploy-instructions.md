# Инструкции по сборке и деплою

## Локальная разработка

### Запуск в режиме разработки
```bash
npm run dev
```
- Запускает приложение в режиме разработки
- Доступно по адресу http://localhost:3000
- Поддерживает hot-reload (автоматическое обновление при изменениях)

### Локальная сборка и просмотр
1. Сборка для локального просмотра:
```bash
npm run build:local
```

2. Запуск локального сервера для просмотра собранного приложения:
```bash
npm run start:static:local
```
- Доступно по адресу http://localhost:3000
- Показывает приложение точно так, как оно будет работать в продакшене
- Не поддерживает hot-reload

## Деплой на GitHub Pages

### Автоматический деплой через GitHub Actions
1. Закоммитить изменения:
```bash
git add .
git commit -m "Описание изменений"
git push
```
2. GitHub Actions автоматически:
   - Запустит сборку с правильными настройками для GitHub Pages
   - Выполнит деплой на GitHub Pages
   - Процесс можно отслеживать во вкладке "Actions" на GitHub

### Ручная сборка для GitHub Pages
Если нужно проверить сборку локально перед отправкой на GitHub:

1. Для Windows:
```bash
npm run build:gh-pages:win
```

2. Для Unix-систем (Linux/MacOS):
```bash
npm run build:gh-pages
```

## Деплой Storybook на GitHub Pages

### Автоматический деплой через GitHub Actions
Storybook можно деплоить отдельно от основного сайта на GitHub Pages. Для этого используется отдельный workflow (например, `.github/workflows/deploy-storybook.yml`).

1. После коммита в основную ветку GitHub Actions:
   - Собирает Storybook командой `npm run build-storybook`
   - Публикует содержимое папки `storybook-static` на ветку `gh-pages` или в поддиректорию `/storybook/`
   - Публичная ссылка: `https://<username>.github.io/<repository-name>/storybook/`

2. Для ручной сборки Storybook:
```bash
npm run build-storybook
```
- Собранная версия будет в папке `storybook-static`
- Для локального просмотра:
```bash
npx serve storybook-static
```

### Пример workflow для деплоя Storybook
```yaml
name: Deploy Storybook to GitHub Pages
on:
  push:
    branches: [main]
  workflow_dispatch:
jobs:
  build-and-deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: '20'
      - run: npm ci
      - run: npm run build-storybook
      - name: Deploy to GitHub Pages
        uses: peaceiris/actions-gh-pages@v4
        with:
          github_token: ${{ secrets.GITHUB_TOKEN }}
          publish_dir: ./storybook-static
          destination_dir: storybook
```

## Storybook: настройка, токены, деплой

### 1. Подключение токенов и глобальных стилей
- Вынесите все цвета, шрифты, размеры, spacing и т.д. в отдельные файлы (например, `tokens.ts`, `theme.ts`, или CSS-переменные в `globals.css`).
- Убедитесь, что эти файлы импортируются в `globals.css` или напрямую в `.storybook/preview.js`.
- Если используется ThemeProvider (например, из `next-themes`), добавьте его в decorators в `.storybook/preview.js`:
  ```js
  import { ThemeProvider } from 'next-themes';
  export const decorators = [
    (Story) => <ThemeProvider attribute="class"><Story /></ThemeProvider>,
  ];
  ```

### 2. Создание stories для токенов
- Создайте отдельные stories-файлы для визуализации токенов:
  - `Colors.stories.tsx` — палитра цветов
  - `Typography.stories.tsx` — шрифты, размеры
  - `Spacing.stories.tsx` — отступы, размеры
- В этих stories визуализируйте все значения токенов, чтобы можно было быстро проверить их работу.

### 3. Перенос компонентов
- После подключения токенов и стилей создавайте stories для компонентов (Button, Input, Card и т.д.).
- Убедитесь, что компоненты выглядят и ведут себя так же, как на сайте.

### 4. Запуск Storybook локально
```sh
npm run storybook
```
- Откройте http://localhost:6006/
- Проверьте, что отображаются токены и компоненты.

### 5. Сборка и деплой Storybook
- Для сборки Storybook:
```sh
npm run build-storybook
```
- Для деплоя на GitHub Pages используется workflow `.github/workflows/deploy-storybook.yml`.
- После пуша в main Storybook будет доступен по адресу:
  `https://<ваш-github-username>.github.io/<repository-name>/storybook/`

### 6. Если что-то не работает
- Проверьте паттерн stories в `.storybook/main.ts` — он должен включать все ваши stories-файлы.
- Убедитесь, что все импорты токенов и стилей корректны.
- Если компоненты выглядят не так, как на сайте — проверьте ThemeProvider, Tailwind-конфиг, globals.css.
- Для сброса кэша Storybook (если dev-сервер глючит):
```sh
rm -rf node_modules/.cache/storybook
```
- Если нужна помощь — смотрите контракты в `project-docs/contracts/storybook/`.

## Важные особенности

### Конфигурация путей
- Локальная разработка использует относительные пути
- GitHub Pages требует префикс `/rus-100/` для всех путей
- Конфигурация автоматически определяется через переменную окружения `GITHUB_PAGES`

### Структура сборки
- Исходные файлы находятся в директориях `app/` и `components/`
- Собранные файлы помещаются в директорию `out/`
- Статические ассеты (изображения, шрифты) должны находиться в `public/`

### Проверка результатов
1. Локальная версия:
   - Должна работать по адресу http://localhost:3000
   - Все ассеты должны загружаться корректно
   - Навигация должна работать без ошибок

2. GitHub Pages версия:
   - Проверить работу по адресу https://[username].github.io/rus-100/
   - Все пути должны начинаться с `/rus-100/`
   - Проверить работу навигации и загрузку ассетов

### Решение проблем
1. Если локальная сборка не работает:
   - Проверить `next.config.mjs`
   - Очистить `.next` и `out` директории
   - Переустановить зависимости: `npm ci`

2. Если деплой на GitHub Pages не работает:
   - Проверить настройки репозитория (Settings -> Pages)
   - Проверить файл `.github/workflows/deploy.yml`
   - Просмотреть логи в GitHub Actions 