"use client"

// Code Contracts: PENDING_VALIDATION
// @token-status: COMPLETED (Implicit via Tailwind/Radix)

"use client"

import * as React from "react"
import * as TabsPrimitive from "@radix-ui/react-tabs"
import { ChevronLeft, ChevronRight } from "lucide-react"

import { cn } from "@/lib/utils"

// Контекст для передачи информации о скроллинге от TabsList к TabsTrigger
const TabsScrollContext = React.createContext<{ showScrollButtons: boolean }>({ 
  showScrollButtons: false 
})

/**
 * @component Tabs
 * @description Root container for a set of tabs. Based on Radix UI Tabs Primitive.
 * Controls the state of the tabs.
 * @see https://www.radix-ui.com/primitives/docs/components/tabs#root
 * @see project-docs/contracts/TestGenerator-UX-TabPanel-Contract.md
 * @see project-docs/contracts/TestGenerator-UX-Tabs-Contract.md
 * @status IN PROGRESS - Implementing embedded contracts.
 * @property {string} [defaultValue] - The value of the tab that should be active initially.
 * @property {string} [value] - The controlled value of the currently active tab.
 * @property {(value: string) => void} [onValueChange] - Event handler called when the active tab changes.
 * @property {'horizontal' | 'vertical'} [orientation] - The orientation of the tabs.
 * @property {'automatic' | 'manual'} [activationMode] - Determines how tabs are activated.
 */
const Tabs = TabsPrimitive.Root

/**
 * @component TabsList
 * @description Contains the trigger buttons for the tabs. Based on Radix UI Tabs Primitive.
 * Should contain multiple `TabsTrigger` components.
 * @see https://www.radix-ui.com/primitives/docs/components/tabs#list
 * @property {boolean} [loop] - When `true`, keyboard navigation will loop from last tab to first, and vice versa.
 */

const TabsList = React.forwardRef<
  React.ElementRef<typeof TabsPrimitive.List>,
  React.ComponentPropsWithoutRef<typeof TabsPrimitive.List>
>(({ className, ...props }, ref) => {
  const [displayStartScroll, setDisplayStartScroll] = React.useState(false)
  const [displayEndScroll, setDisplayEndScroll] = React.useState(false)
  const [mounted, setMounted] = React.useState(false)
  const scrollContainerRef = React.useRef<HTMLDivElement>(null)
  const listRef = React.useRef<HTMLDivElement>(null)

  // Scroll functions similar to MUI
  const scrollLeft = () => {
    const container = scrollContainerRef.current
    if (!container) return
    
    const scrollAmount = container.clientWidth * 0.8 // Scroll by 80% of visible width
    container.scrollBy({ left: -scrollAmount, behavior: 'smooth' })
  }

  const scrollRight = () => {
    const container = scrollContainerRef.current
    if (!container) return
    
    const scrollAmount = container.clientWidth * 0.8 // Scroll by 80% of visible width
    container.scrollBy({ left: scrollAmount, behavior: 'smooth' })
  }

  // IntersectionObserver logic similar to MUI
  React.useEffect(() => {
    const container = scrollContainerRef.current
    const list = listRef.current
    
    if (!container || !list || typeof IntersectionObserver === 'undefined') {
      return
    }

    // Check if scrolling is needed
    const updateScrollButtons = () => {
      const needsScroll = container.scrollWidth > container.clientWidth
      
      if (!needsScroll) {
        setDisplayStartScroll(false)
        setDisplayEndScroll(false)
        return
      }

      const children = Array.from(list.children)
      const length = children.length

      if (length === 0) return

      const firstTab = children[0] as HTMLElement
      const lastTab = children[length - 1] as HTMLElement

      const observerOptions = {
        root: container,
        threshold: 0.99
      }

      // Observer for first tab (controls left/start button)
      const handleScrollButtonStart = (entries: IntersectionObserverEntry[]) => {
        setDisplayStartScroll(!entries[0].isIntersecting)
      }

      const firstObserver = new IntersectionObserver(handleScrollButtonStart, observerOptions)
      firstObserver.observe(firstTab)

      // Observer for last tab (controls right/end button)
      const handleScrollButtonEnd = (entries: IntersectionObserverEntry[]) => {
        setDisplayEndScroll(!entries[0].isIntersecting)
      }

      const lastObserver = new IntersectionObserver(handleScrollButtonEnd, observerOptions)
      lastObserver.observe(lastTab)

      return () => {
        firstObserver.disconnect()
        lastObserver.disconnect()
      }
    }

    const cleanup = updateScrollButtons()

    // Listen for resize events to update scroll buttons
    const handleResize = () => {
      if (cleanup) cleanup()
      setTimeout(updateScrollButtons, 100) // Debounce
    }

    window.addEventListener('resize', handleResize)

    return () => {
      if (cleanup) cleanup()
      window.removeEventListener('resize', handleResize)
    }
  }, [mounted, props.children])

  React.useEffect(() => {
    setMounted(true)
  }, [])

  // Show scroll buttons when there's content to scroll
  const showScrollButtons = displayStartScroll || displayEndScroll

  return (
    <TabsScrollContext.Provider value={{ showScrollButtons }}>
      <div className={cn(
        "relative flex items-center overflow-hidden rounded-lg border border-border bg-background"
      )}>
        {showScrollButtons && displayStartScroll && (
          <button
            onClick={scrollLeft}
            className={cn(
              "flex-shrink-0 w-8 h-8 rounded-full bg-transparent hover:bg-accent transition-colors flex items-center justify-center mr-2 z-10"
            )}
            aria-label="Прокрутить влево"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>
        )}
        
        <div
          ref={scrollContainerRef}
          className="flex-1 overflow-x-auto overflow-y-hidden scrollbar-hide"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          <TabsPrimitive.List
            ref={(node) => {
              listRef.current = node
              if (typeof ref === 'function') {
                ref(node)
              } else if (ref) {
                ref.current = node
              }
            }}
            className={cn(
              // Когда нет скроллинга - растягиваем табы на полную ширину
              showScrollButtons 
                ? "inline-flex items-center justify-start text-muted-foreground p-1.5 gap-1 w-max bg-transparent border-0 shadow-none"
                : "flex items-center justify-start text-muted-foreground p-1.5 gap-1 w-full bg-transparent border-0 shadow-none",
              className
            )}
            {...props}
          />
        </div>

        {showScrollButtons && displayEndScroll && (
          <button
            onClick={scrollRight}
            className={cn(
              "flex-shrink-0 w-8 h-8 rounded-full bg-transparent hover:bg-accent transition-colors flex items-center justify-center ml-2 z-10"
            )}
            aria-label="Прокрутить вправо"
          >
            <ChevronRight className="h-4 w-4" />
          </button>
        )}
      </div>
    </TabsScrollContext.Provider>
  )
})
TabsList.displayName = TabsPrimitive.List.displayName

