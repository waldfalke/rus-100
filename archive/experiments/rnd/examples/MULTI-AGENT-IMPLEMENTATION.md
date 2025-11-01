# Multi-Agent Implementation Example

## Простая реализация на Node.js

```javascript
// scripts/ai/orchestrator.js
class Orchestrator {
  async generateComponent(contract) {
    // Phase 1: Parallel generation
    const [component, styles, stories] = await Promise.all([
      this.componentAgent.generate(contract),
      this.styleAgent.checkTokens(contract),
      this.storiesAgent.generate(contract)
    ]);
    
    // Phase 2: Validation
    const validation = await this.validationAgent.check({
      component,
      contract,
      styles
    });
    
    return { component, validation };
  }
}
```

## Промпты для агентов

### Contract Agent
```
Generate YAML contract for {{name}}.
Props: {{props}}
Output: Valid YAML following schema.
```

### Component Agent
```
Generate React component from contract.
Input: {{contract}}
Output: TSX + Types + Stories
Rules: Use tokens, no hardcoded values.
```

### Validation Agent
```
Check component against contract.
Verify: props, variants, tokens, accessibility.
```

## Параллельное выполнение = 4x ускорение

Sequential: 20 минут
Parallel: 5 минут

Готово!
