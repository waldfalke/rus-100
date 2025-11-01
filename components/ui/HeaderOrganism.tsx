'use client';

import React from 'react';
import { TopNavBlock } from './TopNavBlock';
import { Breadcrumbs, CrumbItem } from './Breadcrumbs';
import { getContentAlignmentStyles } from '@/lib/tokens/layout';

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

/**
 * @interface HeaderOrganismProps
 * @description Props for the HeaderOrganism component that combines navigation and breadcrumbs.
 * @property {string | null} [userName] - The name of the user to display, or null for anonymous users.
 * @property {string | null} [userEmail] - The email of the user to display.
 * @property {NavLink[]} [navLinks] - Array of navigation links to display.
 * @property {CrumbItem[]} [breadcrumbItems] - Array of breadcrumb items to display.
 * @property {(() => void) | null} [onUserClick] - Callback when user avatar is clicked.
 * @property {() => void} [onAccountClick] - Callback when account menu item is clicked.
 * @property {() => void} [onLogoutClick] - Callback when logout menu item is clicked.
 * @property {React.ReactNode} [breadcrumbSeparator] - Custom separator for breadcrumbs.
 * @property {string} [breadcrumbClassName] - Additional CSS classes for breadcrumbs.
 */
interface HeaderOrganismProps {
  userName?: string | null;
  userEmail?: string | null;
  navLinks?: NavLink[];
  breadcrumbItems?: CrumbItem[];
  onUserClick?: (() => void) | null;
  onAccountClick?: () => void;
  onLogoutClick?: () => void;
  breadcrumbSeparator?: React.ReactNode;
  breadcrumbClassName?: string;
}

/**
 * HeaderOrganism - A unified header component that combines navigation and breadcrumbs
 * 
 * This organism provides a consistent header structure across all pages, combining:
 * - TopNavBlock for main navigation and user controls
 * - Breadcrumbs for page hierarchy navigation
 * 
 * The component ensures consistent spacing and alignment between navigation and breadcrumbs
 * using content alignment tokens for horizontal positioning that matches main content.
 */
export const HeaderOrganism: React.FC<HeaderOrganismProps> = ({
  userName = null,
  userEmail = null,
  navLinks = [],
  breadcrumbItems = [],
  onUserClick = null,
  onAccountClick,
  onLogoutClick,
  breadcrumbSeparator,
  breadcrumbClassName
}) => {
  const alignmentStyles = getContentAlignmentStyles();

  return (
    <header className="w-full">
      {/* Navigation Block - TopNavBlock handles its own full-width background and inner alignment */}
      <TopNavBlock
        userName={userName}
        userEmail={userEmail}
        navLinks={navLinks}
        onUserClick={onUserClick}
        onAccountClick={onAccountClick}
        onLogoutClick={onLogoutClick}
      />
      
      {/* Breadcrumbs Block - Aligned with main content using same container styles */}
      {breadcrumbItems && breadcrumbItems.length > 0 && (
        <div className="w-full">
          <div 
            className="py-2 -mt-1"
            style={alignmentStyles}
          >
            <Breadcrumbs
              items={breadcrumbItems}
              className={breadcrumbClassName}
              separator={breadcrumbSeparator}
            />
          </div>
        </div>
      )}
    </header>
  );
};

export type { HeaderOrganismProps, NavLink };