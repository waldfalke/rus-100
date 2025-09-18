'use client';

import React from 'react';

export const TokenDebugger: React.FC = () => {
  const [showDebugger, setShowDebugger] = React.useState(false);
  const [variables, setVariables] = React.useState<Array<{name: string, value: string}>>([]);
  
  React.useEffect(() => {
    if (showDebugger && typeof window !== 'undefined') {
      const rootStyles = window.getComputedStyle(document.documentElement);
      const vars = [];
      
      for (let i = 0; i < rootStyles.length; i++) {
        const prop = rootStyles[i];
        if (prop.startsWith('--')) {
          vars.push({
            name: prop,
            value: rootStyles.getPropertyValue(prop).trim()
          });
        }
      }
      
      setVariables(vars);
    }
  }, [showDebugger]);
  
  return (
    <>
      <button 
        onClick={() => setShowDebugger(!showDebugger)}
        className="fixed bottom-20 right-4 z-50 p-2 bg-gray-800 text-white rounded-md"
      >
        {showDebugger ? 'Скрыть' : 'Показать'} отладчик токенов
      </button>
      
      {showDebugger && (
        <div className="fixed inset-0 z-40 bg-white overflow-auto p-4">
          <h2 className="text-2xl font-bold mb-4">Переменные дизайн-системы</h2>
          <button 
            onClick={() => setShowDebugger(false)}
            className="absolute top-4 right-4 p-2 bg-gray-200 rounded"
          >
            Закрыть
          </button>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
            {variables
              .sort((a, b) => a.name.localeCompare(b.name))
              .map((variable) => (
                <div key={variable.name} className="flex items-center gap-2 border p-2 rounded">
                  {variable.value.includes('#') || variable.value.includes('hsl') ? (
                    <div 
                      className="w-6 h-6 rounded border border-gray-300" 
                      style={{ backgroundColor: variable.value }} 
                    />
                  ) : (
                    <div className="w-6 h-6 flex items-center justify-center text-xs border border-gray-300 rounded">
                      {variable.value.length > 4 ? '...' : variable.value}
                    </div>
                  )}
                  <code className="font-mono text-sm">{variable.name}</code>
                  <span className="text-sm opacity-70 truncate">{variable.value}</span>
                </div>
              ))}
          </div>
        </div>
      )}
    </>
  );
}; 