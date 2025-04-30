import React from "react";

interface CounterProps {
  value: number;
}

export const Counter: React.FC<CounterProps> = ({ value }) => (
  <span className="text-[14px] font-semibold leading-5">{value}</span>
); 