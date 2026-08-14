#!/usr/bin/env node

/**
 * Generate CSS Variables from TypeScript Tokens
 * 
 * TRUE SOURCE OF TRUTH ARCHITECTURE:
 * 
 * Figma Design (Designers' Source)
 *       ↓
 * figma-export.json (exported via Figma plugin)
 *       ↓
 * TypeScript Tokens (CODE'S SOURCE OF TRUTH)
 *   ├─→ Primitives (raw values)
 *   └─→ Semantics (reference primitives, add meaning)
 *       ↓
 *       THIS SCRIPT reads TypeScript tokens
 *       ↓
 * CSS Variables (variables.css)
 * 
 * FLOW:
 * Figma → JSON → TypeScript (primitives) → TypeScript (semantics) → CSS Variables
 * 
 * Workflow:
 * 1. Update Figma design
 * 2. npm run sync:figma (updates figma-export.json + generates TypeScript tokens)
 * 3. npm run generate:css-vars (reads TypeScript tokens → generates CSS)
 * 
 * WHY THIS APPROACH:
 * - TypeScript tokens are the source of truth for all code
 * - CSS is derived from TypeScript, ensuring perfect consistency
 * - Changes to TypeScript logic automatically apply to CSS
 * 
 * Usage: npm run generate:css-vars
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

console.log('📖 Reading TypeScript tokens (source of truth)');
console.log('   TypeScript → CSS Variables');
console.log('');

// Step 1: Compile TypeScript tokens to JavaScript (temp)
const tokensDir = path.join(__dirname, '../src/tokens');
const tempDir = path.join(__dirname, '../.temp-tokens');

// Create temp directory
if (!fs.existsSync(tempDir)) {
  fs.mkdirSync(tempDir, { recursive: true });
}

console.log('🔨 Compiling TypeScript tokens to JavaScript...');

try {
  // Compile TypeScript tokens to CommonJS in temp directory
  const result = execSync(
    `npx tsc "${tokensDir}/**/*.ts" --outDir "${tempDir}" --module commonjs --target es2020 --esModuleInterop --skipLibCheck --declaration false --moduleResolution node`,
    { cwd: path.join(__dirname, '..') }
  );
  console.log('✅ TypeScript compiled successfully\n');
} catch (error) {
  console.error('❌ Failed to compile TypeScript tokens');
  console.error('Trying alternative compilation method...\n');
  
  // Alternative: compile with tsconfig
  try {
    fs.writeFileSync(path.join(tempDir, 'tsconfig.temp.json'), JSON.stringify({
      compilerOptions: {
        target: "es2020",
        module: "commonjs",
        outDir: ".",
        esModuleInterop: true,
        skipLibCheck: true,
        moduleResolution: "node"
      },
      include: [tokensDir + "/**/*.ts"]
    }));
    
    execSync(`npx tsc --project "${path.join(tempDir, 'tsconfig.temp.json')}"`, {
      cwd: path.join(__dirname, '..')
    });
    console.log('✅ TypeScript compiled successfully (alternative method)\n');
  } catch (err2) {
    console.error('❌ All compilation methods failed');
    console.error(err2.stderr ? err2.stderr.toString() : err2.message);
    process.exit(1);
  }
}

// Step 2: Import the compiled tokens
let primitiveColors, primitiveSpacing, primitiveBorders, primitiveBreakpoints, primitiveTypography;
let semanticColors, semanticTypography, semanticSpacing;

try {
  primitiveColors = require(path.join(tempDir, 'primitives/colors')).primitiveColors;
  primitiveSpacing = require(path.join(tempDir, 'primitives/spacing')).primitiveSpacing;
  primitiveBorders = require(path.join(tempDir, 'primitives/borders')).primitiveBorders;
  primitiveBreakpoints = require(path.join(tempDir, 'primitives/breakpoints')).primitiveBreakpoints;
  primitiveTypography = require(path.join(tempDir, 'primitives/typography')).primitiveTypography;
  
  semanticColors = require(path.join(tempDir, 'semantic/colors')).semanticColors;
  semanticTypography = require(path.join(tempDir, 'semantic/typography')).semanticTypography;
  semanticSpacing = require(path.join(tempDir, 'semantic/spacing')).semanticSpacing;
  
  console.log('📦 Loaded TypeScript tokens:');
  console.log('   ✓ Primitive Colors');
  console.log('   ✓ Primitive Spacing');
  console.log('   ✓ Primitive Borders');
  console.log('   ✓ Primitive Breakpoints');
  console.log('   ✓ Primitive Typography');
  console.log('   ✓ Semantic Colors');
  console.log('   ✓ Semantic Typography');
  console.log('   ✓ Semantic Spacing');
  console.log('');
} catch (error) {
  console.error('❌ Failed to load compiled tokens');
  console.error(error.message);
  process.exit(1);
}

