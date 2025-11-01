import { test, expect } from '@playwright/test';

/**
 * Страничный инспектор - тест для исследования структуры страницы
 */
test.describe('Page Structure Inspector', () => {
  test('should inspect page structure and elements', async ({ page }) => {
    await page.goto('/');

    // Ждем полной загрузки страницы
    await page.waitForLoadState('networkidle');

    console.log('=== PAGE STRUCTURE INSPECTION ===');

    // Проверим заголовок страницы
    const title = await page.title();
    console.log(`Page title: ${title}`);

    // Проверим H1 заголовок
    const h1Elements = page.locator('h1');
    const h1Count = await h1Elements.count();
    console.log(`H1 elements count: ${h1Count}`);

    if (h1Count > 0) {
      const h1Text = await h1Elements.first().textContent();
      console.log(`H1 text: ${h1Text}`);
    }

    // Исследуем структуру body
    const bodyChildren = await page.locator('body > *').count();
    console.log(`Direct body children: ${bodyChildren}`);

    // Проверим основные семантические элементы
    const semanticElements = ['header', 'nav', 'main', 'section', 'article', 'aside', 'footer'];
    for (const element of semanticElements) {
      const count = await page.locator(element).count();
      if (count > 0) {
        console.log(`${element}: ${count} elements`);
      }
    }

    // Проверим элементы с классами card или task
    const cardElements = await page.locator('[class*="card"], [class*="task"]').count();
    console.log(`Card/Task elements: ${cardElements}`);

    // Проверим кнопки
    const buttonElements = await page.locator('button').count();
    console.log(`Button elements: ${buttonElements}`);

    // Проверим элементы с data-testid
    const testIdElements = await page.locator('[data-testid]').count();
    console.log(`Elements with data-testid: ${testIdElements}`);

    // Список всех элементов с data-testid
    if (testIdElements > 0) {
      const testIds = await page.locator('[data-testid]').evaluateAll(elements =>
        elements.map(el => el.getAttribute('data-testid')).filter(Boolean)
      );
      console.log(`Test IDs found: ${testIds.join(', ')}`);
    }

    // Проверим элементы с классами содержащими определенные слова
    const classPatterns = ['card', 'task', 'button', 'nav', 'header', 'main', 'theme'];
    for (const pattern of classPatterns) {
      const elements = await page.locator(`[class*="${pattern}"]`).count();
      if (elements > 0) {
        console.log(`Elements with "${pattern}" class: ${elements}`);
      }
    }

    // Сохраним скриншот для визуального анализа
    await page.screenshot({ path: 'test-results/page-inspection.png', fullPage: true });

    // Минимальные проверки - страница должна загружаться
    await expect(page.locator('body')).toBeVisible();

    console.log('=== INSPECTION COMPLETE ===');
  });

  test('should analyze interactive elements', async ({ page }) => {
    await page.goto('/');

    console.log('=== INTERACTIVE ELEMENTS ANALYSIS ===');

    // Анализируем все интерактивные элементы
    const interactiveSelectors = [
      'a[href]',
      'button',
      '[role="button"]',
      'input[type="submit"]',
      'input[type="button"]',
      '[onclick]',
      '[data-testid]'
    ];

    for (const selector of interactiveSelectors) {
      const elements = page.locator(selector);
      const count = await elements.count();

      if (count > 0) {
        console.log(`${selector}: ${count} elements`);

        // Для первых 3 элементов выведем дополнительную информацию
        for (let i = 0; i < Math.min(count, 3); i++) {
          const element = elements.nth(i);
          const isVisible = await element.isVisible();
          const text = await element.textContent();
          const className = await element.getAttribute('class');
          console.log(`  [${i}] Visible: ${isVisible}, Text: "${text}", Class: "${className}"`);
        }
      }
    }

    console.log('=== INTERACTIVE ANALYSIS COMPLETE ===');
  });
});