/**
 * @component TabsTrigger
 * @description The button that activates its associated content panel when clicked or activated by keyboard. Based on Radix UI Tabs Primitive.
 * Must be rendered within a `TabsList`.
 * @see https://www.radix-ui.com/primitives/docs/components/tabs#trigger
 * @status IN PROGRESS - Implementing embedded contracts.
 * @property {string} value - A unique value that associates the trigger with a content panel.
 * @property {boolean} [disabled] - Prevents user interaction with the trigger.
 */
const TabsTrigger = React.forwardRef<
  React.ElementRef<typeof TabsPrimitive.Trigger>,
  React.ComponentPropsWithoutRef<typeof TabsPrimitive.Trigger> & {
    expandToFill?: boolean
  }
>(({ className, expandToFill, ...props }, ref) => {
  const { showScrollButtons } = React.useContext(TabsScrollContext)
  
  // Автоматически растягиваем табы когда нет скроллинга, если не указано иначе
  const shouldExpand = expandToFill !== undefined ? expandToFill : !showScrollButtons
  
  return (
    <TabsPrimitive.Trigger
      ref={ref}
      className={cn(
        "inline-flex items-center justify-center whitespace-nowrap rounded-full px-4 py-1.5 text-sm font-medium transition-all focus-visible:outline-none disabled:pointer-events-none disabled:opacity-50",
        "data-[state=active]:bg-tabs-active data-[state=active]:text-tabs-active-text",
        // Растягиваем таб на равную ширину когда shouldExpand = true
        shouldExpand ? "flex-1" : "flex-shrink-0",
        className
      )}
      {...props}
    />
  )
})
TabsTrigger.displayName = TabsPrimitive.Trigger.displayName

/**
 * @component TabsContent
 * @description Contains the content associated with a specific tab trigger. Based on Radix UI Tabs Primitive.
 * Must be rendered within the `Tabs` root component. Only the content associated with the active trigger is displayed.
 * @see https://www.radix-ui.com/primitives/docs/components/tabs#content
 * @status IN PROGRESS - Implementing embedded contracts.
 * @property {string} value - A unique value that associates the content panel with a trigger.
 */
const TabsContent = React.forwardRef<
  React.ElementRef<typeof TabsPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof TabsPrimitive.Content>
>(({ className, ...props }, ref) => (
  <TabsPrimitive.Content
    ref={ref}
    className={cn(
      "mt-2 ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
      className
    )}
    {...props}
  />
))
TabsContent.displayName = TabsPrimitive.Content.displayName

export { Tabs, TabsList, TabsTrigger, TabsContent }
