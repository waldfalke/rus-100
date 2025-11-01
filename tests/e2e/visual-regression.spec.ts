import { test, expect } from '@playwright/test';

/**
 * Enhanced Visual Regression Tests
 * These tests capture screenshots of key pages and components
 * to detect visual changes in the UI.
 */
test.describe('Visual Regression', () => {
  test.beforeEach(async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 720 });
  });

  test('should match test generator page visual baseline', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    
    // Wait for loading state to disappear
    await page.waitForSelector('text=Загрузка данных...', { 
      state: 'hidden', 
      timeout: 10000 
    }).catch(() => {});
    
    // Wait for fonts and settle
    await page.evaluate(() => document.fonts.ready);
    await page.waitForTimeout(1000);

    await expect(page).toHaveScreenshot('test-generator-page.png', {
      fullPage: true,
      animations: 'disabled',
      caret: 'hide',
      timeout: 10000,
    });
  });

  test('should match light theme visual baseline', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    
    // Wait for loading to complete
    await page.waitForSelector('text=Загрузка данных...', { 
      state: 'hidden', 
      timeout: 10000 
    }).catch(() => {});

    await page.evaluate(() => {
      document.documentElement.classList.remove('dark');
    });
    
    // Wait for fonts and settle
    await page.evaluate(() => document.fonts.ready);
    await page.waitForTimeout(1000);

    await expect(page).toHaveScreenshot('theme-light.png', {
      fullPage: true,
      animations: 'disabled',
      caret: 'hide',
      timeout: 10000,
    });
  });

  test('should match dark theme visual baseline', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    
    // Wait for loading to complete
    await page.waitForSelector('text=Загрузка данных...', { 
      state: 'hidden', 
      timeout: 10000 
    }).catch(() => {});

    await page.evaluate(() => {
      document.documentElement.classList.add('dark');
    });
    
    // Wait for fonts and settle
    await page.evaluate(() => document.fonts.ready);
    await page.waitForTimeout(1000);

    await expect(page).toHaveScreenshot('theme-dark.png', {
      fullPage: true,
      animations: 'disabled',
      caret: 'hide',
      timeout: 10000,
    });
  });
});

/**
 * DOM Structure Inspector
 * Detailed analysis of page DOM structure and components
 */
test.describe('DOM Structure Inspector', () => {
  test('should analyze complete DOM structure', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    console.log('=== DETAILED DOM STRUCTURE ANALYSIS ===');

    // Анализируем document structure
    const structure = await page.evaluate(() => {
      const getElementInfo = (element: Element, depth = 0): any => {
        const info: any = {
          tag: element.tagName.toLowerCase(),
          id: element.id || null,
          classes: element.className || null,
          text: element.textContent?.trim().substring(0, 50) || null,
          depth,
          children: []
        };

        // Добавляем атрибуты
        const attributes: any = {};
        for (const attr of element.attributes) {
          attributes[attr.name] = attr.value;
        }
        if (Object.keys(attributes).length > 0) {
          info.attributes = attributes;
        }

        // Рекурсивно анализируем детей (ограничим глубину)
        if (depth < 4) {
          for (const child of element.children) {
            info.children.push(getElementInfo(child, depth + 1));
          }
        }

        return info;
      };

      return getElementInfo(document.body);
    });

    console.log(JSON.stringify(structure, null, 2));

    console.log('DOM structure analysis complete');
  });

  test('should identify all interactive elements', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    console.log('=== INTERACTIVE ELEMENTS CATALOG ===');

    const interactiveElements = await page.locator('button, a, input, select, textarea, [role="button"], [onclick], [data-testid]').all();

    for (let i = 0; i < interactiveElements.length; i++) {
      const element = interactiveElements[i];

      const info = await element.evaluate((el) => {
        const rect = el.getBoundingClientRect();
        return {
          tag: el.tagName.toLowerCase(),
          id: el.id || null,
          classes: el.className || null,
          text: el.textContent?.trim().substring(0, 40) || null,
          testId: el.getAttribute('data-testid'),
          role: el.getAttribute('role'),
          href: el.getAttribute('href'),
          type: el.getAttribute('type'),
          isVisible: rect.width > 0 && rect.height > 0,
          position: { x: Math.round(rect.x), y: Math.round(rect.y), width: Math.round(rect.width), height: Math.round(rect.height) }
        };
      });

      const visibility = info.isVisible ? 'VISIBLE' : 'HIDDEN';
      const position = `(${info.position.x}, ${info.position.y}, ${info.position.width}x${info.position.height})`;

      console.log(`${i + 1}. ${info.tag}${info.id ? `#${info.id}` : ''}${info.classes ? `.${info.classes}` : ''} ${visibility} ${position}`);
      if (info.testId) console.log(`   TestID: ${info.testId}`);
      if (info.text) console.log(`   Text: "${info.text}"`);
    }

    console.log(`Total interactive elements: ${interactiveElements.length}`);
  });
});

