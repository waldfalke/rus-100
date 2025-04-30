"use client";

import React from 'react';

interface DropdownVariantAProps {
  options: string[];
  value: string;
  onChange: (value: string) => void;
}

export const DropdownVariantA: React.FC<DropdownVariantAProps> = ({ 
  options, 
  value, 
  onChange 
}) => {
  return (
    <select 
      value={value} 
      onChange={(e) => onChange(e.target.value)}
      className="border border-gray-300 rounded-md px-3 py-2 w-full"
    >
      {options.map((option) => (
        <option key={option} value={option}>
          {option}
        </option>
      ))}
    </select>
  );
}; 