import { BeforeAll, AfterAll, Before, After, setWorldConstructor } from '@cucumber/cucumber';
import { chromium, Browser, BrowserContext, Page } from '@playwright/test';

// Кастомный World для Cucumber
class CustomWorld {
  browser?: Browser;
  context?: BrowserContext;
  page!: Page;

  constructor() {
    // Инициализация world
  }
}

// Устанавливаем кастомный World
setWorldConstructor(CustomWorld);

// Глобальный браузер
let browser: Browser;

// Запуск браузера перед всеми тестами
BeforeAll(async function() {
  browser = await chromium.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });
});

// Закрытие браузера после всех тестов
AfterAll(async function() {
  if (browser) {
    await browser.close();
  }
});

// Создание нового контекста и страницы перед каждым сценарием
Before(async function(this: CustomWorld) {
  this.context = await browser.newContext({
    viewport: { width: 1280, height: 720 },
    baseURL: 'http://localhost:3000'
  });
  this.page = await this.context.newPage();
});

// Закрытие контекста после каждого сценария
After(async function(this: CustomWorld) {
  if (this.context) {
    await this.context.close();
  }
});