/**
 * Interactive Element Navigation Tests
 * Test keyboard navigation and interaction flows
 */
test.describe('Interactive Navigation', () => {
  test('should navigate through all interactive elements with Tab', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    // Получим все интерактивные элементы
    const interactiveElements = await page.locator('button, a, input, select, textarea, [role="button"], [tabindex]:not([tabindex="-1"])').all();

    console.log(`Found ${interactiveElements.length} interactive elements for navigation test`);

    if (interactiveElements.length > 0) {
      // Нажмем Tab несколько раз и проверим фокус
      for (let i = 0; i < Math.min(interactiveElements.length, 10); i++) {
        await page.keyboard.press('Tab');

        // Подождем фокуса
        await page.waitForTimeout(100);

        const focusedElement = page.locator(':focus');
        const isVisible = await focusedElement.isVisible();

        if (isVisible) {
          const elementInfo = await focusedElement.evaluate((el) => ({
            tag: el.tagName.toLowerCase(),
            id: el.id || null,
            classes: el.className || null,
            testId: el.getAttribute('data-testid'),
            text: el.textContent?.trim().substring(0, 30) || null
          }));

          console.log(`Tab ${i + 1}: Focused ${elementInfo.tag}${elementInfo.id ? `#${elementInfo.id}` : ''}${elementInfo.testId ? `[${elementInfo.testId}]` : ''} "${elementInfo.text}"`);
        }
      }
    }
  });

  test('should test interaction with each element type', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    // Тестируем разные типы интерактивных элементов
    const elementTests = [
      { selector: 'button', action: async (el: any) => await el.click() },
      { selector: '[role="button"]', action: async (el: any) => await el.click() },
    ];

    for (const { selector, action } of elementTests) {
      const elements = page.locator(selector);
      const count = await elements.count();

      if (count > 0) {
        console.log(`Testing ${count} elements matching "${selector}"`);

        for (let i = 0; i < Math.min(count, 3); i++) {
          const element = elements.nth(i);

          if (await element.isVisible() && await element.isEnabled()) {
            try {
              // Снимем состояние ДО взаимодействия
              const beforeState = await page.evaluate(() => ({
                bodyClasses: document.body.className,
                elementCount: document.querySelectorAll('*').length,
                interactiveCount: document.querySelectorAll('button, a, input, select, [role="button"]').length,
                scrollPosition: { x: window.scrollX, y: window.scrollY }
              }));

              // Получим информацию о элементе до клика
              const elementInfo = await element.evaluate((el) => ({
                tag: el.tagName.toLowerCase(),
                classes: el.className,
                text: el.textContent?.trim().substring(0, 50) || null,
                position: el.getBoundingClientRect()
              }));

              console.log(`  Before interaction - Element ${i + 1}: ${elementInfo.tag} "${elementInfo.text}" at (${Math.round(elementInfo.position.x)}, ${Math.round(elementInfo.position.y)})`);

              // Выполним взаимодействие
              await action(element);

              // Подождем реакции интерфейса
              await page.waitForTimeout(500);

              // Снимем состояние ПОСЛЕ взаимодействия
              const afterState = await page.evaluate(() => ({
                bodyClasses: document.body.className,
                elementCount: document.querySelectorAll('*').length,
                interactiveCount: document.querySelectorAll('button, a, input, select, [role="button"]').length,
                scrollPosition: { x: window.scrollX, y: window.scrollY }
              }));

              // Проанализируем изменения
              console.log(`  After interaction - Element ${i + 1}:`);
              console.log(`    DOM elements: ${beforeState.elementCount} → ${afterState.elementCount} (${afterState.elementCount - beforeState.elementCount})`);
              console.log(`    Interactive elements: ${beforeState.interactiveCount} → ${afterState.interactiveCount} (${afterState.interactiveCount - beforeState.interactiveCount})`);
              console.log(`    Body classes: "${beforeState.bodyClasses}" → "${afterState.bodyClasses}"`);
              console.log(`    Scroll position: (${beforeState.scrollPosition.x}, ${beforeState.scrollPosition.y}) → (${afterState.scrollPosition.x}, ${afterState.scrollPosition.y})`);

              // Проверим, появились ли новые элементы
              if (afterState.elementCount > beforeState.elementCount) {
                console.log(`    ✅ New elements appeared after interaction`);
              }

              if (afterState.interactiveCount > beforeState.interactiveCount) {
                console.log(`    ✅ New interactive elements appeared`);
              }

              // Проверим, изменились ли классы body (тема, модалы и т.д.)
              if (afterState.bodyClasses !== beforeState.bodyClasses) {
                console.log(`    ✅ Body classes changed - possible theme/modal state change`);
              }

              // Сохраним скриншот после взаимодействия
              await page.screenshot({ path: `test-results/interaction-after-${selector}-${i + 1}.png` });

              console.log(`  Successfully interacted with element ${i + 1}`);
            } catch (error) {
              console.log(`  Failed to interact with element ${i + 1}: ${error}`);
            }
          }
        }
      }
    }
  });
});

