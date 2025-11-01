'use client'; // Make it a client component

// Code Contracts: COMPLETED
// @token-status: COMPLETED
import { User, Menu, SunIcon, MoonIcon, LogOut } from "lucide-react";
import React, { useState } from "react";
import { ThemeToggle } from "./theme-toggle";
import Link from "next/link"; // Используем Next.js Link
import { cn } from "@/lib/utils"; // Для условных классов
import { Button } from "@/components/ui/button"; // Import Button
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger, 
  DropdownMenuSeparator,
  DropdownMenuLabel
} from "@/components/ui/dropdown-menu"; // Import Dropdown components
import { useTheme } from 'next-themes'; // Import useTheme for mobile theme toggle
import { pagePaddingX, containerMaxWidth } from "@/lib/tokens"; // Import pagePaddingX and containerMaxWidth tokens
import { getContentAlignmentStyles } from "@/lib/tokens/layout"; // Import content alignment

/**
 * @interface NavLink
 * @description Represents a navigation link item.
 * @property {string} label - The text displayed for the link.
 * @property {string} href - The URL the link points to.
 * @property {'_blank' | '_self' | '_parent' | '_top'} [target] - The target attribute for the link (optional).
 * @property {'lg' | 'always'} [hidden] - Hides the link ('lg': hides on screens smaller than lg, 'always': always hidden) (optional).
 */
interface NavLink {
  label: string;
  href: string;
  target?: '_blank' | '_self' | '_parent' | '_top';
  hidden?: 'lg' | 'always';
}

// Единый набор пунктов меню по умолчанию для всего сайта
const DEFAULT_NAV_LINKS: NavLink[] = [
  { label: 'Главная', href: '/' },
  { label: 'Тесты', href: '/create-test' },
  { label: 'Все группы', href: '/groups' },
  { label: 'Профиль', href: '/account' },
];

/**
 * @interface TopNavBlockProps
 * @description Props for the TopNavBlock component.
 * @property {string | null} userName - The name of the user to display, or null for anonymous users. Currently used for aria-label, display TBD.
 * @property {string | null} userEmail - The email of the user to display, or null for anonymous users. Currently used for aria-label, display TBD.
 * @property {NavLink[]} navLinks - An array of navigation link objects.
 * @property {(() => void) | null} onUserClick - Callback function when the user icon is clicked, or null if the icon is not interactive.
 * @property {(() => void) | null} onAccountClick - Callback function when the Account menu item is clicked, or null if the item is not interactive.
 * @property {(() => void) | null} onLogoutClick - Callback function when the Logout menu item is clicked, or null if the item is not interactive.
 */
interface TopNavBlockProps {
  userName?: string | null;
  userEmail?: string | null;
  navLinks?: NavLink[];
  onUserClick?: (() => void) | null;
  onAccountClick?: () => void;
  onLogoutClick?: () => void;
}

/**
 * Top navigation bar component for the application.
 * Displays the application name, navigation links, user information/icon, and theme toggle.
 *
 * @component
 * @status IN PROGRESS - Implementing embedded contracts.
 * @remarks Design tokens are applied implicitly via Tailwind CSS and shadcn/ui base styles, as indicated by `@token-status: COMPLETED`.
 * @remarks Known issue: The navigation bar might stretch incorrectly on very wide desktop viewports. Consider constraining max-width or adjusting flex behavior. (TODO: Create issue in bug tracker if needed).
 * @precondition `navLinks` prop must be an array of objects conforming to the NavLink interface.
 * @precondition Each link in `navLinks` must have a non-empty `label` and `href`.
 * @postcondition Renders the application name "Русский_100".
 * @postcondition Renders navigation links based on the `navLinks` prop, respecting visibility rules.
 * @postcondition Renders a user icon. If `onUserClick` is provided, the icon is clickable. `userName` is used for aria-label.
 * @postcondition Renders a theme toggle button.
 * @param {TopNavBlockProps} props - The props for the component.
 */
