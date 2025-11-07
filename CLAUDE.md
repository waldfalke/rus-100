# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**UX/UI Frontend Prototype** for a Russian language exam prep platform (schools, teachers, students). This is a **design prototype** built on shadcn/ui components to validate UX flows and visual design before backend implementation.

### Prototype Focus
- **Teacher Dashboard & Group Management** - Primary focus area
- **Component Library** - Reusable shadcn-based components
- **Design System Validation** - Testing design tokens and patterns
- **User Flow Prototypes** - Interactive mockups with realistic data

### Core User Flows (Prototyped)
- **Teachers**: Dashboard → Groups → Group Statistics → Test Assignment
- **Students**: Future scope

### Tech Stack
- Next.js 15 (App Router, static export for demo deployment)
- TypeScript
- **shadcn/ui** - Component foundation
- Tailwind CSS
- Design token system (for theming/consistency)

### Note on README.md
The `README.md` file is in Russian and presents the project as a "Functional Design Tokens" library. This reflects an experimental/exploratory aspect of the project. For development purposes, treat this codebase as a **UX/UI prototype** first, with the design token system as supporting infrastructure.

## Repository
- **GitHub**: https://github.com/waldfalke/rus-100
- **Main Branch**: `main`
- **Active Development Branch**: `enhanced-ui`
- **GitHub Pages**: Published from `enhanced-ui` branch with basePath `/rus-100`

## Common Commands

### Development
```bash
npm run dev                    # Start dev server (port 3000)
npm run build                  # Build for production
npm run lint                   # Run linting
```

### Testing
```bash
npm run test:e2e               # Run E2E tests (port 3001)
npm run test:e2e:ui            # Run with Playwright UI
npm run test:e2e:headed        # Run E2E with visible browser
npm run test:e2e:debug         # Run E2E in debug mode
npm run test:e2e:report        # View E2E test report
npm run test:bdd               # Run BDD feature tests
npm run test:bdd:ui            # Run BDD with Playwright UI
npm run test:visual            # Visual regression tests
npm run test:visual:update     # Update visual regression baselines
npm run test                   # Run unit tests (Vitest)
npm run test:watch             # Run unit tests in watch mode
npm run test:all               # Run all tests (E2E + BDD + Visual)
```

### Design Tokens (Infrastructure)
```bash
npm run build:tokens           # Build design tokens from JSON to CSS
npm run build:tokens:watch     # Auto-rebuild tokens on changes
npm run validate:tokens        # Validate token definitions
npm run benchmark:tokens       # Performance benchmarking for tokens
```

### Code Verification Scripts
```bash
npm run verify:hardcoded       # Check for hardcoded values that should use tokens
npm run verify:tokens-in-code  # Verify code uses valid token references
npm run verify:css-injection   # Check for CSS injection vulnerabilities
npm run verify:shadcn          # Verify shadcn components use tokens correctly
```

### Project Management & Validation
```bash
npm run validate:backlog       # Validate master-backlog.md structure
npm run validate:traceability  # Validate traceability-matrix.csv
npm run find:orphaned          # Find orphaned tasks
```

### Build Variants
```bash
npm run build                  # Standard production build
npm run build:gh-pages         # Build for GitHub Pages (Unix/Mac)
npm run build:gh-pages:win     # Build for GitHub Pages (Windows)
npm run start:static           # Serve static build
npm run start:static:local     # Serve static build on port 3000
```

### Other Utilities
```bash
npm run audit:a11y             # Accessibility audit (requires server on 3001)
npm run prepare:tests          # Update tests from components and sync tokens
```

## Application Structure

### Current Active Pages

**Teacher Dashboard & Groups**:
- [app/page.tsx](app/page.tsx) - Home/landing page
- [app/dashboard/page.tsx](app/dashboard/page.tsx) - Teacher dashboard with groups overview
- [app/dashboard/[id]/page.tsx](app/dashboard/[id]/page.tsx) - Group details view (with tabs: Students, Statistics)
- [app/dashboard/[id]/statistics/page.tsx](app/dashboard/[id]/statistics/page.tsx) - Group statistics using ResponsiveStatsTable

