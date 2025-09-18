const StyleDictionary = require('style-dictionary');

// Helper function from default 'css/variables' formatter to get variable name
function getVariableName(token) {
  // TODO: Decide if we need a prefix from options or just use the path
  return `--${token.path.join('-')}`;
}

// Mapping from full Style Dictionary token paths to Tailwind CSS variable names
// Based on TD-FMT-001
const tailwindMap = {
  'theme.color.background.default': '--background',
  'theme.color.foreground.default': '--foreground',
  'theme.color.background.card': '--card',
  'theme.color.foreground.default': '--card-foreground', // Re-using foreground.default as decided
  'theme.color.background.card': '--popover',           // Re-using card background as decided
  // 'theme.color.foreground.default': '--popover-foreground', // Mapped via --card-foreground
  'theme.color.primary.default': '--primary',
  'theme.color.primary.foreground': '--primary-foreground',
  // Update secondary/accent to use the new semantic tokens
  'theme.color.secondary.default': '--secondary',
  'theme.color.secondary.foreground': '--secondary-foreground',
  'theme.color.background.muted': '--muted',
  'theme.color.foreground.muted': '--muted-foreground',
  'theme.color.accent.default': '--accent',
  'theme.color.accent.foreground': '--accent-foreground', // Assuming we added this token too
  'theme.color.error.default': '--destructive',
  'theme.color.error.foreground': '--destructive-foreground',
  'theme.color.border.default': '--border',
  'theme.color.border.default': '--input', // Use the same as border for now
  'theme.color.border.focus': '--ring',
  // Base tokens mapping
  'radius.base': '--radius',
};

// Reverse map to easily check if a token needs flattening
const reverseTailwindMap = Object.entries(tailwindMap).reduce((acc, [sdPath, twVar]) => {
    // Handle potential duplicate source paths (like foreground.default)
    if (!acc[twVar]) {
        acc[twVar] = [];
    }
    acc[twVar].push(sdPath);
    return acc;
}, {});

// Map to handle duplicate sources -> ensure only one CSS var per target TW var
const sdPathToTailwindVar = Object.entries(tailwindMap).reduce((acc, [sdPath, twVar]) => {
    // If the target TW var already exists, prefer the last source path defined (handles duplicates like input/border)
    acc[sdPath] = twVar;
    return acc;
}, {});


StyleDictionary.registerFormat({
  name: 'css/variables-tailwind',
  formatter: function({ dictionary, options }) {
    const { outputReferences } = options;
    let { selector } = options;

    if (!selector) {
      selector = ':root'; // Default selector
    }

    const variableOutputs = [];
    const processedTailwindVars = new Set();

    // Process all tokens
    dictionary.allProperties.forEach(token => {
      const tokenPath = token.path.join('.');
      let variableName;

      // Check if this token path should be mapped to a Tailwind variable
      if (sdPathToTailwindVar[tokenPath]) {
          variableName = sdPathToTailwindVar[tokenPath];
          // Ensure we only output each Tailwind variable once
          if (processedTailwindVars.has(variableName)) {
              return; // Skip if this Tailwind var was already generated from another source path
          }
          processedTailwindVars.add(variableName);
      } else {
          // Otherwise, use the default hierarchical name
          variableName = getVariableName(token);
      }

      const value = outputReferences && token.original.value.startsWith('{')
        ? `var(--${token.original.value.slice(1, -1).replace(/\./g, '-')})`
        : token.value;

      variableOutputs.push(`  ${variableName}: ${value};`);
    });

    // Add the base radius explicitly if not found via theme (it's in base tokens)
    const radiusBaseToken = dictionary.allProperties.find(p => p.path.join('.') === 'radius.base');
    if (radiusBaseToken && !processedTailwindVars.has('--radius')) {
        variableOutputs.push(`  --radius: ${radiusBaseToken.value};`);
        processedTailwindVars.add('--radius');
    }


    return `${selector} {\n${variableOutputs.join('\n')}\n}`;
  }
}); 