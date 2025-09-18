// Code Contracts: PENDING
// @token-status: NA (Legacy/Unused?)
import React from 'react';

export interface MyChipProps {
  label: string;
  selected?: boolean;
  onClick?: () => void;
}

export const MyChip: React.FC<MyChipProps> = ({ label, selected = false, onClick }) => (
  <button
    type="button"
    className={`px-3 py-1 rounded-full border ${selected ? 'bg-teal-500 text-white' : 'bg-white text-gray-800'} focus:outline-none`}
    aria-pressed={selected}
    onClick={onClick}
  >
    {label}
  </button>
); 