**Test Management**:
- [app/tests/page.tsx](app/tests/page.tsx) - Test management and listing
- [app/create-test/page.tsx](app/create-test/page.tsx) - Test creation workflow
- [app/answers/page.tsx](app/answers/page.tsx) - Answer grading and review

**Account**:
- [app/account/page.tsx](app/account/page.tsx) - Teacher account settings

**Legacy/Reference**:
- `app/tests-old/page.tsx` - Legacy test page (kept for reference)

### Deprecated/Removed Routes

The following routes have been removed from the application (as of recent commits):
- `/tasks` - Removed from app router
- `/results` - Removed from app router
- `/group-tables-demo` - Deprecated demo page

**Navigation updated**: Home page and create-test navigation now avoid these broken links.

## Teacher-Focused Features

### 1. Dashboard (`app/dashboard/page.tsx`)

**What it does**: Teacher's home page showing groups overview

**Key Components**:
- `DashboardStats` - Summary cards (total groups, active groups, students, tests, activity)
- `GroupsFilterBar` - Search, status filter, sort options, show/hide archived
- `GroupsGrid` - Card grid displaying all groups
- `GroupCard` - Individual group cards with actions (view, edit, duplicate, export, archive)

**Data Structure**:
```typescript
interface GroupCardData {
  id: string;
  name: string;
  description?: string;
  studentCount: number;
  folderCount: number;          // Test folders
  displayedFolderCount: number;
  status: 'active' | 'archived' | 'draft';
  createdAt: string;
  lastActivity?: string;
  isOwner: boolean;
  quickActions: QuickAction[];
}
```

**Current State**: Mock data only. Actions log to console.

### 2. Group Details (`app/dashboard/[id]/page.tsx`)

**What it does**: Individual group view with tabs for Students and Statistics

**Structure**:
- Server component wrapper for static generation
- `GroupPageClient` - Client component with tabs UI
- `GroupStatsClient` - Statistics tab with ResponsiveStatsTable
- Static params generated for IDs: 1-6, 'demo'

### 3. Group Statistics (`app/dashboard/[id]/statistics/page.tsx`)

**What it does**: Dedicated statistics view for a group

**Key Features**:
- Full-width statistics table
- Task performance breakdown
- Student performance tracking

### 4. Related Pages (Teacher Workflow)

- `app/tests/` - Test creation and management
- `app/answers/` - Grading and review
- `app/account/` - Teacher profile

## Architecture Notes

### Page Structure Pattern

Most teacher pages follow this structure:
```tsx
'use client';

export default function Page() {
  const [isLoading, setIsLoading] = useState(true);
  const [data, setData] = useState<Type[]>([]);
  const [filters, setFilters] = useState<Filters>({...});

  // Load data (currently mock)
  useEffect(() => {
    loadData();
  }, []);

  // Filter/sort logic
  const filteredData = data.filter(...).sort(...);

  return (
    <div className="min-h-screen bg-background">
      <TopNavBlock /> {/* or HeaderOrganism */}
      <main>
        {/* Stats */}
        {/* Filters */}
        {/* Data Grid/List */}
      </main>
    </div>
  );
}
```

### Component Naming Conventions

- **`*Block.tsx`**: Composite components (e.g., `TopNavBlock`, `TaskCardBlock`)
- **`*Organism.tsx`**: Complex organisms from atomic design (e.g., `HeaderOrganism`)
- **Standard names**: Base shadcn/ui components (`button.tsx`, `card.tsx`)

### Key Reusable Components

**Navigation**:
- `TopNavBlock` (`components/ui/TopNavBlock.tsx`) - Simple top nav
- `HeaderOrganism` (`components/ui/HeaderOrganism.tsx`) - Nav with breadcrumbs