/**
 * Enhanced Responsive Breakpoint Tests
 * Test visual consistency across different screen sizes
 */
test.describe('Responsive Breakpoints', () => {
  const breakpoints = [
    { name: 'mobile-small', width: 320, height: 568 },
    { name: 'mobile', width: 375, height: 667 },
    { name: 'mobile-large', width: 414, height: 896 },
    { name: 'tablet-small', width: 768, height: 1024 },
    { name: 'tablet', width: 1024, height: 768 },
    { name: 'desktop-small', width: 1280, height: 720 },
    { name: 'desktop', width: 1920, height: 1080 },
  ];

  breakpoints.forEach(({ name, width, height }) => {
    test(`should match ${name} breakpoint (${width}x${height})`, async ({ page }) => {
      await page.setViewportSize({ width, height });
      await page.goto('/');
      await page.waitForLoadState('networkidle');
      
      // Wait for loading to complete
      await page.waitForSelector('text=Загрузка данных...', { 
        state: 'hidden', 
        timeout: 10000 
      }).catch(() => {});
      
      // Wait for fonts and settle
      await page.evaluate(() => document.fonts.ready);
      await page.waitForTimeout(1000);

      await expect(page).toHaveScreenshot(`breakpoint-${name}.png`, {
        fullPage: false, // Only viewport to avoid height instability
        animations: 'disabled',
        caret: 'hide',
        timeout: 10000,
      });
    });
  });

  test('should test responsive behavior across breakpoints', async ({ page }) => {
    console.log('=== RESPONSIVE BEHAVIOR ANALYSIS ===');

    for (const { name, width, height } of breakpoints) {
      await page.setViewportSize({ width, height });
      await page.goto('/');
      await page.waitForLoadState('networkidle');

      // Анализируем элементы при разных размерах
      const visibleElements = await page.locator('button, a, [role="button"], h1, h2, h3').count();
      const viewportInfo = await page.evaluate(() => ({
        width: window.innerWidth,
        height: window.innerHeight,
        scrollWidth: document.body.scrollWidth,
        scrollHeight: document.body.scrollHeight,
      }));

      console.log(`${name} (${width}x${height}): ${visibleElements} interactive elements, viewport ${viewportInfo.width}x${viewportInfo.height}`);

      // Проверим, что контент доступен
      await expect(page.locator('body')).toBeVisible();
    }
  });
});

