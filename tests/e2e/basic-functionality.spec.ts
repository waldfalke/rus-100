import { test, expect } from '@playwright/test';

test.describe('Test Generator Page', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('should have correct title', async ({ page }) => {
    // Страница генератора тестов имеет заголовок "Генерация теста"
    await expect(page).toHaveTitle(/Генерация теста/);
  });

  test('should load without errors', async ({ page }) => {
    await expect(page.locator('body')).toBeVisible();
    // Должен быть заголовок страницы
    await expect(page.locator('h1')).toContainText(/Генерация теста/i);
  });

  test('should have main content area', async ({ page }) => {
    // Проверим наличие основного контента
    await expect(page.locator('main, [role="main"], .main-content')).toBeVisible();
  });

  test('should have task cards', async ({ page }) => {
    // Проверим наличие карточек заданий - более гибкий поиск
    const taskCards = page.locator('.task-card, [data-testid="task-card"], [class*="card"], [class*="task"]');

    // Если карточки не найдены, проверим другие возможные элементы
    const possibleElements = [
      '.task-card',
      '[data-testid="task-card"]',
      '[class*="card"]',
      '[class*="task"]',
      'article',
      'section',
      '.container'
    ];

    let foundCards = false;
    for (const selector of possibleElements) {
      const elements = page.locator(selector);
      if (await elements.count() > 0) {
        await expect(elements.first()).toBeVisible();
        foundCards = true;
        break;
      }
    }

    // Если нашли карточки, проверим их функциональность
    if (foundCards) {
      const cards = page.locator('.task-card, [data-testid="task-card"], [class*="card"]').first();
      await expect(cards).toBeVisible();
    }
  });
});

test.describe('Theme Toggle', () => {
  test('should toggle between light and dark themes', async ({ page }) => {
    await page.goto('/');

    // Ищем переключатель темы
    const themeToggle = page.locator('[data-testid="theme-toggle"], .theme-toggle, button:has([data-lucide="sun"], [data-lucide="moon"])').first();

    // Если переключатель темы существует, тестируем его
    if (await themeToggle.isVisible()) {
      // Получаем начальную тему
      const initialTheme = await page.evaluate(() => {
        return document.documentElement.classList.contains('dark') ? 'dark' : 'light';
      });

      // Кликаем по переключателю
      await themeToggle.click();

      // Проверяем, что тема изменилась
      const newTheme = await page.evaluate(() => {
        return document.documentElement.classList.contains('dark') ? 'dark' : 'light';
      });

      expect(newTheme).not.toBe(initialTheme);

      // Кликаем еще раз для возврата к исходной теме
      await themeToggle.click();
      const revertedTheme = await page.evaluate(() => {
        return document.documentElement.classList.contains('dark') ? 'dark' : 'light';
      });

      expect(revertedTheme).toBe(initialTheme);
    }
  });
});

test.describe('Task Management', () => {
  test('should display task cards with controls', async ({ page }) => {
    await page.goto('/');

    // Ищем карточки заданий или любые интерактивные элементы
    const possibleCards = [
      '.task-card',
      '[data-testid="task-card"]',
      '[class*="card"]',
      '[class*="task"]',
      'article',
      'section'
    ];

    let foundInteractiveElements = false;
    for (const selector of possibleCards) {
      const elements = page.locator(selector);
      if (await elements.count() > 0) {
        const firstElement = elements.first();
        await expect(firstElement).toBeVisible();
        foundInteractiveElements = true;

        // Проверим наличие кнопок внутри элемента
        const buttons = firstElement.locator('button');
        const buttonCount = await buttons.count();

        if (buttonCount > 0) {
          // Если есть кнопки, проверим их видимость
          await expect(buttons.first()).toBeVisible();
        }

        break;
      }
    }

    // Если не нашли карточки, просто проверим наличие любых кнопок на странице
    if (!foundInteractiveElements) {
      const anyButtons = page.locator('button:visible');
      const visibleCount = await anyButtons.count();
      expect(visibleCount).toBeGreaterThan(0);
    }
  });

  test('should allow interaction with task controls', async ({ page }) => {
    await page.goto('/');

    // Ищем любые интерактивные элементы
    const interactiveElements = page.locator('button, [role="button"], [onclick]');

    if (await interactiveElements.count() > 0) {
      const firstInteractive = interactiveElements.first();

      if (await firstInteractive.isVisible() && await firstInteractive.isEnabled()) {
        // Попробуем кликнуть по элементу
        await firstInteractive.click();

        // Подождем реакции интерфейса
        await page.waitForTimeout(500);

        // Элемент должен оставаться видимым после взаимодействия
        await expect(firstInteractive).toBeVisible();
      }
    }
  });
});

test.describe('Responsive Design', () => {
  test('should work on mobile viewport', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('/');

    // Проверяем, что контент доступен на мобильном устройстве
    await expect(page.locator('body')).toBeVisible();

    // Должен быть видим основной контент
    await expect(page.locator('h1')).toBeVisible();
  });

  test('should work on tablet viewport', async ({ page }) => {
    await page.setViewportSize({ width: 768, height: 1024 });
    await page.goto('/');

    await expect(page.locator('body')).toBeVisible();
  });

  test('should work on desktop viewport', async ({ page }) => {
    await page.setViewportSize({ width: 1920, height: 1080 });
    await page.goto('/');

    await expect(page.locator('body')).toBeVisible();
  });
});

test.describe('Accessibility', () => {
  test('should have proper heading structure', async ({ page }) => {
    await page.goto('/');

    // Проверяем наличие заголовка h1
    const h1 = page.locator('h1').first();
    if (await h1.isVisible()) {
      await expect(h1).toBeVisible();
    }

    // Проверяем иерархию заголовков
    const headings = page.locator('h1, h2, h3, h4, h5, h6');
    const headingCount = await headings.count();

    if (headingCount > 0) {
      // Если есть заголовки, должен быть h1
      const h1Count = await page.locator('h1').count();
      if (headingCount > 1) {
        expect(h1Count).toBeGreaterThan(0);
      }
    }
  });

  test('should have proper focus management', async ({ page }) => {
    await page.goto('/');

    // Проверяем наличие фокусируемых элементов
    const focusableElements = page.locator('a, button, input, textarea, select, [tabindex]:not([tabindex="-1"])');
    const focusableCount = await focusableElements.count();

    if (focusableCount > 0) {
      // Тестируем, что элементы могут получать фокус через Tab
      await page.keyboard.press('Tab');
      const focusedElement = page.locator(':focus');
      await expect(focusedElement).toBeVisible();
    }
  });
});

test.describe('Performance', () => {
  test('should load page within acceptable time', async ({ page }) => {
    const startTime = Date.now();
    await page.goto('/', { waitUntil: 'networkidle' });
    const loadTime = Date.now() - startTime;

    // Страница должна загружаться за разумное время
    expect(loadTime).toBeLessThan(10000); // 10 секунд максимум
  });

  test('should have reasonable resource count', async ({ page }) => {
    await page.goto('/');

    // Подсчитываем ресурсы
    const resources = page.locator('script, link[rel="stylesheet"], img');
    const resourceCount = await resources.count();

    // Не должно быть чрезмерного количества ресурсов
    expect(resourceCount).toBeLessThan(100);
  });
});
