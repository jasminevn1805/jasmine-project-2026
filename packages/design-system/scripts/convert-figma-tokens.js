/**
 * Figma to TypeScript Token Converter
 * 
 * Converts Figma exported JSON to TypeScript token files.
 * 
 * Usage: node scripts/convert-figma-tokens.js
 */

const fs = require('fs');
const path = require('path');

// Load Figma export
const figmaExport = require('../figma-export.json');

// ─────────────────────────────────────────────────────────────────────────
// Local primitive additions
//
// Two different reasons a primitive scale can end up here instead of in
// figma-export.json - kept as separate groups below so it's clear which
// category a given entry is, and what "done" looks like for each:
//
// (1) TEMPORARY - figma-export.json is missing something shipped code
//     already depends on, and it belongs in Figma's shared "Primitive:
//     Color" / "Primitive: Type" collections eventually (meal-prep is a
//     Theme built on the ecosystem-wide DS pipeline). Regenerating purely
//     from figma-export.json silently deletes these - confirmed by running
//     this script and diffing the output. Remove an entry here the day
//     Figma's own export includes it.
//
// (2) PERMANENT - a product's own brand fork, never intended to be part of
//     Figma's shared ecosystem-wide collections (portfolio-site deliberately
//     diverges from the DS default - see
//     bmad_output/planning-artifacts/design-system-architecture-reference.md
//     §6, Pattern B). These stay here indefinitely; there's no "eventually
//     in Figma" exit condition for them, because the shared Figma file
//     represents the ecosystem default, not one product's intentional
//     divergence from it.
//
// Either way: merge in here instead of hand-patching generated files after
// every `sync:figma` run - hand-patches don't survive the next run.
const LOCAL_PRIMITIVE_COLOR_ADDITIONS = {
  // --- (1) temporary, pending Figma catching up ---
  warmNeutral: {
    '0': '#fafaf8',
    '50': '#f3f3f1',
    '100': '#ebebe9',
    '200': '#dcdcda',
    '300': '#c8c8c6',
    '400': '#a3a3a1',
    '500': '#7d7d7c',
    '600': '#646463',
    '700': '#4b4b4a',
    '800': '#323232',
    '900': '#191919',
  },
  forestGreen: {
    '100': '#c0d2ca',
    '200': '#96b5a7',
    '300': '#6c9784',
    '400': '#427961',
    '500': '#2d6a4f',
    '600': '#295f47',
    '700': '#1f4a37',
    '800': '#173528',
    '900': '#0e2018',
  },

  // --- (2) permanent, portfolio-site's own brand fork ---
  // Ported from projects/portfolio-site/lib/tokens/primitives/colors.ts.
  // Named `warmGray` (not `warmNeutral`, already taken by meal-prep's
  // distinctly different cream/brown-tinted family above) to match the
  // source file's own description of itself: "a warm-leaning grayscale
  // palette". 0/100/900 are identical to the DS's plain `neutral` scale by
  // the original file's own design (only the mid-tones diverge, for a
  // warmer editorial feel) - kept as a complete, self-contained 11-step
  // scale here anyway, so a future portfolio theme.css can reference one
  // scale (`--primitive-warm-gray-*`) instead of mixing `neutral` and
  // `warmGray` references for what is, to that project, one palette.
  warmGray: {
    '0': '#ffffff',
    '50': '#f5f5f5',
    '100': '#e5e5e5',
    '200': '#d1d1d1',
    '300': '#b5b5b5',
    '400': '#9b9b9b',
    '500': '#7f7f7f',
    '600': '#6b6b6b',
    '700': '#4a4a4a',
    '800': '#2d2d2d',
    '900': '#1a1a1a',
    // Not a numbered scale step - portfolio's dedicated "page canvas"
    // background (sits between pure white and warmGray 50; the original
    // file's own comment describes it as "cooler than DS warmNeutral[0]
    // to keep the grid feel crisp"). Kept alongside the numbered steps
    // since every other alternate-notation key in this file (e.g.
    // neutral's `0@30%` alpha variants) already mixes non-sequential keys
    // into a scale object - this isn't a new pattern.
    canvas: '#fafafa',
  },

  // --- (2) permanent, retell-AI's own brand fork ---
  // Cool, slightly blue-leaning grayscale from the retell-AI agent builder
  // prototype (projects/retell-AI/prototype/styles.css). Same 11-step shape
  // as warmGray. Every step that the prototype actually used is kept at its
  // exact value: 50 page bg, 100 sunken fill, 200 decorative border,
  // 500 interactive border (3.8:1 on white, 3.3:1 on 100 - WCAG 1.4.11),
  // 600/700/900 tertiary/secondary/primary text (6.1:1, 8.5:1, 18.1:1 on
  // white). 300, 400 and 800 are interpolated to complete the scale.
  coolGray: {
    '0': '#ffffff',
    '50': '#f5f6f8',
    '100': '#eef0f3',
    '200': '#e2e5e9',
    '300': '#c9cdd3',
    '400': '#a3a9b1',
    '500': '#7d848f',
    '600': '#5c636d',
    '700': '#464d57',
    '800': '#2c3138',
    '900': '#13161b',
  },
};

