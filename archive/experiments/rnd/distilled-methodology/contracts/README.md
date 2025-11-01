# Contract Templates

Universal contract templates for Contract-Driven Development methodology.

---

## Contents

- **METACONTRACT.yml** - Meta-contract defining how to write contracts
- **CONTRACT-TOKENS-EXAMPLE.yml** - Design tokens contract template

These contracts are distilled from real production projects and made universal.

---

## How to Use

### 1. For New Component

Copy and adapt the component contract template:

```bash
cp contracts/METACONTRACT.yml contracts/CONTRACT-BUTTON-001.yml
```

Edit to match your component:
- Change id, title
- Define props (required/optional)
- List variants and states
- Define acceptance criteria

### 2. For Design Tokens

Use the tokens contract as reference:

```bash
# Use CONTRACT-TOKENS-EXAMPLE.yml as template
```

Key sections to fill:
- Token categories needed
- Generation/build process
- Validation rules
- Anti-patterns specific to your project

---

## Contract Structure

Every contract includes:

### Required Fields
- `id`: Unique identifier (CONTRACT-NAME-001)
- `title`: Human-readable name
- `type`: component | system | page | utility
- `version`: Semantic version
- `meta_contract`: Reference to METACONTRACT.yml
- `description`: What this defines
- `acceptance_criteria`: How to verify

### Complexity Levels

**Simple** (deterministic, well-known solution):
- Button, Input, Card
- High precision - specify exact implementation
- Fields: props, variants, states

**Complicated** (expert analysis needed):
- Form validation, Data table
- Medium precision - interface specified, implementation flexible
- Fields: props, invariants, dependencies

**Complex** (emergent solution):
- Camera API, AI generation, Performance optimization
- Low precision - goals and boundaries only
- Fields: invariants, constraints, evidence_requirements

---

## Real Examples

### Simple: Button Component

```yaml
id: CONTRACT-BUTTON-001
type: component
complexity_level: simple

props:
  required:
    - name: children
      type: React.ReactNode
    - name: onClick
      type: () => void
  optional:
    - name: variant
      type: "'primary' | 'secondary' | 'outline'"
      default: primary

variants:
  - name: primary
  - name: secondary
  - name: outline

states:
  - default
  - hover
  - focus
  - disabled

acceptance_criteria:
  - name: "All variants render"
    validation: visual
  - name: "TypeScript types correct"
    validation: automated
```

### Complicated: Design Tokens

```yaml
id: CONTRACT-TOKENS-001
type: system
complexity_level: complicated

invariants:
  - "tokens.json is single source of truth"
  - "All tokens must have type and value"
  - "Generated outputs deterministic"

anti_patterns:
  - pattern: "Hardcoded colors (#3B82F6)"
    fix: "Use token reference"
    severity: CRITICAL

acceptance_criteria:
  - name: "Schema validation"
    check: "node scripts/validate-tokens.js"
    validation: automated
```

---

## Anti-Patterns to Avoid

### In All Contracts

❌ Vague criteria: "looks good", "works well"  
✅ Specific: "WCAG AA contrast", "passes lint"

❌ Missing complexity level  
✅ Always specify: simple | complicated | complex

❌ No acceptance criteria  
✅ Minimum 3 testable criteria

### By Complexity

**Simple contracts:**
❌ Vague specifications  
✅ Exact props, variants, states

**Complicated contracts:**
❌ Over-specifying implementation  
✅ Specify interface, allow flexibility

**Complex contracts:**
❌ Precise implementation details  
✅ Goals, boundaries, invariants only

---

## Validation

Validate your contract structure:

```bash
# Check YAML syntax
node scripts/validate-contract-schema.js contracts/CONTRACT-NAME-001.yml

# Check component compliance
node scripts/check-contract-compliance.js \
  contracts/CONTRACT-BUTTON-001.yml \
  components/Button/Button.tsx
```

---

## Versioning

Contracts follow semantic versioning:

- **Major** (2.0): Breaking changes (renamed props, removed variants)
- **Minor** (1.1): Additions (new optional props, new variants)
- **Patch** (1.0.1): Clarifications (updated descriptions, fixed typos)

Example:
```yaml
version: 1.2.0  # Added 2 optional props since 1.0.0
```

---

## Integration with Development

### Pre-Implementation
1. Write contract first
2. Validate against schema
3. Review with team
4. Get approval

### During Implementation
1. Reference contract continuously
2. Check compliance frequently
3. Update contract if reality differs (especially Complex domain)

### Post-Implementation
1. Validate implementation against contract
2. Run acceptance criteria
3. Archive contract version

---

## Best Practices

1. **Contract-First Development**
   - Always write contract before code
   - Contract is source of truth

2. **Match Precision to Complexity**
   - Simple → High precision
   - Complex → Low precision (goals only)

3. **Include Examples**
   - Show usage patterns
   - Demonstrate edge cases

4. **Document Anti-Patterns**
   - What NOT to do
   - Why it's wrong
   - How to fix

5. **Keep Contracts Focused**
   - One deliverable per contract
   - Clear boundaries
   - No overlap

6. **Update When Reality Changes**
   - Especially in Complex domain
   - Version when breaking
   - Document reasons

---

## From Fit Lead Project

These templates are distilled from real production contracts:

- **METACONTRACT-CONTRACTS.yml** → 500+ lines of battle-tested rules
- **CONTRACT-TOKENS-001.yml** → Real token system with 700+ tokens
- **CONTRACT-TAILWIND-001.yml** → Production Tailwind generation
- **CONTRACT-STORYBOOK-001.yml** → Full Storybook setup with visual testing

All project-specific details removed, universal patterns extracted.

---

## Support

- See `../README.md` for full methodology overview
- See `../rules/` for principles and guidelines
- See `../cookbook/` for concrete examples with code
- See `../scripts/` for validation tools

---

**Remember:** Contracts are living documents. They evolve as understanding deepens, especially in Complex domain.