// Helper: Convert camelCase to kebab-case and sanitise characters invalid in CSS
// custom property names (which must match: --[a-zA-Z0-9_-]+).
// e.g. "0@30%"  → "0-a30"   (alpha notation: @ → -a, % stripped)
// e.g. "0.5"    → "0-5"
function toKebabCase(str) {
  return str
    .replace(/\./g, '-')                        // "0.5"    → "0-5"
    .replace(/@(\d+)%/g, '-a$1')               // "0@30%"  → "0-a30"
    .replace(/@/g, '-at-')                      // any remaining @ → -at-
    .replace(/%/g, '-pct')                      // any remaining % → -pct
    .replace(/([a-z0-9])([A-Z])/g, '$1-$2')
    .toLowerCase();
}

// Helper: Convert typography size names to match original format (xL5 -> 5-xl)
function formatTypographySize(str) {
  // Match patterns like xL5, xL4, xL3, xL2, xL, xS, etc.
  const xlPattern = /^x-l(\d+)$/;
  const xlMatch = str.match(xlPattern);
  if (xlMatch) {
    return `${xlMatch[1]}-xl`; // xL5 -> 5-xl
  }
  
  const xlSinglePattern = /^x-l$/;
  if (xlSinglePattern.test(str)) {
    return 'xl'; // xL -> xl
  }
  
  const xsPattern = /^x-s$/;
  if (xsPattern.test(str)) {
    return 'xs'; // xS -> xs
  }
  
  // Handle xS2 -> 2-xs (special case for 2XS)
  const xsNumberPattern = /^x-s(\d+)$/;
  const xsNumberMatch = str.match(xsNumberPattern);
  if (xsNumberMatch) {
    return `${xsNumberMatch[1]}-xs`; // xS2 -> 2-xs
  }
  
  return str;
}

// Helper: Convert font weight names to numeric values
function normalizeFontWeight(value) {
  const weightMap = {
    'Thin': 100,
    'Extra Light': 200,
    'Light': 300,
    'Regular': 400,
    'Normal': 400,
    'Medium': 500,
    'Semi Bold': 600,
    'Semibold': 600,
    'Bold': 700,
    'Extra Bold': 800,
    'Black': 900
  };
  
  if (typeof value === 'string' && weightMap[value]) {
    return weightMap[value];
  }
  
  return value;
}

// Helper: Flatten nested object into CSS variables
function flattenObject(obj, prefix = '', processor = null, isTypography = false) {
  const result = {};
  
  for (const [key, value] of Object.entries(obj)) {
    let kebabKey = toKebabCase(key);
    
    // Apply typography size formatting if this is a typography token
    if (isTypography) {
      kebabKey = formatTypographySize(kebabKey);
    }
    
    const cssVar = prefix ? `--${prefix}-${kebabKey}` : `--${kebabKey}`;
    
    if (value && typeof value === 'object' && !Array.isArray(value)) {
      // Recursively flatten nested objects
      Object.assign(result, flattenObject(value, prefix ? `${prefix}-${kebabKey}` : kebabKey, processor, isTypography));
    } else {
      // Apply processor if provided (e.g., add 'px' units, normalize weights)
      const processedValue = processor ? processor(value, kebabKey) : value;
      result[cssVar] = processedValue;
    }
  }
  
  return result;
}