const LOCAL_PRIMITIVE_TYPOGRAPHY_FAMILY_ADDITIONS = {
  // (1) temporary, pending Figma catching up
  plusJakartaSans: 'Plus Jakarta Sans',

  // (2) permanent, product-specific fonts - see the category note above
  // LOCAL_PRIMITIVE_COLOR_ADDITIONS. portfolio-site's own
  // lib/tokens/primitives/typography.ts already assumed these existed here
  // (its own header comment says so) - they just hadn't actually been added
  // yet, which silently broke `next build` for portfolio-site until now.
  amiri: 'Amiri', // portfolio's editorial display serif, loaded via next/font/google
  mono: 'ui-monospace', // portfolio's monospace token; no custom webfont loaded, resolves to the OS default
  instrumentSans: 'Instrument Sans', // retell-AI's UI typeface, loaded via next/font/google
};

// Utility: Convert Figma name to camelCase
function toCamelCase(str) {
  return str
    .replace(/^(\d+)([A-Z]+)$/, '$2$1') // "2XS" → "XS2" → "xs2"
    .replace(/\s+/g, '') // Remove spaces
    .replace(/[-_]/g, '') // Remove dashes/underscores
    .replace(/^[A-Z]/, (match) => match.toLowerCase()) // First letter lowercase
    .replace(/[A-Z]/g, (match, offset) => 
      offset > 0 ? match.toUpperCase() : match.toLowerCase()
    );
}

