# 🔧 E2E Test Fixes - Action Plan

**Дата:** 10 января 2025, 10:36  
**Текущий статус:** 32/41 passed (78%)

---

## 🎯 **Цель:** 41/41 passed (100%)

---

## ❌ **9 падающих тестов - разбор по приоритетам**

### Priority 1: КРИТИЧНЫЕ (блокируют основные тесты)

#### ❌ Fix #1: button.first() is hidden

**Файлы:**
- `tests/e2e/basic-functionality.spec.ts:131`
- `tests/e2e/component-integration.spec.ts:31`

**Проблема:**
```typescript
const anyButtons = page.locator('button');
await expect(anyButtons.first()).toBeVisible(); // ❌ Fails - first button is hidden
```

**Причина:**
Первая кнопка на странице - это **dropdown trigger** в navbar, который `hidden` до hover.

**Решение:**
```typescript
// ❌ Плохо - берет первую кнопку (может быть hidden)
const anyButtons = page.locator('button');
await expect(anyButtons.first()).toBeVisible();

// ✅ Хорошо - берет только visible кнопки
const visibleButtons = page.locator('button:visible');
await expect(visibleButtons.first()).toBeVisible();

// ✅ Или проверяем что ЕСТЬ хотя бы одна visible кнопка
const buttons = page.locator('button');
const visibleCount = await buttons.filter({ hasText: /.+/ }).count();
expect(visibleCount).toBeGreaterThan(0);
```

**ETA:** 5 минут

---

#### ❌ Fix #2: Layout height instability

**Файл:**
- `tests/e2e/component-integration.spec.ts:228`

**Проблема:**
```
Expected scrollHeight change: < 100px
Received: 737px
```

**Причина:**
Страница показывает "Загрузка данных..." → потом рендерит реальный контент.
Высота меняется с 720px (loading) на 1457px (full content).

**Решение:**
```typescript
// ❌ Плохо - не ждем загрузки контента
await page.goto('/');
const initialMetrics = await page.evaluate(...)

// ✅ Хорошо - ждем пока "Загрузка" исчезнет
await page.goto('/');
await page.waitForLoadState('networkidle');
await page.waitForSelector('text=Загрузка данных...', { state: 'hidden', timeout: 10000 });
// Теперь измеряем
const initialMetrics = await page.evaluate(...)
```

**ETA:** 10 минут

---

### Priority 2: СРЕДНИЕ (визуальные тесты)

#### ❌ Fix #3-7: Visual regression snapshots

**Файлы:**
- `visual-regression.spec.ts` (5 тестов)

**Проблема:**
1. **Missing baseline** (2 теста):
   - `theme-light.png` - baseline отсутствует
   - `theme-dark.png` - baseline отсутствует

2. **Unstable screenshots** (3 теста):
   - Высота прыгает: 720px ↔ 1457px ↔ 1579px
   - Не может получить 2 стабильных скриншота подряд

**Причина:**
- Асинхронная загрузка контента
- Анимации не полностью отключены
- Fonts loading

**Решение A: Генерация baseline (первый раз)**
```bash
# Создать baseline screenshots
npm run test:visual -- --update-snapshots
```

**Решение B: Стабилизировать тесты**
```typescript
test('should match visual baseline', async ({ page }) => {
  await page.goto('/');
  await page.waitForLoadState('networkidle');
  
  // ✅ CRITICAL: Ждем пока loading исчезнет
  await page.waitForSelector('text=Загрузка данных...', { 
    state: 'hidden', 
    timeout: 10000 
  });
  
  // ✅ Ждем fonts
  await page.evaluate(() => document.fonts.ready);
  
  // ✅ Даем время на settle
  await page.waitForTimeout(1000);
  
  // ✅ Freeze animations
  await page.addStyleTag({
    content: '*, *::before, *::after { animation: none !important; transition: none !important; }'
  });
  
  await expect(page).toHaveScreenshot('baseline.png', {
    fullPage: true,
    animations: 'disabled',
    caret: 'hide',
    timeout: 10000, // ✅ Увеличить timeout
  });
});
```

**ETA:** 20 минут

