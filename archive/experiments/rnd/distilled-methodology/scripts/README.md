# Validation Scripts

Automated validation scripts for Contract-Driven Development.

## Available Scripts

### Token Validation

#### validate-tokens.js

Validates design tokens against schema and checks for hardcoded values in components.

**Usage:**
```bash
node scripts/validate-tokens.js [path-to-tokens.json]
```

**Checks:**
- Token structure (metadata, required fields)
- Token types and values
- Units for dimension tokens
- Color format validation
- Hardcoded values in components (colors, spacing)

**Example:**
```bash
node scripts/validate-tokens.js ./design-tokens/tokens.json
```

---

### generate-css-from-tokens.js

Generates CSS custom properties from design tokens.

**Usage:**
```bash
node scripts/generate-css-from-tokens.js [input-tokens] [output-css]
```

**Features:**
- Converts all tokens to CSS variables (--token-name format)
- Generates :root and .dark theme sections
- Includes metadata header
- Handles all token types (color, spacing, typography, etc.)

**Example:**
```bash
node scripts/generate-css-from-tokens.js \
  ./design-tokens/tokens.json \
  ./build/css/variables.css
```

**Output:**
```css
/**
 * Design Tokens - CSS Custom Properties
 * Version: 1.0.0
 * Generated: 2025-10-08T12:00:00Z
 */

:root {
  --color-primary: #00484F;
  --spacing-md: 16px;
  /* ... */
}

.dark {
  --color-background: #0A0A0A;
  /* ... */
}
```

---

### check-contract-compliance.js

Checks if component implementation matches its contract.

**Usage:**
```bash
node scripts/check-contract-compliance.js [contract.yml] [component.tsx]
```

**Checks:**
- Required props implemented
- Variants implemented
- Invariants documented
- No hardcoded values
- No undeclared props

**Example:**
```bash
node scripts/check-contract-compliance.js \
  ./contracts/CONTRACT-BUTTON-001.yml \
  ./components/Button/Button.tsx
```

---

## Dependencies

Some scripts require additional packages:

```bash
npm install js-yaml
```

---

## CI/CD Integration

### GitHub Actions Example

```yaml
name: Validate Contracts

on: [push, pull_request]

jobs:
  validate:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
      
      - name: Install dependencies
        run: npm install js-yaml
      
      - name: Validate tokens
        run: node scripts/validate-tokens.js
      
      - name: Generate CSS
        run: node scripts/generate-css-from-tokens.js
      
      - name: Check compliance
        run: |
          for contract in contracts/CONTRACT-*.yml; do
            component=$(echo $contract | sed 's/contracts/components/' | sed 's/CONTRACT-//' | sed 's/.yml/.tsx/')
            if [ -f "$component" ]; then
              node scripts/check-contract-compliance.js "$contract" "$component"
            fi
          done
```

---

## Usage in package.json

Add scripts to your `package.json`:

```json
{
  "scripts": {
    "validate:tokens": "node scripts/validate-tokens.js",
    "generate:css": "node scripts/generate-css-from-tokens.js",
    "check:compliance": "node scripts/check-contract-compliance.js",
    "validate:all": "npm run validate:tokens && npm run generate:css"
  }
}
```

---

## Exit Codes

All scripts follow standard exit code conventions:

- **0**: Success (all checks passed)
- **1**: Failure (errors found)

Scripts with warnings but no errors will exit with code 0.

---

## Customization

Scripts can be customized by modifying:

1. **Token categories**: Edit required categories in `validate-tokens.js`
2. **CSS prefix**: Change `--` prefix in `generate-css-from-tokens.js`
3. **Compliance rules**: Add custom checks in `check-contract-compliance.js`

---

## Troubleshooting

### "Module not found: js-yaml"
Install required dependency: `npm install js-yaml`

### "Tokens file not found"
Check the path to tokens.json or specify it explicitly as argument

### "Contract validation failed"
Review error output and fix issues in contract or component

---

## Contributing

When adding new validation scripts:

1. Follow existing patterns (colors, exit codes)
2. Include usage documentation
3. Add example to this README
4. Test with CI/CD integration
