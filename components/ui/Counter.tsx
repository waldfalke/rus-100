// Code Contracts: PENDING
// @token-status: COMPLETED (Uses standard Tailwind)
import React from "react";

interface CounterProps {
  value: number;
}
 
export const Counter: React.FC<CounterProps> = ({ value }) => (
  // Use standard text-sm
  <span className="text-sm font-semibold leading-5">{value}</span>
); 