// Utility: Resolve Figma references like "{Unit.8}" or "{Neutral.900}"
function resolveReference(value, collections, depth = 0, keepReference = false) {
  if (typeof value !== 'string') return value;
  if (depth > 10) return value; // Prevent infinite recursion
  
  const refMatch = value.match(/^\{(.+?)\}$/);
  if (!refMatch) return value;
  
  const fullPath = refMatch[1];
  const parts = fullPath.split('.');
  
  // If keepReference is true, convert to TypeScript reference
  if (keepReference) {
    // Check if this references a primitive collection
    const collectionName = parts[0];
    
    // Map Figma collection names to TypeScript variable names
    const isPrimitive = 
      fullPath.includes('Neutral') || 
      fullPath.includes('Brand') ||
      fullPath.includes('Purple') ||
      fullPath.includes('Blue') ||
      fullPath.includes('Green') ||
      fullPath.includes('Orange') ||
      fullPath.includes('Red') ||
      fullPath.includes('Unit') ||
      fullPath.includes('Desktop') ||
      fullPath.includes('Tablet') ||
      fullPath.includes('Mobile') ||
      fullPath.includes('Weight') ||
      fullPath.includes('Size') ||
      fullPath.includes('Line Height') ||
      fullPath.includes('Letter Spacing') ||
      fullPath.includes('Family');
    
    if (isPrimitive) {
      // Convert "{Neutral.900}" → "primitiveColors.neutral[900]"
      // Convert "{Brand.500}" → "primitiveColors.blue[500]" (brand maps to blue scale)
      // Convert "{Unit.8}" → "primitiveUnits.unit[8]"
      // Convert "{Desktop 1440px}" → "primitiveBreakpoints.desktop1440px"
      // Convert "{Weight.Light}" → "primitiveTypography.weight.light"
      // Convert "{Size.10XL}" → "primitiveTypography.size.xL10"
      // Convert "{Line Height.10XL}" → "primitiveTypography.lineHeight.xL10"
      
      if (fullPath.includes('Unit')) {
        const unitValue = parts[parts.length - 1];
        return `primitiveUnits.unit[${unitValue}]`;
      } else if (fullPath.includes('Desktop') || fullPath.includes('Tablet') || fullPath.includes('Mobile')) {
        // Breakpoint reference - convert "Desktop 1440px" to "desktop1440px"
        const breakpointKey = toCamelCase(fullPath.replace(/\s+/g, ''));
        return `primitiveBreakpoints.${breakpointKey}`;
      } else if (fullPath.includes('Weight')) {
        // Typography weight reference
        const weightValue = fullPath.split('.')[1] || fullPath.split(' ')[1];
        const weightKey = toCamelCase(weightValue);
        return `primitiveTypography.weight.${weightKey}`;
      } else if (fullPath.includes('Size')) {
        // Typography size reference
        const sizeValue = fullPath.split('.')[1];
        const sizeKey = toCamelCase(sizeValue);
        return `primitiveTypography.size.${sizeKey}`;
      } else if (fullPath.includes('Line Height')) {
        // Typography line height reference
        const lineHeightValue = fullPath.replace('Line Height.', '');
        const lineHeightKey = toCamelCase(lineHeightValue);
        return `primitiveTypography.lineHeight.${lineHeightKey}`;
      } else if (fullPath.includes('Letter Spacing')) {
        // Typography letter spacing reference
        const letterSpacingValue = fullPath.replace('Letter Spacing.', '');
        const letterSpacingKey = toCamelCase(letterSpacingValue);
        return `primitiveTypography.letterSpacing.${letterSpacingKey}`;
      } else if (fullPath.includes('Family')) {
        // Typography family reference
        const familyValue = fullPath.split('.')[1];
        const familyKey = toCamelCase(familyValue);
        return `primitiveTypography.family.${familyKey}`;
      } else {
        // Color reference
        const colorScale = parts[0].toLowerCase(); // "Neutral" → "neutral"
        const colorValue = parts[parts.length - 1]; // "900"
        
        // Handle alpha variants like "0@50%". Figma serializes these reference
        // strings with stray spaces ("0 @ 30%"), but toCamelCase() strips all
        // whitespace when generating the actual primitiveColors keys - so the
        // lookup key built here must be normalized the same way, or it silently
        // misses (e.g. `primitiveColors.neutral['0 @ 30%']` is undefined; the
        // real key is `'0@30%'`).
        if (colorValue.includes('@')) {
          const normalizedAlpha = colorValue.replace(/\s+/g, '');
          return `primitiveColors.${colorScale}['${normalizedAlpha}']`;
        }
        return `primitiveColors.${colorScale}[${colorValue}]`;
      }
    }
  }
  
  // Try to find the collection
  let collection = null;
  let tokenPath = parts;
  
  // Direct collection name match (e.g., "Unit", "Neutral", "Brand")
  if (collections[parts[0]]) {
    collection = collections[parts[0]];
    tokenPath = parts; // Keep full path for navigation
  }
  
  // If no collection found, try matching by collection names with spaces
  if (!collection) {
    for (const collName of Object.keys(collections)) {
      if (fullPath.startsWith(collName.replace(/\s+/g, ''))) {
        collection = collections[collName];
        tokenPath = parts.slice(collName.split(/\s+/).length);
        break;
      }
    }
  }
  
  if (!collection) return value;
  
  // Navigate through nested path
  let current = collection;
  
  for (const part of tokenPath) {
    if (current && typeof current === 'object') {
      current = current[part];
    } else {
      return value;
    }
  }
  
  // If we found a token with $value, resolve it recursively
  if (current && typeof current === 'object' && '$value' in current) {
    const resolvedValue = resolveReference(current.$value, collections, depth + 1, keepReference);
    return resolvedValue;
  }
  
  return current ?? value;
}