**Layout**:
- `ResponsiveContainer` - Max-width container with padding
- `TokenGrid` - Grid layout using design tokens

**Data Display**:
- `GroupCard` - Group display card with actions
- `responsive-stats-table` - Statistics table using Atomic Design (see below)
- `statistics-card` - Individual stat cards

### ResponsiveStatsTable - Atomic Architecture

Located in `components/stats-table/`, this component follows **Atomic Design** principles:

**Structure**:
```
components/stats-table/
├── atoms/                      # Basic building blocks
│   ├── SortIcon.tsx            # Sort indicator (3 states)
│   ├── StudentInfo.tsx         # Student name + email block
│   ├── TableCell.tsx           # Cell with tooltip
│   └── TableHeader.tsx         # Sortable header
├── molecules/                  # Composite components
│   ├── GroupHeader.tsx         # Group header with collapse
│   ├── StudentRow.tsx          # Student data row
│   └── TotalsRow.tsx           # Averages row
├── organisms/                  # Complex components
│   ├── DesktopStatsTable.tsx   # Desktop table (>768px)
│   └── MobileStatsTable.tsx    # Mobile version (≤768px)
├── hooks/                      # Business logic
│   ├── useTableSort.ts         # Sorting logic
│   ├── useGroupCollapse.ts     # Collapse state
│   ├── useScrollSync.ts        # Scroll synchronization
│   └── useColumnWidths.ts      # Column width sync
├── utils/                      # Pure functions
│   └── formatters.ts           # Value formatting
├── ResponsiveStatsTableOrganism.tsx  # Main coordinator
├── types.ts                    # All TypeScript types
└── responsive-stats-table.css  # Styles with tokens
```

**Usage**:
```tsx
import { ResponsiveStatsTable } from '@/components/stats-table'

<ResponsiveStatsTable
  students={studentData}
  columnGroups={groups}  // or columns={flatColumns}
  data={statsData}
  stickyStudent={true}
/>
```

**Key Features**:
- Desktop: Sticky headers + student column, fullscreen mode
- Mobile: A'/A'' pattern (fixed name row + scrolling data)
- Column groups with collapse/expand
- Detailed tooltips on hover (task details)
- Design token integration (no hardcoded values)

See `components/stats-table/README.md` for full API documentation.

### Typography System

Configured in `app/layout.tsx`:
- **Headings**: Source Serif Pro (serif, optimized for Cyrillic)
- **Body**: Inter (sans-serif)
- **Font Loading**: Next.js font optimization

Custom Tailwind classes (in `tailwind.config.ts`):
```css
font-source-serif-pro  /* For headings */
font-inter             /* For body text */
text-app-h1           /* 28px - large headings */
text-app-h2           /* 24px - medium headings */
text-app-body         /* 16px - body text */
text-app-small        /* 14px - small text */
leading-cyr-text      /* 1.6 - Cyrillic line height */
```

### Path Aliases

Configured in `tsconfig.json`:
```typescript
"@/*"           // Root
"@/lib/*"       // Library code (design tokens, utilities)
"@/components/*" // Components
"@/app/*"       // App pages
"@/hooks/*"     // Custom React hooks
"@/types/*"     // TypeScript type definitions
"@/pages/*"     // Pages directory
```

## Design Token System (Infrastructure)

The project has a design token system, but **treat it as CSS infrastructure**. For most work, just use Tailwind classes or CSS variables.

### When You Need Tokens

**Use Tailwind classes** (preferred):
```tsx
<div className="p-4 text-foreground bg-card rounded-lg" />
```

