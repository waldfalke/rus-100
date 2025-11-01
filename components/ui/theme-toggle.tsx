// Code Contracts: PENDING
// @token-status: COMPLETED (Uses all token variables: bg-card, text-card-foreground, hover:bg-muted, ring-ring, ring-offset-background)
"use client";

import { useTheme } from 'next-themes';
import { Button } from '@/components/ui/button';
import { SunIcon, MoonIcon } from 'lucide-react';
import { useEffect, useState } from 'react';

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  // Prevent hydration mismatch by only rendering after mount
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    // Return a placeholder that matches the server-side render
    return (
      <Button
        className="bg-card text-card-foreground rounded-lg w-9 h-9 p-0 flex items-center justify-center shadow-sm hover:bg-muted focus-visible:ring-1 focus-visible:ring-ring focus-visible:ring-offset-1 ring-offset-background transition-colors"
        size="sm"
        disabled
      >
        <SunIcon className="h-5 w-5" />
        <span className="sr-only">Переключить тему</span>
      </Button>
    );
  }

  return (
    <Button
      className="bg-card text-card-foreground rounded-lg w-9 h-9 p-0 flex items-center justify-center shadow-sm hover:bg-muted focus-visible:ring-1 focus-visible:ring-ring focus-visible:ring-offset-1 ring-offset-background transition-colors"
      size="sm"
      onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}
    >
      {theme === 'light' ? (
        <MoonIcon className="h-5 w-5" />
      ) : (
        <SunIcon className="h-5 w-5" />
      )}
      <span className="sr-only">Переключить тему</span>
    </Button>
  );
}