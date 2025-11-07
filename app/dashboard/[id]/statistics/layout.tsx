import React from 'react';

export default function StatisticsLayout({ children }: { children: React.ReactNode }) {
  // Avoid duplicate headers by delegating to parent /dashboard/[id]/layout.tsx
  return <>{children}</>;
}