**Use CSS variables** (when Tailwind doesn't cover it):
```tsx
<div style={{ padding: 'var(--spacing-md)' }} />
```

**Use token contracts** (advanced - for context-aware values):
```tsx
import { useToken } from '@/lib/hooks/useTheme';
const spacing = useToken<string>('spacing.md');
```

### Token Build Process

When tokens are modified:
1. Edit JSON in `design-system/tokens/`
2. Run `npm run build:tokens`
3. CSS variables generated in `styles/tokens.{theme}.css`
4. Tailwind config references these variables

### Design Token Files Location

- `design-system/tokens/base/` - Primitive values
- `design-system/tokens/themes/` - Light/dark themes
- `design-system/tokens/components/` - Component-specific
- `design-system/build.js` - Build script (transforms JSON → CSS)
- `design-system/style-dictionary.config.js` - Style Dictionary configuration
- `styles/tokens.light.css` - Generated CSS (light theme)
- `styles/tokens.dark.css` - Generated CSS (dark theme)

**Note**: Don't edit generated CSS files directly. Edit JSON sources.

### lib/ Directory - Advanced Token System

The `lib/` directory contains an advanced functional design token system with OKLCH color space support:

```
lib/
├── color/                  # OKLCH color system
│   ├── oklch.ts           # OKLCH color class
│   └── palette-generator.ts
├── context/               # Context-aware token resolution
│   ├── ContextResolver.ts # Platform/accessibility detection
│   └── PlatformDetector.ts
├── components/            # React components for tokens
│   ├── ThemeExample.tsx
│   └── ContextDemo.tsx
├── accessibility/         # WCAG validation
│   └── wcag-validator.ts
└── testing/              # Token testing utilities
```

**When to use lib/ tokens**:
- Advanced features requiring context-aware resolution (platform detection, accessibility)
- OKLCH color manipulation
- Programmatic token access in React components

**For most prototype work**: Use Tailwind classes or CSS variables instead.

## Contract-Based Development

This project uses **contracts** to define requirements before implementation.

### Current Contracts

Located in `contracts/`:
- `CONTRACT-DESIGN-SYSTEM-CONSISTENCY.yml` - Design system unification requirements
- `CONTRACT-FACADE.yml`, `CONTRACT-ADAPTER.yml`, `CONTRACT-BRIDGE.yml` - Architecture pattern contracts
- `CONTRACT-COMPOUND-COMPONENTS.yml` - Component composition patterns
- `CONTRACT-MEDIATOR.yml`, `CONTRACT-OBSERVER.yml`, `CONTRACT-STRATEGY.yml` - Behavioral pattern contracts
- Additional architecture pattern contracts for component design

### Key Contract: Design System Consistency

**CONTRACT-DESIGN-SYSTEM-CONSISTENCY.yml** defines:
- Typography standardization using H1/H2/H3 components
- Transition from hardcoded colors to design tokens
- Props synchronization between duplicate components
- Panel padding and height consistency

**Key Invariants**:
- Use design tokens (`bg-background`, `text-muted-foreground`) instead of raw colors
- Render headings through typography components (H1, H2, H3)
- No hardcoded pixel values where design tokens exist
- Consistent spacing using Tailwind utility classes

## Deployment Configuration

### GitHub Pages Static Export

The project supports static site generation for GitHub Pages deployment:

**Configuration** (`next.config.mjs`):
- Environment variable `GITHUB_PAGES=true` activates GitHub Pages mode
- `output: 'export'` - Enables static HTML export
- `basePath: '/rus-100'` - GitHub Pages repository path
- `assetPrefix: '/rus-100/'` - Asset URL prefix
- `images.unoptimized: true` - No server-side image optimization

**Build Commands**:
```bash
# Unix/Mac/Linux
npm run build:gh-pages

# Windows
npm run build:gh-pages:win
```

**Important Notes**:
- TypeScript errors are ignored during build (`ignoreBuildErrors: true`)
- ESLint errors are ignored during build (`ignoreDuringBuilds: true`)
- React Strict Mode is disabled for prototype development
- Webpack hash function set to `xxhash64` (resolves WasmHash errors)

### Vercel Deployment

For standard Vercel deployment, use `npm run build` (no static export).

## Prototype Development Approach

### This is a Prototype - Not Production Code

**Key principles**:
- Focus on UX/UI, not backend logic
- Use realistic mock data to demonstrate flows
- Prioritize visual polish and interaction design
- Components should be production-ready, but data layer is temporary
- Static export for easy demo deployment (GitHub Pages)

### Working with Mock Data

**All pages use mock data** to simulate realistic user experiences.

**Mock Data Pattern** (with loading states for realism):
```typescript
// In page component
const [data, setData] = useState<Type[]>([]);

useEffect(() => {
  const loadData = async () => {
    setIsLoading(true);
    try {
      // Simulate API delay for realistic UX
      await new Promise(resolve => setTimeout(resolve, 1000));

      setData([
        { id: '1', name: 'Example', ... },
        { id: '2', name: 'Example 2', ... },
      ]);
    } catch (err) {
      setError('Load error');
    } finally {
      setIsLoading(false);
    }
  };

  loadData();
}, []);
```

**Mock Data Guidelines**:
- Use realistic Russian names, dates, and content
- Include variety in data (different statuses, counts, dates)
- Show empty states, loading states, and error states
- Make data look authentic (not "Test 1", "Test 2")

**Mock Data Locations**:
- `app/dashboard/page.tsx` - Mock groups (10А класс, 11Б класс, etc.)
- `app/dashboard/[id]/GroupPageClient.tsx` - Mock student data
- Other pages follow same pattern

## Common Prototyping Tasks

### Prototyping a New Screen/Flow

1. **Start with shadcn components** - Browse https://ui.shadcn.com for building blocks
2. **Create page**: `app/{feature}/page.tsx` (copy structure from similar page)
3. **Add realistic mock data** - Use Russian names/content
4. **Build UI iteratively**:
   - Layout first (TopNavBlock/HeaderOrganism + containers)
   - Add components (Cards, Tables, Forms)
   - Polish interactions (hovers, loading states)
   - Add empty states and error states
5. **Link from navigation** - Update `navLinks` arrays
6. **Test responsive behavior** - Check mobile/tablet/desktop

### Adding a shadcn Component

```bash
# Browse https://ui.shadcn.com/docs/components
npx shadcn@latest add [component-name]
# Example: npx shadcn@latest add dialog
```

Components go to `components/ui/` and are customized with design tokens.

### Creating a Custom Block Component

When you need a reusable composite component:

1. **Create in `components/ui/`** with `*Block.tsx` suffix
2. **Compose shadcn primitives** (Card, Button, etc.)
3. **Add TypeScript interface** for props
4. **Use design tokens** for spacing/colors
5. **Export from component file**

Example:
```tsx
// components/ui/StatsCardBlock.tsx
interface StatsCardBlockProps {
  label: string;
  value: number;
  icon: React.ReactNode;
}

export function StatsCardBlock({ label, value, icon }: StatsCardBlockProps) {
  return (
    <Card>
      <CardContent className="flex items-center p-6">
        <div className="p-2 bg-blue-100 rounded-lg">{icon}</div>
        <div className="ml-4">
          <p className="text-sm text-muted-foreground">{label}</p>
          <p className="text-2xl font-bold">{value}</p>
        </div>
      </CardContent>
    </Card>
  );
}
```

### Iterating on Existing Components

This is a **prototype** - iteration is expected:

- **Visual tweaks**: Change Tailwind classes directly
- **Interaction changes**: Update handlers, add animations
- **Data structure**: Modify interfaces, update mock data
- **Layout adjustments**: Try different compositions

Don't worry about "breaking" things - this is exploration.

### Adding to Navigation

Update the `navLinks` array in page components:
```typescript
const navLinks: NavLink[] = [
  { label: 'Главная', href: '/' },
  { label: 'Тесты', href: '/tests' },
  { label: 'Группы', href: '/groups' },
  { label: 'Новое', href: '/new-feature' }, // Add here
];
```

## Testing Considerations

### Test Structure

```
tests/
├── e2e/                       # E2E tests
│   ├── *.spec.ts             # Standard Playwright tests
│   ├── *.feature             # BDD feature files (Gherkin)
│   └── design-tokens.spec.ts # Token validation tests
├── visual/                    # Visual regression tests
│   └── __screenshots__/      # Baseline screenshots
└── setup/                     # Test configuration
```

### E2E Tests (Playwright)
- **Configuration**: `playwright-e2e.config.ts`
- **Port**: 3001 (auto-starts dev server)
- **Test files**: `tests/e2e/*.spec.ts`
- **Browser**: Chromium (Desktop Chrome)
- **Reports**: `playwright-report/e2e/`
- **Artifacts**: Screenshots/videos on failure only

**Key Features**:
- Auto-retry on CI (2 retries)
- Trace recording on first retry
- Focus on teacher workflows: group management, test creation

### BDD Tests (Cucumber + Playwright)
- **Configuration**: `playwright.config.ts`
- **Feature files**: `tests/e2e/*.feature`
- **Format**: Gherkin (Given/When/Then)
- **Generator**: `bddgen` (auto-generates step definitions)
- **Port**: Same as E2E (3001)

**Workflow**:
1. Write `.feature` file in Gherkin
2. Run `bddgen` to generate step definitions
3. Implement step logic
4. Run `npm run test:bdd`

### Visual Regression Tests
- **Location**: `tests/visual/`
- **Framework**: Playwright visual comparison
- **Baseline**: `tests/visual/__screenshots__/`
- **Update baselines**: `npm run test:visual:update`

**When to update baselines**:
- Intentional UI changes
- Design token updates
- Component refactoring with visual impact

### Unit Tests (Vitest)
- **Framework**: Vitest (fast Vite-based testing)
- **Run**: `npm run test` or `npm run test:watch`
- **Coverage**: Available via `@vitest/coverage-v8`

### Validation Scripts

Beyond tests, several validation scripts ensure code quality:

- `verify:hardcoded` - Detects hardcoded values (should use tokens)
- `verify:tokens-in-code` - Validates token references
- `verify:css-injection` - Security check for CSS injection
- `verify:shadcn` - Ensures shadcn components use tokens

**Run before commits** to catch issues early.

## Known UX/UI Issues

### High Priority (UX)
1. **Stats table improvements needed**
   - Recent work: Fixed column widths, improved layout (commits: acb3fbe, 29a21bc)
   - Location: `components/stats-table/` (Atomic Design architecture)
   - Known issue: Group 5 visibility (fixed in 55cf6e0)
   - See component README: `components/stats-table/README.md`

### Medium Priority (Polish)
1. **Hardcoded values in stats table CSS** (30+ instances)
   - Should use design tokens for consistency
   - Affects theming and responsive behavior

2. **Missing interaction states**
   - Some buttons lack hover/active states
   - Loading states could be more polished
   - Empty states need better visual design

### Low Priority (Technical Debt)
1. **TypeScript errors ignored** in build config
   - `ignoreBuildErrors: true` in next.config.mjs
   - Fine for prototyping, but should fix eventually

2. **Mock data is inline**
   - Could be extracted to separate files
   - Would make updates easier

**Note**: Since this is a prototype, "backend integration" and "real data" are explicitly out of scope.

## Prototype Development Workflow

### Starting New UI Work

1. **Understand the user flow** - What's the teacher trying to do?
2. **Sketch the layout** - Paper sketch or mental model
3. **Find shadcn components** - What primitives do you need?
4. **Copy similar page** - Use existing page as template
5. **Build with mock data** - Realistic Russian content
6. **Polish interactions** - Hovers, loading, empty states
7. **Test responsive** - Mobile, tablet, desktop
8. **Deploy demo** - `npm run build` → GitHub Pages

### Typical Development Loop

```bash
npm run dev                    # Start dev server
# Make UI changes in editor
# View at http://localhost:3000/dashboard
# Iterate on design
npm run build                  # Test static export
```

### Before Demo/Deploy

1. **Visual check** - Walk through all screens
2. **Responsive check** - Test mobile/tablet viewports
3. **Polish check** - All interactions feel smooth?
4. **Build check** - `npm run build` succeeds
5. **Deploy** - Push to `enhanced-ui` branch for GitHub Pages

## Prototype Scope

### What's Implemented (Demo-Ready)
- ✅ Dashboard with group cards
- ✅ Group details with student list
- ✅ Group statistics view with responsive table
- ✅ Navigation and routing
- ✅ Responsive layouts
- ✅ Design token system
- ✅ Loading and empty states
- ✅ Static export for demos

### What's Prototyped (In Progress)
- 🚧 Group statistics table (ongoing refinements)
- 🚧 Test creation workflow
- 🚧 Additional filters and actions
- 🚧 Student management screens

### What's Out of Scope (Not a Prototype Concern)
- ❌ Backend/API integration
- ❌ Real data persistence
- ❌ Authentication/authorization
- ❌ Student-facing views (future)
- ❌ Test taking functionality (future)
- ❌ Actual grading logic
- ❌ Performance optimization beyond UX perception

**Remember**: This is a **design validation tool**, not production software. Focus on making the UX clear and interactions polished.

## Current Development State

**Active Branch**: `enhanced-ui`
**Main Branch**: `main`

**Note**: The git status and recent commits shown below are a snapshot from when CLAUDE.md was last updated (November 2025). Always check `git status` and `git log` for the current state.

**Recent Commits** (snapshot from 2025-11):
- `45c746b` - docs: remove references to /tasks, /results, /group-tables-demo
- `67d39a1` - Remove routes /tasks, /results, /group-tables-demo
- `011208f` - chore: add design system consistency contract
- `acb3fbe` - fix: force fixed column widths instead of auto-measuring
- `29a21bc` - fix: improve table layout and fix visual issues
- `55cf6e0` - fix: rename table tab and fix group 5 visibility
- `0642c82` - docs: add comprehensive README for stats-table atomic architecture
- `af9cfe2` - refactor: restructure ResponsiveStatsTable using Atomic Design

**Modified Files** (uncommitted at time of snapshot):
- `app/dashboard/[id]/GroupPageClient.tsx`
- `app/dashboard/[id]/GroupStatsClient.tsx`

**Current Focus**: Stats table refinement and visual polish

## Getting Started

```bash
npm install              # Install dependencies
npm run dev              # Start dev server
# Visit http://localhost:3000/dashboard
```

For design token work:
```bash
npm run build:tokens:watch   # Auto-rebuild tokens on changes
```

---

## Quick Reference for Prototyping

### shadcn Component Installation
```bash
npx shadcn@latest add [component]  # Add new shadcn component
```

Browse components: https://ui.shadcn.com/docs/components

### Common shadcn Components Used
- `Card`, `CardHeader`, `CardContent` - For layout panels
- `Button` - All button interactions
- `Input`, `Select` - Form controls
- `Tabs` - Tab navigation (Active/Archived/All)
- `DropdownMenu` - Action menus
- `Badge` - Status indicators
- `Skeleton` - Loading states
- `Dialog`, `Sheet` - Modals and drawers

### File Locations Cheat Sheet
- **Pages**: `app/{feature}/page.tsx`
- **Components**: `components/ui/`
- **Mock Data**: Inline in page files or at top of file
- **Tokens**: `design-system/tokens/` (rarely need to touch)
- **Styles**: `app/globals.css` + Tailwind classes
- **Types**: Inline TypeScript interfaces in page files

---

**Prototyping Mindset**:
- 🎨 Visual polish matters - this is for demos
- 🚀 Speed over perfection - iterate quickly
- 📱 Mobile-first - check responsive behavior
- 🇷🇺 Realistic content - use Russian names/text
- 🧩 shadcn-first - compose from library components

**Avoid**:
- Backend complexity
- Over-engineering the mock data layer
- Deep design token system work (use Tailwind classes)
- Production concerns (auth, security, optimization)