---

#### ❌ Fix #8-9: Responsive breakpoint snapshots

**Файлы:**
- `desktop-small (1280x720)` - нестабильная высота
- `desktop (1920x1080)` - нестабильная высота

**Проблема:**
```
Expected: 1280x720
Received: 1280x1457 (then) 1280x720 (then) 1280x1457
```

**Причина:**
То же самое - асинхронная загрузка + fullPage: true берет весь scrollHeight.

**Решение:**
```typescript
test('should match breakpoint', async ({ page }) => {
  await page.setViewportSize({ width: 1280, height: 720 });
  await page.goto('/');
  await page.waitForLoadState('networkidle');
  
  // ✅ Ждем loading state
  await page.waitForSelector('text=Загрузка данных...', { 
    state: 'hidden', 
    timeout: 10000 
  });
  
  await page.waitForTimeout(1000);
  
  await expect(page).toHaveScreenshot('breakpoint.png', {
    fullPage: false, // ✅ НЕ fullPage - только viewport!
    animations: 'disabled',
    timeout: 10000,
  });
});
```

**ETA:** 15 минут

---

### Priority 3: НИЗКИЕ (timeout)

#### ❌ Fix #10: User journey timeout

**Файл:**
- `visual-regression.spec.ts:552`

**Проблема:**
```typescript
await card.scrollIntoViewIfNeeded(); // Timeout 30s - element not visible
```

**Причина:**
Task cards не появляются потому что:
1. Loading state блокирует
2. Карточки рендерятся условно

**Решение:**
```typescript
// ❌ Плохо
const taskCards = page.locator('.task-card');
for (const card of await taskCards.all()) {
  await card.scrollIntoViewIfNeeded(); // Fails if hidden
}

// ✅ Хорошо
await page.waitForSelector('text=Загрузка данных...', { state: 'hidden' });
const taskCards = page.locator('.task-card:visible');
const count = await taskCards.count();

if (count > 0) {
  for (let i = 0; i < Math.min(count, 3); i++) {
    const card = taskCards.nth(i);
    if (await card.isVisible()) {
      await card.scrollIntoViewIfNeeded();
      // ... rest
    }
  }
}
```

**ETA:** 10 минут

---

## 📋 **Execution Plan**

### Step 1: Fix Critical Visibility (5 мин)
```bash
# Edit basic-functionality.spec.ts
# Edit component-integration.spec.ts
# Change: button.first() → button:visible
```

### Step 2: Fix Layout Stability (10 мин)
```bash
# Edit component-integration.spec.ts
# Add: waitForSelector loading hidden
```

### Step 3: Generate Visual Baselines (5 мин)
```bash
npm run test:visual -- --update-snapshots
```

### Step 4: Fix Visual Test Stability (20 мин)
```bash
# Edit visual-regression.spec.ts
# Add: wait for loading, fonts, settle time
# Change: fullPage: false for breakpoints
```

### Step 5: Fix Journey Timeout (10 мин)
```bash
# Edit visual-regression.spec.ts line 552
# Add: visibility check before scroll
```

---

## ⏱️ **Total ETA: ~60 минут**

---

## ✅ **Expected Result:**

```bash
npm run test:e2e

Running 41 tests using 6 workers

  ✓  41 passed (2.5m)

100% SUCCESS! 🎉
```

---

## 🎯 **Immediate Next Steps:**

1. **Сейчас:** Fix visibility issues (Priority 1)
2. **Потом:** Stabilize visual tests  
3. **Затем:** Generate baselines
4. **Финал:** Verify all green

---

## 📝 **Notes:**

### Key Insights:
- ⚠️ **`data-testid: 0`** - критично добавить в Phase 2
- ⚠️ "Загрузка данных..." блокирует много тестов
- ⚠️ Async rendering = нестабильные тесты

### Future Improvements (Phase 2):
1. Добавить data-testid в компоненты
2. Mock loading state в тестах
3. Использовать test-ids вместо CSS селекторов
4. Создать helper: `waitForPageReady()`

---

**Status:** ✅ Ready to start fixing  
**Next:** Fix #1 - Button visibility
