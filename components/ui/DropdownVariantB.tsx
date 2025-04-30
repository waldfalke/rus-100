"use client";

import React, { useState } from 'react';

interface DropdownVariantBProps {
  options: string[];
  value: string;
  onChange: (value: string) => void;
}

export const DropdownVariantB: React.FC<DropdownVariantBProps> = ({ 
  options, 
  value, 
  onChange 
}) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="relative">
      <button
        type="button"
        className="flex justify-between items-center w-full border border-gray-300 rounded-md px-3 py-2"
        onClick={() => setIsOpen(!isOpen)}
      >
        <span>{value}</span>
        <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {isOpen && (
        <div className="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-md shadow-lg">
          {options.map((option) => (
            <button
              key={option}
              className={`block w-full text-left px-4 py-2 hover:bg-gray-100 ${
                value === option ? 'bg-gray-50 font-medium' : ''
              }`}
              onClick={() => {
                onChange(option);
                setIsOpen(false);
              }}
            >
              {option}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}; 