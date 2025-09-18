# Agent Guidelines for rus-100 Project

## Commands
- **Dev:** `pnpm dev` - Start development server
- **Build:** `pnpm build` - Build for production
- **Lint:** `pnpm lint` - Run ESLint
- **Test:** `pnpm vitest` - Run all tests
- **Test single component:** `pnpm vitest --test 'ComponentName'` - Run specific test
- **Storybook:** `pnpm storybook` - Start Storybook
- **Design tokens:** `pnpm build:tokens` - Build design tokens

## Code Style
- **TypeScript:** Use strict typing with interfaces/types for props
- **Components:** PascalCase for component files and React components
- **CSS:** Use Tailwind with cn utility for merging classNames
- **Imports:** Group by external, then internal (@/ path alias)
- **Props:** Use React.forwardRef pattern for component props
- **UI Components:** Follow shadcn/ui pattern with variants using cva
- **Story Files:** Create .stories.tsx files for component documentation
- **Error Handling:** Use try/catch with descriptive messages
- **Structure:** Follow Next.js app router conventions

## Design Tokens System
- **Always rebuild tokens:** Run `pnpm build:tokens` after changing token JSON files
- **Token Structure:** Base tokens → Semantic tokens → Component tokens
- **CSS Usage:** Prefer Tailwind classes (e.g., `bg-primary`, `text-foreground`)
- **Themeing:** Dark/light themes managed via CSS variables and next-themes
- **Component Status:** Check `@token-status` comments in component files
- **Token Files:** Located in `design-system/tokens/` (base, themes, components)