export const TopNavBlock: React.FC<TopNavBlockProps> = ({
  userName = null,
  userEmail = null,
  navLinks = [],
  onUserClick = null,
  onAccountClick,
  onLogoutClick
}) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { theme, setTheme } = useTheme();

  // Merge provided navLinks with defaults, allowing overrides
  const computedNavLinks = navLinks.length > 0 ? navLinks : DEFAULT_NAV_LINKS;

  // Filter out links that should be hidden
  const visibleNavLinks = computedNavLinks.filter(link => link.hidden !== 'always');

  // Get container styles similar to ResponsiveContainer
  const containerStyles = {
    maxWidth: containerMaxWidth.fallback,
    marginLeft: "auto",
    marginRight: "auto",
    paddingLeft: pagePaddingX.fallback,
    paddingRight: pagePaddingX.fallback,
    width: "100%",
  };

  return (
    // Full width background
    <nav className="bg-muted rounded-2xl mt-5 mb-8">
      {/* Inner container for alignment using same styles as ResponsiveContainer */}
      <div 
        className="flex items-center justify-between py-3 relative"
        style={containerStyles}
      >
        {/* Left Side: Logo, Hamburger (Mobile), Nav Links (Desktop) */}
        <div className="flex items-center gap-3"> {/* Increased gap-3 (12px) for better spacing */}
          {/* Logo styled consistently as a button and leading to home */}
          <Link href="/" className="bg-card text-sm font-medium rounded-lg px-3 h-9 flex items-center shadow-sm hover:bg-muted transition-colors" aria-label="Перейти на главную">
            <span className="text-card-foreground">РУССКИЙ</span><span className="text-primary">_100</span>
          </Link>
          
          {/* Hamburger Menu Trigger (Mobile Only) */} 
          <div className="lg:hidden"> {/* Show only on mobile */}
            <DropdownMenu open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
              <DropdownMenuTrigger asChild>
                <Button 
                  size="sm"
                  className="bg-card text-card-foreground rounded-lg shadow-sm flex items-center gap-1.5 px-3 py-0 h-9 hover:bg-muted transition-colors" 
                >
                  <Menu className="h-5 w-5" /> 
                  <span>Меню</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start" className="w-56 bg-card text-card-foreground shadow-lg">
                {/* Only show nav links in mobile menu */} 
                {visibleNavLinks.map((link, index) => (
                  <DropdownMenuItem key={`mobile-${index}`} asChild>
                    <Link 
                      href={link.href || '#'} 
                      target={link.target} 
                      className="cursor-pointer text-app-small font-medium"
                    >
                      {link.label || 'Unnamed Link'}
                    </Link>
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          {/* Desktop Navigation Links */} 
          <div className="hidden lg:flex flex-wrap items-center gap-1"> {/* Added gap-1 for consistent spacing */}
            {visibleNavLinks.map((link, index) => (
              <Link
                key={index}
                href={link.href || '#'}
                target={link.target}
                className={cn(
                  "text-card-foreground text-sm font-medium bg-card rounded-lg px-4 py-2 shadow-sm hover:bg-muted transition-colors",
                  "mx-1 my-1" // Consistent margin spacing
                )}
              >
                {link.label || 'Unnamed Link'}
              </Link>
            ))}
          </div>
        </div>

        {/* Right Side: User Icon Dropdown and Theme Toggle (Visible on All Screens) */}
        <div className="flex items-center gap-3"> {/* Increased gap for better spacing */}
          {/* User icon button with Dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button 
                size="sm" 
                className="bg-card text-card-foreground rounded-lg w-9 h-9 p-0 flex items-center justify-center shadow-sm hover:bg-muted focus-visible:ring-1 focus-visible:ring-ring focus-visible:ring-offset-1 ring-offset-background transition-colors" 
                aria-label={userName ? `Профиль пользователя ${userName}` : "Профиль пользователя"}
              >
                <User className="h-5 w-5" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56 bg-card text-card-foreground shadow-lg">
              {(userName || userEmail) && (
                <DropdownMenuLabel className="font-normal">
                  <div className="flex flex-col space-y-1">
                    {userName && <p className="text-sm font-medium leading-none">{userName}</p>}
                    {userEmail && <p className="text-xs leading-none text-muted-foreground">{userEmail}</p>}
                  </div>
                </DropdownMenuLabel>
              )}
              {(userName || userEmail) && <DropdownMenuSeparator />} 
              <DropdownMenuItem asChild className="cursor-pointer">
                <Link href="/account">
                  <span>Аккаунт</span>
                </Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={onLogoutClick} className="cursor-pointer text-destructive focus:text-destructive focus:bg-destructive/10">
                <div className="flex justify-between items-center w-full">
                  <span>Выйти</span>
                  <LogOut className="h-4 w-4" />
                </div>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Theme toggle button */}
          <div> 
            <ThemeToggle />
          </div>
        </div>
      </div>
    </nav>
  );
};