// Utility: Add unit to number values
function addUnit(value, type) {
  if (typeof value === 'number') {
    if (type === 'CORNER_RADIUS' || type === 'STROKE_FLOAT' || type === 'WIDTH_HEIGHT') {
      return `${value}px`;
    }
  }
  return value;
}

// Parse collections into organized structure
function parseCollections() {
  const collections = {};
  
  figmaExport.forEach(item => {
    const collectionName = Object.keys(item)[0];
    const collectionData = item[collectionName];
    
    // Get the mode data (usually "Mode 1" or mode name)
    const modes = collectionData.modes || {};
    const firstMode = Object.keys(modes)[0];
    const tokens = modes[firstMode] || collectionData;
    
    collections[collectionName] = tokens;
  });
  
  return collections;
}

// Convert collection to TypeScript object
function convertToTS(data, collections, depth = 0, keepReferences = false) {
  if (!data || typeof data !== 'object') return data;
  
  const result = {};
  
  for (const [key, value] of Object.entries(data)) {
    // Skip Figma metadata fields
    if (key.startsWith('$')) continue;
    
    const camelKey = toCamelCase(key);
    
    if (value && typeof value === 'object' && '$value' in value) {
      // This is a token with value
      let tokenValue = value.$value;
      
      // Resolve references (keep as TS references if keepReferences is true)
      tokenValue = resolveReference(tokenValue, collections, 0, keepReferences);
      
      // Add units if needed (only if not a reference)
      if (!keepReferences || typeof tokenValue !== 'string' || !tokenValue.includes('primitive')) {
        tokenValue = addUnit(tokenValue, value.$scopes?.[0]);
      }
      
      result[camelKey] = tokenValue;
    } else if (value && typeof value === 'object') {
      // Nested object
      result[camelKey] = convertToTS(value, collections, depth + 1, keepReferences);
    } else {
      result[camelKey] = value;
    }
  }
  
  return result;
}

// Generate TypeScript file content
function generateTSFile(name, description, data, imports = []) {
  const importStatements = imports.length > 0 
    ? imports.map(imp => `import ${imp.what} from '${imp.from}';`).join('\n') + '\n\n'
    : '';
  
  // Custom stringify that handles references properly
  function stringifyWithReferences(obj, indent = 0) {
    const spaces = '  '.repeat(indent);
    
    if (obj === null || obj === undefined) return 'null';
    if (typeof obj === 'number' || typeof obj === 'boolean') return String(obj);
    if (typeof obj === 'string') {
      // Check if this is a TypeScript reference
      if (obj.startsWith('primitiveColors.') || obj.startsWith('primitiveUnits.') || 
          obj.startsWith('primitiveTypography.') || obj.startsWith('primitiveBorders.') ||
          obj.startsWith('primitiveBreakpoints.')) {
        return obj; // Return without quotes
      }
      return `'${obj}'`; // Regular string with quotes
    }
    
    if (Array.isArray(obj)) {
      const items = obj.map(item => stringifyWithReferences(item, indent + 1)).join(', ');
      return `[${items}]`;
    }
    
    // Object
    const entries = Object.entries(obj).map(([key, value]) => {
      const valueStr = stringifyWithReferences(value, indent + 1);
      // Check if key needs quotes (contains special chars like @, %, ., or starts with number, or is special like 'px')
      const needsQuotes = /[@%\-\s\.]/.test(key) || /^\d/.test(key) || key === 'px';
      const keyStr = needsQuotes ? `'${key}'` : key;
      return `${spaces}  ${keyStr}: ${valueStr}`;
    });
    
    return `{\n${entries.join(',\n')}\n${spaces}}`;
  }
  
  const dataStr = stringifyWithReferences(data, 0);
  
  return `/**
 * ${description}
 * 
 * Auto-generated from Figma export.
 * Do not edit manually - run 'npm run sync:figma' to update.
 */

${importStatements}export const ${name} = ${dataStr} as const;

// Type for autocomplete
export type ${name.charAt(0).toUpperCase() + name.slice(1)} = typeof ${name};
`;
}