// Generate CSS variables content from TypeScript tokens
function generateCSSVariables() {
  let css = `/**
 * CSS Variables — Brand × Mode
 *
 * DO NOT EDIT MANUALLY!
 * Generated by: scripts/generate-css-from-ts.js
 * Source: src/tokens/semantic/colors.ts (light/dark) + src/tokens/primitives/*.ts
 *
 * CONTRACT: see packages/design-system/docs/architecture/THEMING-CONTRACT.md
 * for the full data-theme / data-mode / @layer specification. Summary:
 *
 *   @layer primitives   - raw values (:root). Never overridden by anyone.
 *   @layer brand-light  - default (Brand) semantic colors, light mode.
 *   @layer brand-dark   - default (Brand) semantic colors, dark mode.
 *                          [data-mode="dark"] on <html> activates this.
 *   @layer theme        - reserved for project theme.css files
 *                          ([data-theme="x"] { --color-*: var(--primitive-*); }).
 *   @layer theme-mode    - reserved for project theme.dark.css files
 *                          ([data-theme="x"][data-mode="dark"] { ... }),
 *                          only written when a theme's hue needs dark-specific
 *                          retuning - most themes need zero rules here.
 *
 * Layer order is declared once, below - project theme files never declare
 * their own @layer. That's what makes cascade precedence explicit instead of
 * depending on @import order.
 *
 * Everything that isn't part of the brand/mode color axis (typography scale,
 * spacing, border radius/width, breakpoints) doesn't vary by theme or mode
 * today, so it lives inside @layer primitives alongside the raw palette
 * rather than getting its own layer.
 *
 * To regenerate: npm run generate:css-vars
 */

@layer primitives, brand-light, brand-dark, theme, theme-mode;

@layer primitives {
  :root {
`;

  // Primitive color palette — exposed as CSS vars so project theme.css files
  // can reference var(--primitive-forest-green-500) instead of hardcoded hex.
  // When you change a primitive hex, run `npm run generate:css-vars` and all
  // project theme.css files that use var(--primitive-*) update automatically.
  css += `    /* ===== PRIMITIVE COLORS (Raw Palette) ===== */\n`;
  css += `    /* Reference these in project theme.css instead of hardcoded hex. */\n`;
  css += `    /* e.g.  --color-background-brand: var(--primitive-forest-green-500); */\n`;
  const primitiveColorVars = flattenObject(primitiveColors, 'primitive');
  for (const [cssVar, value] of Object.entries(primitiveColorVars)) {
    css += `    ${cssVar}: ${value};\n`;
  }

  // Primitive typography families — exposed as CSS vars so project theme.css files
  // can reference var(--primitive-typography-family-plus-jakarta-sans) instead of strings.
  css += `\n    /* ===== PRIMITIVE TYPOGRAPHY (Font Families) ===== */\n`;
  css += `    /* Reference in project theme.css: --font-display: var(--primitive-typography-family-plus-jakarta-sans); */\n`;
  if (primitiveTypography && primitiveTypography.family) {
    for (const [key, value] of Object.entries(primitiveTypography.family)) {
      css += `    --primitive-typography-family-${toKebabCase(key)}: '${value}', sans-serif;\n`;
    }
  }

  // Primitive spacing scale — exposed as CSS vars so project theme.css files
  // can reference var(--primitive-spacing-16) instead of hardcoded px values.
  css += `\n    /* ===== PRIMITIVE SPACING (Raw Scale) ===== */\n`;
  css += `    /* Reference in project theme.css: --space-section: var(--primitive-spacing-48); */\n`;
  for (const [key, value] of Object.entries(primitiveSpacing)) {
    css += `    --primitive-spacing-${toKebabCase(key)}: ${value};\n`;
  }

  // Primitive border radius — exposed as CSS vars so project theme.css files
  // can reference var(--primitive-border-radius-m) instead of hardcoded px values.
  css += `\n    /* ===== PRIMITIVE BORDERS (Radius & Width) ===== */\n`;
  css += `    /* Reference in project theme.css: --radius-md: var(--primitive-border-radius-m); */\n`;
  if (primitiveBorders && primitiveBorders.borderRadius) {
    for (const [key, value] of Object.entries(primitiveBorders.borderRadius)) {
      const cssValue = typeof value === 'number' ? `${value}px` : value;
      css += `    --primitive-border-radius-${toKebabCase(key)}: ${cssValue};\n`;
    }
  }
  if (primitiveBorders && primitiveBorders.borderWidth) {
    for (const [key, value] of Object.entries(primitiveBorders.borderWidth)) {
      const cssValue = typeof value === 'number' ? `${value}px` : value;
      css += `    --primitive-border-width-${toKebabCase(key)}: ${cssValue};\n`;
    }
  }

  // Spacing - Primitive (numeric scale)
  css += `\n    /* ===== SPACING - PRIMITIVE (Tailwind CSS Standard) ===== */\n`;
  const spacing = flattenObject(primitiveSpacing, 'space', (value) => {
    // Spacing values already have units in TypeScript, just return them
    return value;
  });
  for (const [cssVar, value] of Object.entries(spacing)) {
    css += `    ${cssVar}: ${value};\n`;
  }

  // Spacing - Semantic (size names for components)
  css += `\n    /* ===== SPACING - SEMANTIC (Component Sizes) ===== */\n`;
  const semanticSpacingVars = flattenObject(semanticSpacing, 'space', (value) => {
    return value;
  });
  for (const [cssVar, value] of Object.entries(semanticSpacingVars)) {
    css += `    ${cssVar}: ${value};\n`;
  }

  // Borders
  css += `\n    /* ===== BORDERS ===== */\n`;
  css += `    /* Border Radius */\n`;
  if (primitiveBorders && primitiveBorders.borderRadius) {
    const borderRadius = flattenObject(primitiveBorders.borderRadius, 'border-radius', (value) => {
      return typeof value === 'number' ? `${value}px` : value;
    }, true); // true = apply typography/size formatting
    for (const [cssVar, value] of Object.entries(borderRadius)) {
      css += `    ${cssVar}: ${value};\n`;
    }
  }

  css += `\n    /* Border Width */\n`;
  if (primitiveBorders && primitiveBorders.borderWidth) {
    const borderWidth = flattenObject(primitiveBorders.borderWidth, 'border-width', (value) => {
      return typeof value === 'number' ? `${value}px` : value;
    }, true); // true = apply typography/size formatting
    for (const [cssVar, value] of Object.entries(borderWidth)) {
      css += `    ${cssVar}: ${value};\n`;
    }
  }

  // Breakpoints
  css += `\n    /* ===== BREAKPOINTS ===== */\n`;
  const breakpoints = flattenObject(primitiveBreakpoints, 'breakpoint', (value) => {
    return typeof value === 'number' ? `${value}px` : value;
  });
  for (const [cssVar, value] of Object.entries(breakpoints)) {
    css += `    ${cssVar}: ${value};\n`;
  }

  // Desktop Typography
  css += `\n    /* ===== SEMANTIC TYPOGRAPHY (Desktop) ===== */\n`;

  // Desktop font family
  if (semanticTypography && semanticTypography.desktop && semanticTypography.desktop.family) {
    css += `    /* Desktop Font Family */\n`;
    for (const [key, value] of Object.entries(semanticTypography.desktop.family)) {
      css += `    --typography-desktop-family-${toKebabCase(key)}: '${value}', sans-serif;\n`;
    }
  }

  const processTypographyValue = (value, key) => {
    if (key.includes('weight')) {
      return normalizeFontWeight(value);
    } else if (key.includes('size') || key.includes('line-height') || key.includes('letter-spacing')) {
      return typeof value === 'number' ? `${value}px` : value;
    }
    return value;
  };

  // Desktop heading
  if (semanticTypography && semanticTypography.desktop && semanticTypography.desktop.heading) {
    css += `    /* Desktop Heading Styles */\n`;
    const desktopHeading = flattenObject(semanticTypography.desktop.heading, 'typography-desktop-heading', processTypographyValue, true);
    for (const [cssVar, value] of Object.entries(desktopHeading)) {
      css += `    ${cssVar}: ${value};\n`;
    }
  }

  // Desktop text
  if (semanticTypography && semanticTypography.desktop && semanticTypography.desktop.text) {
    css += `\n    /* Desktop Text Styles */\n`;
    const desktopText = flattenObject(semanticTypography.desktop.text, 'typography-desktop-text', processTypographyValue, true);
    for (const [cssVar, value] of Object.entries(desktopText)) {
      css += `    ${cssVar}: ${value};\n`;
    }
  }

  // Desktop label
  if (semanticTypography && semanticTypography.desktop && semanticTypography.desktop.label) {
    css += `\n    /* Desktop Label Styles */\n`;
    const desktopLabel = flattenObject(semanticTypography.desktop.label, 'typography-desktop-label', processTypographyValue, true);
    for (const [cssVar, value] of Object.entries(desktopLabel)) {
      css += `    ${cssVar}: ${value};\n`;
    }
  }

  // Desktop link
  if (semanticTypography && semanticTypography.desktop && semanticTypography.desktop.link) {
    css += `\n    /* Desktop Link Styles */\n`;
    const desktopLink = flattenObject(semanticTypography.desktop.link, 'typography-desktop-link', processTypographyValue, true);
    for (const [cssVar, value] of Object.entries(desktopLink)) {
      css += `    ${cssVar}: ${value};\n`;
    }
  }

  css += `  }\n\n`;

  // Mobile typography — non-color, so it stays inside @layer primitives too.
  css += `  /* ===== RESPONSIVE TYPOGRAPHY (Mobile) ===== */\n`;
  css += `  @media (max-width: 768px) {\n`;
  css += `    :root {\n`;

  // Mobile font family
  if (semanticTypography && semanticTypography.mobile && semanticTypography.mobile.family) {
    css += `      /* Mobile Font Family */\n`;
    for (const [key, value] of Object.entries(semanticTypography.mobile.family)) {
      css += `      --typography-mobile-family-${toKebabCase(key)}: '${value}', sans-serif;\n`;
    }
  }

  // Mobile heading
  if (semanticTypography && semanticTypography.mobile && semanticTypography.mobile.heading) {
    css += `      /* Mobile Heading Styles */\n`;
    const mobileHeading = flattenObject(semanticTypography.mobile.heading, 'typography-mobile-heading', processTypographyValue, true);
    for (const [cssVar, value] of Object.entries(mobileHeading)) {
      css += `      ${cssVar}: ${value};\n`;
    }
  }

  // Mobile text
  if (semanticTypography && semanticTypography.mobile && semanticTypography.mobile.text) {
    css += `\n      /* Mobile Text Styles */\n`;
    const mobileText = flattenObject(semanticTypography.mobile.text, 'typography-mobile-text', processTypographyValue, true);
    for (const [cssVar, value] of Object.entries(mobileText)) {
      css += `      ${cssVar}: ${value};\n`;
    }
  }

  // Mobile label
  if (semanticTypography && semanticTypography.mobile && semanticTypography.mobile.label) {
    css += `\n      /* Mobile Label Styles */\n`;
    const mobileLabel = flattenObject(semanticTypography.mobile.label, 'typography-mobile-label', processTypographyValue, true);
    for (const [cssVar, value] of Object.entries(mobileLabel)) {
      css += `      ${cssVar}: ${value};\n`;
    }
  }

  // Mobile link
  if (semanticTypography && semanticTypography.mobile && semanticTypography.mobile.link) {
    css += `\n      /* Mobile Link Styles */\n`;
    const mobileLink = flattenObject(semanticTypography.mobile.link, 'typography-mobile-link', processTypographyValue, true);
    for (const [cssVar, value] of Object.entries(mobileLink)) {
      css += `      ${cssVar}: ${value};\n`;
    }
  }

  css += `    }\n`;
  css += `  }\n`;
  css += `}\n\n`;

  // Semantic colors — light mode (default, also the fallback when data-mode
  // is unset). Resolved hex values compiled from semantic/colors.ts's `.light`
  // branch; traceability to primitives lives in TypeScript, not here.
  css += `@layer brand-light {\n`;
  css += `  :root,\n  [data-mode="light"] {\n`;
  css += `    /* ===== SEMANTIC COLORS (Brand, Light) ===== */\n`;
  const lightColors = flattenObject(semanticColors.light, 'color');
  for (const [cssVar, value] of Object.entries(lightColors)) {
    css += `    ${cssVar}: ${value};\n`;
  }
  css += `  }\n}\n\n`;

  // Semantic colors — dark mode. Same variable names as brand-light, so a
  // project's theme.css never needs to know which mode is active - it just
  // overrides the variable name, and whichever mode layer resolved first
  // still supplies every token the theme doesn't touch.
  css += `@layer brand-dark {\n`;
  css += `  [data-mode="dark"] {\n`;
  css += `    /* ===== SEMANTIC COLORS (Brand, Dark) ===== */\n`;
  const darkColors = flattenObject(semanticColors.dark, 'color');
  for (const [cssVar, value] of Object.entries(darkColors)) {
    css += `    ${cssVar}: ${value};\n`;
  }
  css += `  }\n}\n`;

  return css;
}

