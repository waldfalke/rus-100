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
npm run test:bdd               # Run BDD feature tests
npm run test:visual            # Visual regression tests
```

### Design Tokens (Infrastructure)
```bash
npm run build:tokens           # Build design tokens from JSON to CSS
npm run validate:tokens        # Validate token definitions
```

### Storybook
```bash
npm run storybook              # Component library (port 6006)
```

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

### 2. Groups List (`app/groups/page.tsx`)

**What it does**: Dedicated page for viewing all groups with filtering

**Key Features**:
- Tabs: Active / Archived / All
- Search by group name or description
- Draft groups shown at top in "Active" tab
- Group cards with participant count, tests count

**Components Used**:
- `HeaderOrganism` - Top navigation with breadcrumbs
- `GroupFilters` - Search and create group button
- `GroupCard` - Reusable group card component
- `TokenGrid` - Grid layout using design tokens

**Routing**: Groups are linked via router.push(`/groups/${id}`)

### 3. Group Details (`app/groups/[id]/page.tsx`)

**What it does**: Individual group view with statistics

**Structure**:
- Server component wrapper for static generation
- `GroupStatsClient` - Client component with actual UI
- Static params generated for IDs: 1-6, 'demo'

**Related Contract**: `CONTRACT-RESPONSIVE-STATS-TABLE-001-ADDENDUM.yml`
- Defines responsive statistics table requirements
- Known issues: sticky headers, hardcoded values
- Priority fix: Sticky headers not working in desktop version

### 4. Related Pages (Teacher Workflow)

- `app/tests/` - Test creation and management
- `app/tasks/` - Question bank management
- `app/answers/` - Grading and review
- `app/results/` - Student performance analytics
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
- `responsive-stats-table` - Statistics table (needs fixes - see contract)
- `statistics-card` - Individual stat cards

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
"@/lib/*"       // Library code
"@/components/*" // Components
"@/app/*"       // App pages
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
- `styles/tokens.light.css` - Generated CSS (light)
- `styles/tokens.dark.css` - Generated CSS (dark)

**Note**: Don't edit generated CSS files directly. Edit JSON sources.

## Contract-Based Development

This project uses **contracts** to define requirements before implementation.

### Current Contracts

Located in `docs/contracts/`:
- `CONTRACT-RESPONSIVE-STATS-TABLE-001-ADDENDUM.yml` - Stats table requirements & issues
- More in `CONTRACT-REGISTRY.md`

### Key Contract Findings

**Responsive Stats Table Issues** (from addendum):
- ❌ **CRITICAL**: Sticky headers not working in desktop version
  - Root cause: CSS architecture issue with `.table-scroll-container`
  - Headers scroll with content instead of staying fixed
  - Priority #1 fix needed
- ❌ Missing Esc key handler for fullscreen mode
- ❌ 30+ hardcoded pixel values (should use design tokens)
- ❌ Hardcoded breakpoints (should use Tailwind responsive utilities)

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
- `app/groups/page.tsx` - Mock groups with realistic descriptions
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

### E2E Tests
- Run on port 3001 (configured in `playwright-e2e.config.ts`)
- Tests will auto-start dev server if needed
- Focus on teacher workflows: group management, test creation

### BDD Tests
- Feature files in `tests/e2e/*.feature`
- Written in Gherkin (Given/When/Then)
- Run `npm run test:bdd` (auto-generates steps)

### Visual Regression
- Screenshot comparison tests
- Use `npm run test:visual:update` to update baselines when UI intentionally changes

## Known UX/UI Issues

### High Priority (UX)
1. **Sticky headers broken** in responsive stats table (desktop)
   - See: `CONTRACT-RESPONSIVE-STATS-TABLE-001-ADDENDUM.yml`
   - Impact: Table headers scroll out of view
   - This affects the demo experience
   - Fix: Remove `.table-scroll-container` or restructure CSS

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

### For Component Development

```bash
npm run storybook              # Isolated component dev
# Build component in Storybook first
# Then integrate into pages
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
- ✅ Group listing with filters/search/tabs
- ✅ Group statistics view (needs sticky header fix)
- ✅ Navigation and routing
- ✅ Responsive layouts
- ✅ Design token system
- ✅ Loading and empty states
- ✅ Static export for demos

### What's Prototyped (In Progress)
- 🚧 Group statistics table (fixing sticky headers)
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

For component development:
```bash
npm run storybook        # Open component library
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