/**
 * DOM Change Analysis After Interactions
 * Detailed analysis of DOM changes after user interactions
 */
test.describe('DOM Change Analysis', () => {
  test('should analyze DOM changes after interactions', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    console.log('=== DOM CHANGE ANALYSIS AFTER INTERACTIONS ===');

    // Найдем все кнопки и проанализируем изменения после клика по каждой
    const buttons = page.locator('button, [role="button"]');
    const buttonCount = await buttons.count();

    console.log(`Found ${buttonCount} buttons for change analysis`);

    for (let i = 0; i < Math.min(buttonCount, 5); i++) {
      const button = buttons.nth(i);

      if (await button.isVisible() && await button.isEnabled()) {
        // Получим детальную информацию о странице ДО клика
        const beforeSnapshot = await page.evaluate(() => {
          const getVisibleElements = () => {
            const elements: any[] = [];
            document.querySelectorAll('*').forEach((el, index) => {
              const rect = el.getBoundingClientRect();
              if (rect.width > 0 && rect.height > 0 && rect.top >= 0 && rect.left >= 0) {
                elements.push({
                  index,
                  tag: el.tagName.toLowerCase(),
                  id: el.id || null,
                  classes: el.className || null,
                  text: el.textContent?.trim().substring(0, 30) || null,
                  position: { x: Math.round(rect.x), y: Math.round(rect.y), w: Math.round(rect.width), h: Math.round(rect.height) }
                });
              }
            });
            return elements;
          };

          return {
            timestamp: Date.now(),
            url: window.location.href,
            title: document.title,
            bodyClasses: document.body.className,
            visibleElements: getVisibleElements(),
            elementCount: document.querySelectorAll('*').length,
            interactiveCount: document.querySelectorAll('button, a, input, select, [role="button"]').length
          };
        });

        const buttonInfo = await button.evaluate((el) => ({
          tag: el.tagName.toLowerCase(),
          classes: el.className,
          text: el.textContent?.trim().substring(0, 30) || null,
          position: el.getBoundingClientRect()
        }));

        console.log(`\n--- Testing Button ${i + 1}: ${buttonInfo.tag} "${buttonInfo.text}" ---`);
        console.log(`Before: ${beforeSnapshot.visibleElements.length} visible elements, ${beforeSnapshot.elementCount} total elements`);

        // Кликнем по кнопке (force: true для элементов которые могут быть перекрыты)
        await button.click({ force: true }).catch(() => {
          console.log(`  ⚠️  Failed to click button ${i + 1}, skipping...`);
        });

        // Подождем возможных изменений
        await page.waitForTimeout(1000);

        // Получим состояние ПОСЛЕ клика
        const afterSnapshot = await page.evaluate(() => {
          const getVisibleElements = () => {
            const elements: any[] = [];
            document.querySelectorAll('*').forEach((el, index) => {
              const rect = el.getBoundingClientRect();
              if (rect.width > 0 && rect.height > 0 && rect.top >= 0 && rect.left >= 0) {
                elements.push({
                  index,
                  tag: el.tagName.toLowerCase(),
                  id: el.id || null,
                  classes: el.className || null,
                  text: el.textContent?.trim().substring(0, 30) || null,
                  position: { x: Math.round(rect.x), y: Math.round(rect.y), w: Math.round(rect.width), h: Math.round(rect.height) }
                });
              }
            });
            return elements;
          };

          return {
            timestamp: Date.now(),
            url: window.location.href,
            title: document.title,
            bodyClasses: document.body.className,
            visibleElements: getVisibleElements(),
            elementCount: document.querySelectorAll('*').length,
            interactiveCount: document.querySelectorAll('button, a, input, select, [role="button"]').length
          };
        });

        console.log(`After:  ${afterSnapshot.visibleElements.length} visible elements, ${afterSnapshot.elementCount} total elements`);

        // Проанализируем изменения
        const elementDiff = afterSnapshot.elementCount - beforeSnapshot.elementCount;
        const visibleDiff = afterSnapshot.visibleElements.length - beforeSnapshot.visibleElements.length;
        const interactiveDiff = afterSnapshot.interactiveCount - beforeSnapshot.interactiveCount;

        console.log(`Changes: Elements ${elementDiff > 0 ? '+' : ''}${elementDiff}, Visible ${visibleDiff > 0 ? '+' : ''}${visibleDiff}, Interactive ${interactiveDiff > 0 ? '+' : ''}${interactiveDiff}`);

        if (elementDiff !== 0 || visibleDiff !== 0 || interactiveDiff !== 0) {
          console.log(`  ✅ Interface changed after clicking button "${buttonInfo.text}"`);
        }

        // Проверим, появились ли новые видимые элементы
        if (visibleDiff > 0) {
          console.log(`  📍 New visible elements appeared:`);
          const beforePositions = new Set(beforeSnapshot.visibleElements.map(el => `${el.position.x},${el.position.y}`));

          for (let index = 0; index < afterSnapshot.visibleElements.length; index++) {
            const el = afterSnapshot.visibleElements[index];
            const positionKey = `${el.position.x},${el.position.y}`;
            if (!beforePositions.has(positionKey)) {
              console.log(`    ${index + 1}. ${el.tag}${el.id ? `#${el.id}` : ''}${el.classes ? `.${el.classes}` : ''} at (${el.position.x}, ${el.position.y}) "${el.text}"`);

              // Сделаем скриншот нового элемента (только если он имеет размеры)
              if (el.position.w > 0 && el.position.h > 0) {
                await page.screenshot({
                  path: `test-results/new-element-${i + 1}-${index + 1}.png`,
                  clip: {
                    x: Math.max(0, el.position.x - 10),
                    y: Math.max(0, el.position.y - 10),
                    width: Math.min(el.position.w + 20, 1280),
                    height: Math.min(el.position.h + 20, 720)
                  }
                }).catch(() => {
                  console.log(`    ⚠️  Failed to screenshot element ${index + 1}`);
                });
              }
            }
          }
        }

        // Проверим, исчезли ли элементы
        if (visibleDiff < 0) {
          console.log(`  📍 Elements disappeared:`);
          const afterPositions = new Set(afterSnapshot.visibleElements.map(el => `${el.position.x},${el.position.y}`));

          beforeSnapshot.visibleElements.forEach((el, index) => {
            const positionKey = `${el.position.x},${el.position.y}`;
            if (!afterPositions.has(positionKey)) {
              console.log(`    ${index + 1}. ${el.tag}${el.id ? `#${el.id}` : ''}${el.classes ? `.${el.classes}` : ''} "${el.text}"`);
            }
          });
        }

        // Сделаем скриншот всего экрана после взаимодействия
        await page.screenshot({ path: `test-results/button-after-${i + 1}.png` });
      }
    }

    console.log('=== DOM CHANGE ANALYSIS COMPLETE ===');
  });

  test('should simulate complete user journey with visual analysis', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    
    // Wait for loading to complete
    await page.waitForSelector('text=Загрузка данных...', { 
      state: 'hidden', 
      timeout: 10000 
    }).catch(() => {});
    
    await page.waitForTimeout(1000);

    console.log('=== COMPLETE USER JOURNEY SIMULATION ===');

    // Шаг 1: Исследуем начальное состояние
    console.log('\n📋 STEP 1: Initial page analysis');
    const initialSnapshot = await page.evaluate(() => ({
      elementCount: document.querySelectorAll('*').length,
      visibleElements: document.querySelectorAll('*').length,
      interactiveElements: document.querySelectorAll('button, a, input, select, [role="button"]').length,
      bodyClasses: document.body.className,
      title: document.title
    }));

    console.log(`Initial state: ${initialSnapshot.elementCount} elements, ${initialSnapshot.interactiveElements} interactive`);
    await page.screenshot({ path: `test-results/journey-step-1-initial.png` });

    // Шаг 2: Tab навигация по интерфейсу
    console.log('\n⌨️ STEP 2: Tab navigation through interface');
    const interactiveElements = await page.locator('button, a, input, select, textarea, [role="button"], [tabindex]:not([tabindex="-1"])').all();

    for (let i = 0; i < Math.min(interactiveElements.length, 8); i++) {
      await page.keyboard.press('Tab');
      await page.waitForTimeout(200);

      const focusedElement = page.locator(':focus');
      const isVisible = await focusedElement.isVisible();

      if (isVisible) {
        const elementInfo = await focusedElement.evaluate((el) => ({
          tag: el.tagName.toLowerCase(),
          id: el.id || null,
          classes: el.className || null,
          testId: el.getAttribute('data-testid'),
          text: el.textContent?.trim().substring(0, 30) || null,
          position: el.getBoundingClientRect()
        }));

        console.log(`  Tab ${i + 1}: ${elementInfo.tag}${elementInfo.id ? `#${elementInfo.id}` : ''}${elementInfo.testId ? `[${elementInfo.testId}]` : ''} "${elementInfo.text}"`);

        // Сделаем скриншот фокусированного элемента
        const box = await focusedElement.boundingBox();
        if (box) {
          await page.screenshot({
            path: `test-results/journey-tab-${i + 1}.png`,
            clip: {
              x: Math.max(0, box.x - 5),
              y: Math.max(0, box.y - 5),
              width: box.width + 10,
              height: box.height + 10
            }
          });
        }
      }
    }

    // Шаг 3: Исследуем карточки заданий (если есть)
    console.log('\n🔍 STEP 3: Task cards exploration');
    const taskCards = await page.locator('.task-card, [data-testid="task-card"], [class*="card"]:visible').all();

    if (taskCards.length > 0) {
      for (let i = 0; i < Math.min(taskCards.length, 3); i++) {
        const card = taskCards[i];
        
        // Check if card is visible before scrolling
        if (await card.isVisible().catch(() => false)) {
          await card.scrollIntoViewIfNeeded().catch(() => {
            console.log(`    Card ${i + 1} not scrollable, skipping...`);
          });

          console.log(`  Exploring task card ${i + 1}`);
          await page.screenshot({ path: `test-results/journey-card-${i + 1}.png` });

          // Найдем кнопки внутри карточки
          const cardButtons = card.locator('button');
          const buttonCount = await cardButtons.count();

          if (buttonCount > 0) {
            console.log(`    Found ${buttonCount} buttons in card`);

            // Попробуем кликнуть по первой кнопке
            const firstButton = cardButtons.first();
            if (await firstButton.isVisible() && await firstButton.isEnabled()) {
              console.log(`    Clicking first button in card ${i + 1}`);

              await firstButton.click();
              await page.waitForTimeout(500);

              console.log(`    ✅ Card interaction completed`);
              await page.screenshot({ path: `test-results/journey-card-${i + 1}-after.png` });
            }
          }
        }
      }
    }

    // Шаг 4: Исследуем переключение темы
    console.log('\n🎨 STEP 4: Theme toggle exploration');
    const themeToggle = page.locator('[data-testid="theme-toggle"], .theme-toggle, button:has([data-lucide="sun"], [data-lucide="moon"])').first();

    if (await themeToggle.isVisible()) {
      console.log('  Found theme toggle button');

      await page.screenshot({ path: `test-results/journey-theme-before.png` });

      await themeToggle.click();
      await page.waitForTimeout(1000);

      console.log(`  ✅ Theme toggle completed`);
      await page.screenshot({ path: `test-results/journey-theme-after.png` });
    }

    // Шаг 5: Финальный анализ
    console.log('\n📊 STEP 5: Final journey analysis');
    const finalSnapshot = await page.evaluate(() => ({
      elementCount: document.querySelectorAll('*').length,
      visibleElements: document.querySelectorAll('*').length,
      interactiveElements: document.querySelectorAll('button, a, input, select, [role="button"]').length,
      bodyClasses: document.body.className,
      title: document.title
    }));

    console.log(`Final state: ${finalSnapshot.elementCount} elements, ${finalSnapshot.interactiveElements} interactive`);
    console.log(`Journey changes: Elements ${finalSnapshot.elementCount - initialSnapshot.elementCount}, Interactive ${finalSnapshot.interactiveElements - initialSnapshot.interactiveElements}`);

    await page.screenshot({ path: `test-results/journey-final.png` });

    console.log('=== USER JOURNEY SIMULATION COMPLETE ===');
  });

});