// Main conversion function
async function convertTokens() {
  console.log('🎨 Converting Figma tokens to TypeScript...\n');
  
  const collections = parseCollections();
  const outputDir = path.join(__dirname, '../src/tokens');
  
  // Ensure output directories exist
  const primitivesDir = path.join(outputDir, 'primitives');
  const semanticDir = path.join(outputDir, 'semantic');
  
  fs.mkdirSync(primitivesDir, { recursive: true });
  fs.mkdirSync(semanticDir, { recursive: true });
  
  // 1. PRIMITIVES: Units
  console.log('📦 Converting primitives/units.ts...');
  const units = convertToTS(collections['Unit'], collections);
  fs.writeFileSync(
    path.join(primitivesDir, 'units.ts'),
    generateTSFile('primitiveUnits', 'Primitive Unit Tokens\n * \n * Raw unit values (px)', units)
  );
  
  // 2. PRIMITIVES: Colors
  console.log('📦 Converting primitives/colors.ts...');
  const primitiveColors = {
    ...convertToTS(collections['Primitive: Color'], collections),
    ...LOCAL_PRIMITIVE_COLOR_ADDITIONS, // see note at top of file
  };
  fs.writeFileSync(
    path.join(primitivesDir, 'colors.ts'),
    generateTSFile('primitiveColors', 'Primitive Color Tokens\n * \n * Raw color values with no semantic meaning', primitiveColors)
  );

  // 3. PRIMITIVES: Typography
  console.log('📦 Converting primitives/typography.ts...');
  const primitiveType = convertToTS(collections['Primitive: Type'], collections); // Resolve Unit references to actual values
  primitiveType.family = { ...primitiveType.family, ...LOCAL_PRIMITIVE_TYPOGRAPHY_FAMILY_ADDITIONS }; // see note at top of file
  fs.writeFileSync(
    path.join(primitivesDir, 'typography.ts'),
    generateTSFile('primitiveTypography', 'Primitive Typography Tokens\n * \n * Raw typography values', primitiveType)
  );
  
  // 4. PRIMITIVES: Borders
  console.log('📦 Converting primitives/borders.ts...');
  const borders = convertToTS(collections['Border'], collections, 0, true); // Keep Unit references
  fs.writeFileSync(
    path.join(primitivesDir, 'borders.ts'),
    generateTSFile(
      'primitiveBorders', 
      'Primitive Border Tokens\n * \n * Raw border radius and width values that reference primitive units', 
      borders,
      [{ what: "{ primitiveUnits }", from: './units' }]
    )
  );
  
  // 5. PRIMITIVES: Breakpoints
  console.log('📦 Converting primitives/breakpoints.ts...');
  const breakpoints = convertToTS(collections['Breakpoints'], collections);
  fs.writeFileSync(
    path.join(primitivesDir, 'breakpoints.ts'),
    generateTSFile('primitiveBreakpoints', 'Primitive Breakpoint Tokens\n * \n * Responsive breakpoint values', breakpoints)
  );
  
  // 6. Update primitives index
  console.log('📦 Updating primitives/index.ts...');
  const primitivesIndex = `/**
 * Primitive Tokens - Index
 * 
 * Exports all primitive tokens.
 * These are RAW VALUES with no semantic meaning.
 */

export { primitiveUnits } from './units';
export { primitiveColors } from './colors';
export { primitiveTypography } from './typography';
export { primitiveBorders } from './borders';
export { primitiveBreakpoints } from './breakpoints';
export { primitiveShadows } from './shadows';
export { primitiveSpacing } from './spacing';

export type { PrimitiveUnits } from './units';
export type { PrimitiveColors } from './colors';
export type { PrimitiveTypography } from './typography';
export type { PrimitiveBorders } from './borders';
export type { PrimitiveBreakpoints } from './breakpoints';
export type { PrimitiveShadows } from './shadows';
export type { PrimitiveSpacing } from './spacing';
`;
  fs.writeFileSync(path.join(primitivesDir, 'index.ts'), primitivesIndex);
  
  // 7. SEMANTIC: Colors (Light & Dark modes, each a full semantic tree)
  console.log('📦 Converting semantic/colors.ts...');

  // Special handling for Semantic: Color - process both Light and Dark modes.
  // `collections['Semantic: Color']` (built by parseCollections) only keeps the
  // FIRST mode, so read the raw collection from figmaExport directly instead -
  // same pattern already used below for Semantic Type Web's Desktop/Mobile modes.
  const semanticColorCollection = figmaExport.find(d => d['Semantic: Color'])['Semantic: Color'];
  const colorModes = {};

  for (const [modeName, modeData] of Object.entries(semanticColorCollection.modes)) {
    const modeKey = toCamelCase(modeName); // "Light" → "light", "Dark" → "dark"
    colorModes[modeKey] = convertToTS(modeData, collections, 0, true);
  }

  fs.writeFileSync(
    path.join(semanticDir, 'colors.ts'),
    generateTSFile(
      'semanticColors',
      'Semantic Color Tokens\n * \n * Purpose-driven colors, split by mode.\n * Access as semanticColors.light.text.primary / semanticColors.dark.text.primary.',
      colorModes,
      [{ what: "{ primitiveColors }", from: '../primitives/colors' }]
    )
  );
  
  // 8. SEMANTIC: Typography (Web with Desktop & Mobile nested)
  console.log('📦 Converting semantic/typography.ts...');
  
  // Special handling for Semantic Type Web - process both Desktop and Mobile modes
  const semanticTypeCollection = figmaExport.find(d => d['Semantic: Type Web'])['Semantic: Type Web'];
  const typographyModes = {};
  
  for (const [modeName, modeData] of Object.entries(semanticTypeCollection.modes)) {
    const modeKey = toCamelCase(modeName); // "Desktop" → "desktop", "Mobile" → "mobile"
    typographyModes[modeKey] = convertToTS(modeData, collections, 0, true);
  }
  
  fs.writeFileSync(
    path.join(semanticDir, 'typography.ts'),
    generateTSFile(
      'semanticTypography',
      'Semantic Typography Tokens\n * \n * Purpose-driven typography with Desktop and Mobile variants',
      typographyModes,
      [
        { what: "{ primitiveTypography }", from: '../primitives/typography' },
        { what: "{ primitiveBreakpoints }", from: '../primitives/breakpoints' }
      ]
    )
  );
  
  // 10. Update semantic index
  console.log('📦 Updating semantic/index.ts...');
  const semanticIndex = `/**
 * Semantic Tokens - Index
 * 
 * Exports all semantic tokens.
 * These tokens have MEANING and are used in components.
 */

export { semanticColors } from './colors';
export { semanticTypography } from './typography';

export type { SemanticColors } from './colors';
export type { SemanticTypography } from './typography';
`;
  fs.writeFileSync(path.join(semanticDir, 'index.ts'), semanticIndex);
  
  console.log('\n✅ Token conversion complete!');
  console.log('\n📁 Generated files:');
  console.log('   primitives/units.ts');
  console.log('   primitives/colors.ts');
  console.log('   primitives/typography.ts');
  console.log('   primitives/spacing.ts (Tailwind CSS standard)');
  console.log('   primitives/borders.ts');
  console.log('   primitives/breakpoints.ts');
  console.log('   semantic/colors.ts');
  console.log('   semantic/typography.ts');
}

// Run conversion
convertTokens().catch(console.error);