// Main function
function main() {
  console.log('🎨 Generating CSS variables from TypeScript tokens...\n');
  
  try {
    const cssContent = generateCSSVariables();
    const outputPath = path.join(__dirname, '../src/styles/variables.css');
    
    fs.writeFileSync(outputPath, cssContent, 'utf-8');
    
    console.log('✅ Successfully generated variables.css');
    console.log(`📁 Output: ${outputPath}`);
    console.log('\n📊 Generated from TypeScript tokens:');
    console.log('   - Semantic Colors (light & dark modes)');
    console.log('   - Primitive Spacing (numeric scale)');
    console.log('   - Semantic Spacing (xs, s, m, l, xl)');
    console.log('   - Primitive Borders (radius & width)');
    console.log('   - Primitive Breakpoints');
    console.log('   - Semantic Typography (desktop & mobile)');
    console.log('\n💡 TypeScript is the source of truth.');
    console.log('   CSS variables are derived from TypeScript tokens.');
    
    // Cleanup temp directory
    fs.rmSync(tempDir, { recursive: true, force: true });
    console.log('\n🧹 Cleaned up temporary files');
  } catch (error) {
    console.error('❌ Error generating CSS variables:', error.message);
    console.error(error.stack);
    process.exit(1);
  }
}

// Run if called directly
if (require.main === module) {
  main();
}

module.exports = { generateCSSVariables };
