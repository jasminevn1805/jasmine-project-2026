/**
 * Semantic Color Tokens
 * 
 * Purpose-driven colors, split by mode.
 * Access as semanticColors.light.text.primary / semanticColors.dark.text.primary.
 * 
 * Auto-generated from Figma export.
 * Do not edit manually - run 'npm run sync:figma' to update.
 */

import { primitiveColors } from '../primitives/colors';

export const semanticColors = {
  light: {
    text: {
      primary: primitiveColors.neutral[900],
      secondary: primitiveColors.neutral[800],
      tertiary: primitiveColors.neutral[600],
      primaryInverse: primitiveColors.neutral[50],
      secondaryInverse: primitiveColors.neutral[100],
      tertiaryInverse: primitiveColors.neutral[200],
      selected: primitiveColors.brand[500],
      disabled: primitiveColors.neutral[300],
      brand: primitiveColors.brand[500],
      link: primitiveColors.blue[500],
      linkHover: primitiveColors.blue[600],
      linkPressed: primitiveColors.blue[700],
      warning: primitiveColors.orange[700],
      negative: primitiveColors.red[600],
      negativeHover: primitiveColors.red[700],
      negativePressed: primitiveColors.red[800],
      positive: primitiveColors.green[600],
      primaryStatic: primitiveColors.neutral[900],
      secondaryStatic: primitiveColors.neutral[800],
      tertiaryStatic: primitiveColors.neutral[600],
      primaryInverseStatic: primitiveColors.neutral[50],
      secondaryInverseStatic: primitiveColors.neutral[100],
      tertiaryInverseStatic: primitiveColors.neutral[200]
    },
    background: {
      primary: primitiveColors.neutral[0],
      hover: primitiveColors.neutral[50],
      pressed: primitiveColors.neutral[100],
      neutral: primitiveColors.neutral[100],
      neutralHover: primitiveColors.neutral[150],
      neutralPressed: primitiveColors.neutral[200],
      selected: primitiveColors.brand[100],
      subtle: primitiveColors.neutral[50],
      inverse: primitiveColors.neutral[900],
      disabled: primitiveColors.neutral[100],
      brand: primitiveColors.brand[500],
      brandHover: primitiveColors.brand[600],
      brandPressed: primitiveColors.brand[700],
      brandSubtle: primitiveColors.brand[100],
      info: primitiveColors.blue[500],
      infoSubtle: primitiveColors.blue[100],
      warning: primitiveColors.orange[500],
      warningSubtle: primitiveColors.orange[100],
      negative: primitiveColors.red[500],
      negativeHover: primitiveColors.red[600],
      negativePressed: primitiveColors.red[700],
      negativeSubtle: primitiveColors.red[100],
      positive: primitiveColors.green[500],
      positiveSubtle: primitiveColors.green[100],
      mono: primitiveColors.neutral[900],
      monoHover: primitiveColors.neutral[800],
      monoPressed: primitiveColors.neutral[700],
      inverseStatic: primitiveColors.neutral[900],
      systemStatic: primitiveColors.neutral[1000],
      systemInverseStatic: primitiveColors.neutral[0]
    },
    icon: {
      primary: primitiveColors.neutral[900],
      subtle: primitiveColors.neutral[600],
      inverse: primitiveColors.neutral[50],
      selected: primitiveColors.brand[500],
      disabled: primitiveColors.neutral[300],
      brand: primitiveColors.brand[500],
      info: primitiveColors.blue[500],
      warning: primitiveColors.orange[500],
      negative: primitiveColors.red[500],
      positive: primitiveColors.green[500],
      primaryStatic: primitiveColors.neutral[900],
      inverseStatic: primitiveColors.neutral[50]
    },
    border: {
      primary: primitiveColors.neutral[300],
      subtle: primitiveColors.neutral[100],
      focus: primitiveColors.blue[500],
      inverse: primitiveColors.neutral[50],
      selected: primitiveColors.blue[500],
      disabled: primitiveColors.neutral[200],
      brand: primitiveColors.brand[500],
      info: primitiveColors.blue[500],
      warning: primitiveColors.orange[500],
      negative: primitiveColors.red[500],
      positive: primitiveColors.green[500],
      mono: primitiveColors.neutral[900]
    },
    surface: {
      l0: primitiveColors.neutral[0],
      l1: primitiveColors.neutral[0],
      l2: primitiveColors.neutral[0],
      l3: primitiveColors.neutral[0],
      l4: primitiveColors.neutral[0],
      l5: primitiveColors.neutral[0],
      l6: primitiveColors.neutral[0]
    },
    material: {
      ultathin: {
        fill: 'rgba(255, 255, 255, 0.07)',
        fillFX: 'rgba(255, 255, 255, 0.03)'
      },
      thin: {
        fill: 'rgba(255, 255, 255, 0.05)',
        fillFX: 'rgba(255, 255, 255, 0.4)'
      },
      regular: {
        fill: 'rgba(255, 255, 255, 0.6)',
        fillFX: 'rgba(255, 255, 255, 0.25)'
      },
      thick: {
        fill: 'rgba(255, 255, 255, 0.84)',
        fillFX: 'rgba(255, 255, 255, 0.34)'
      },
      chrome: {
        fill: 'rgba(255, 255, 255, 0.75)',
        fillFX: 'rgba(255, 255, 255, 0)'
      }
    },
    overlay: {
      '30': primitiveColors.neutral['0@30%'],
      '70': primitiveColors.neutral['0@70%'],
      '30Static': primitiveColors.neutral['0@30%'],
      '30Inverse': primitiveColors.neutral['1000@30%'],
      '30InverseStatic': primitiveColors.neutral['1000@30%'],
      '70Static': primitiveColors.neutral['0@70%'],
      '70Inverse': primitiveColors.neutral['1000@70%'],
      '70InverseStatic': primitiveColors.neutral['1000@70%']
    }
  },
  dark: {
    text: {
      primary: primitiveColors.neutral[50],
      secondary: primitiveColors.neutral[100],
      tertiary: primitiveColors.neutral[200],
      primaryInverse: primitiveColors.neutral[900],
      secondaryInverse: primitiveColors.neutral[800],
      tertiaryInverse: primitiveColors.neutral[600],
      selected: primitiveColors.brand[400],
      disabled: primitiveColors.neutral[700],
      brand: primitiveColors.brand[400],
      link: primitiveColors.blue[400],
      linkHover: primitiveColors.blue[300],
      linkPressed: primitiveColors.blue[200],
      warning: primitiveColors.orange[400],
      negative: primitiveColors.red[400],
      negativeHover: primitiveColors.red[300],
      negativePressed: primitiveColors.red[200],
      positive: primitiveColors.green[400],
      primaryStatic: primitiveColors.neutral[900],
      secondaryStatic: primitiveColors.neutral[800],
      tertiaryStatic: primitiveColors.neutral[600],
      primaryInverseStatic: primitiveColors.neutral[50],
      secondaryInverseStatic: primitiveColors.neutral[100],
      tertiaryInverseStatic: primitiveColors.neutral[200]
    },
    background: {
      primary: primitiveColors.neutral[900],
      hover: primitiveColors.neutral[800],
      pressed: primitiveColors.neutral[700],
      neutral: primitiveColors.neutral[800],
      neutralHover: primitiveColors.neutral[750],
      neutralPressed: primitiveColors.neutral[700],
      selected: primitiveColors.brand[800],
      subtle: primitiveColors.neutral[900],
      inverse: primitiveColors.neutral[50],
      disabled: primitiveColors.neutral[900],
      brand: primitiveColors.brand[400],
      brandHover: primitiveColors.brand[300],
      brandPressed: primitiveColors.brand[200],
      brandSubtle: primitiveColors.brand[800],
      info: primitiveColors.blue[400],
      infoSubtle: primitiveColors.blue[800],
      warning: primitiveColors.orange[400],
      warningSubtle: primitiveColors.orange[800],
      negative: primitiveColors.red[400],
      negativeHover: primitiveColors.red[300],
      negativePressed: primitiveColors.red[200],
      negativeSubtle: primitiveColors.red[800],
      positive: primitiveColors.green[400],
      positiveSubtle: primitiveColors.green[800],
      mono: primitiveColors.neutral[50],
      monoHover: primitiveColors.neutral[100],
      monoPressed: primitiveColors.neutral[200],
      inverseStatic: primitiveColors.neutral[900],
      systemStatic: primitiveColors.neutral[1000],
      systemInverseStatic: primitiveColors.neutral[0]
    },
    icon: {
      primary: primitiveColors.neutral[50],
      subtle: primitiveColors.neutral[600],
      inverse: primitiveColors.neutral[900],
      selected: primitiveColors.brand[400],
      disabled: primitiveColors.neutral[700],
      brand: primitiveColors.brand[400],
      info: primitiveColors.blue[400],
      warning: primitiveColors.orange[400],
      negative: primitiveColors.red[400],
      positive: primitiveColors.green[400],
      primaryStatic: primitiveColors.neutral[900],
      inverseStatic: primitiveColors.neutral[50]
    },
    border: {
      primary: primitiveColors.neutral[700],
      subtle: primitiveColors.neutral[750],
      focus: primitiveColors.blue[400],
      inverse: primitiveColors.neutral[800],
      selected: primitiveColors.blue[400],
      disabled: primitiveColors.neutral[800],
      brand: primitiveColors.brand[400],
      info: primitiveColors.blue[400],
      warning: primitiveColors.orange[400],
      negative: primitiveColors.red[400],
      positive: primitiveColors.green[400],
      mono: primitiveColors.neutral[50]
    },
    surface: {
      l0: primitiveColors.neutral[1000],
      l1: primitiveColors.neutral[950],
      l2: primitiveColors.neutral[900],
      l3: primitiveColors.neutral[850],
      l4: primitiveColors.neutral[800],
      l5: primitiveColors.neutral[750],
      l6: primitiveColors.neutral[700]
    },
    material: {
      ultathin: {
        fill: 'rgba(0, 0, 0, 0.02)',
        fillFX: 'rgba(0, 0, 0, 0)'
      },
      thin: {
        fill: 'rgba(0, 0, 0, 0.26)',
        fillFX: 'rgba(0, 0, 0, 0)'
      },
      regular: {
        fill: 'rgba(0, 0, 0, 0.41)',
        fillFX: 'rgba(0, 0, 0, 0)'
      },
      thick: {
        fill: 'rgba(0, 0, 0, 0.6)',
        fillFX: 'rgba(0, 0, 0, 0)'
      },
      chrome: {
        fill: 'rgba(28, 28, 28, 0.9)',
        fillFX: '#7c7c7c'
      }
    },
    overlay: {
      '30': primitiveColors.neutral['1000@30%'],
      '70': primitiveColors.neutral['1000@70%'],
      '30Static': primitiveColors.neutral['0@30%'],
      '30Inverse': primitiveColors.neutral['0@30%'],
      '30InverseStatic': primitiveColors.neutral['1000@30%'],
      '70Static': primitiveColors.neutral['0@70%'],
      '70Inverse': primitiveColors.neutral['0@70%'],
      '70InverseStatic': primitiveColors.neutral['1000@70%']
    }
  }
} as const;

// Type for autocomplete
export type SemanticColors = typeof semanticColors;
