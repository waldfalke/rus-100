"use client";

import React from "react";
import { GroupCard } from "./GroupCard";

interface GroupItem {
  id: string;
  name: string;
  description?: string;
  status: "active" | "archived" | "draft";
  studentCount: number;
  createdAt: string;
  lastActivity?: string;
}

interface GroupListProps {
  groups: GroupItem[];
  emptyStateMessage?: string;
  className?: string;
  onEdit?: (groupId: string) => void;
  onArchive?: (groupId: string) => void;
  onDelete?: (groupId: string) => void;
  onOpen?: (groupId: string) => void;
}

export function GroupList({ 
  groups, 
  emptyStateMessage = "Группы не найдены",
  className,
  onEdit,
  onArchive,
  onDelete,
  onOpen
}: GroupListProps) {
  if (groups.length === 0) {
    return (
      <div 
        className={`
          flex flex-col items-center justify-center py-12 px-4 text-center
          ${className}
        `}
      >
        <div 
          className="w-16 h-16 rounded-full flex items-center justify-center mb-4"
          style={{
            backgroundColor: "var(--color-neutral-100)",
            borderRadius: "var(--radius)"
          }}
        >
          <svg 
            className="w-8 h-8" 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
            style={{ color: "var(--color-neutral-400)" }}
          >
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth={2} 
              d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" 
            />
          </svg>
        </div>
        <h3 
          className="text-lg font-medium mb-2"
          style={{ color: "var(--color-neutral-700)" }}
        >
          {emptyStateMessage}
        </h3>
        <p 
          className="text-sm max-w-sm"
          style={{ color: "var(--color-neutral-500)" }}
        >
          Создайте первую группу, чтобы начать управлять учениками и назначать им тесты.
        </p>
      </div>
    );
  }

  return (
    <div className={`space-y-4 ${className}`}>
      {groups.map((group) => (
        <GroupCard
          key={group.id}
          id={group.id}
          name={group.name}
          description={group.description}
          status={group.status}
          participantCount={group.studentCount}
          createdAt={group.createdAt}
          testsCount={0}
          onEdit={() => onEdit?.(group.id)}
          onArchive={() => onArchive?.(group.id)}
          onDelete={() => onDelete?.(group.id)}
          onOpen={() => onOpen?.(group.id)}
        />
      ))}
    </div>
  );
}