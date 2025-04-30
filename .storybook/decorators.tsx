import React from 'react';
import { Decorator } from '@storybook/react';
import { useEffect, useState } from 'react';

/**
 * A decorator that provides a workaround for Next.js "use client" directive
 * This decorator helps prevent "Module level directives cause errors when bundled" warnings
 */
export const withNextClientDirective: Decorator = (Story) => {
  // Wrapping in client component wrapper
  return (
    <div className="next-client-wrapper">
      <Story />
    </div>
  );
}; 