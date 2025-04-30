# TaskCardBlock Component Contract

This document defines the contract for the TaskCardBlock component and its variants, specifying how different card types should be rendered based on specific conditions.

## Card Type Definitions

The TaskCardBlock component has several variants that display different interactive elements based on the data available:

### Basic Card Types

1. **FullCard_B**
   - **Conditions**: Has a task number (parsed from `item.title` with regex `/№\s*(\d+)/`) AND has difficulty stats data
   - **Features**: Displays both category selector and difficulty selector as separate dropdown components

2. **OnlyDifficulty_B**
   - **Conditions**: Does NOT have a task number BUT has difficulty stats data
   - **Features**: Displays only difficulty selector dropdown, no category selector

3. **Minimal_B**
   - **Conditions**: Has neither task number nor difficulty stats data
   - **Features**: Displays only basic card without any interactive selectors

## Rendering Logic

The card type should be determined based on the following sequential logic:

```javascript
// Determine card type based on data
const taskNumber = item.title.match(/№\s*(\d+)/)?.[1];
const hasTaskNumber = !!taskNumber;
const hasDifficultyStats = !!itemStats;

let cardType;
if (hasTaskNumber && hasDifficultyStats) {
  cardType = 'FullCard_B';
} else if (!hasTaskNumber && hasDifficultyStats) {
  cardType = 'OnlyDifficulty_B';
} else {
  cardType = 'Minimal_B';
}
```

## Implementation Details

### FullCard_B
- Must display a CategoryDropdown component that allows selection of categories
- Must display a DifficultyDropdown component that allows selection of difficulty levels
- Both dropdowns should be passed as props to TaskCardBlock

### OnlyDifficulty_B
- Must display only the DifficultyDropdown component
- No CategoryDropdown should be rendered

### Minimal_B
- Should not display any dropdowns
- Should render only the basic card elements (title, counter buttons)
- May use default difficulty "any" if needed for internal state

## Interface Contract

The TaskCardBlock component accepts the following props:

```typescript
interface TaskCardBlockProps {
  item: any;                      // The task item data
  category: any;                  // Category data (may be null in B variants)
  currentCount: number;           // Current selected count
  maxCount: number;               // Maximum allowed count
  onDecrement: () => void;        // Handler for decreasing count
  onIncrement: () => void;        // Handler for increasing count
  difficulties: string[];         // Selected difficulty IDs
  onDifficultyChange: (difficultyId: string) => void;  // Handler for difficulty change
  categories: string[];           // Selected category IDs
  onCategoriesChange: (categories: string[]) => void;  // Handler for category change
  itemStats: any;                 // Statistics data for difficulties
  difficultyTiers: { id: string; label: string }[];    // Available difficulty tiers
  difficultyDropdown?: React.ReactNode;  // Optional custom difficulty dropdown
  categoryDropdown?: React.ReactNode;    // Optional custom category dropdown
}
```

## Validation

When implementing the TaskCardBlock component and its variants, ensure:

1. The card type is correctly determined based on the presence of a task number and difficulty stats
2. The appropriate interactive elements are rendered based on the card type
3. All handlers work correctly when interacting with dropdowns and buttons
4. The visual appearance matches the designs for each card type 