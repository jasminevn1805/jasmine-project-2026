# Design System Documentation

Complete documentation for the Jasmine Design System.

## 📁 Structure

```
docs/
├── README.md              # This file - Documentation index
├── architecture/          # System architecture & token flow
├── styles/                # Typography & styling documentation
└── components/            # Component-specific documentation
```

## 📚 Contents

### Architecture
Documentation about the design system's architecture and token system.

- **[TOKEN-ARCHITECTURE.md](./architecture/TOKEN-ARCHITECTURE.md)** - Token system architecture, data flow from Figma to code
- **[THEMING-CONTRACT.md](./architecture/THEMING-CONTRACT.md)** - The `data-theme` × `data-mode` contract: attribute values, `@layer` cascade order, and rules every project theme file follows

### Styles
Documentation about typography, styling patterns, and utility classes.

- **[TYPOGRAPHY.md](./styles/TYPOGRAPHY.md)** - Typography system documentation
- **[typography-example.html](./styles/typography-example.html)** - Live typography examples

### Components
Component-specific documentation with implementation details, token mappings, and usage guides.

- **[Button](./components/Button/)** - Button component documentation
  - [README.md](./components/Button/README.md) - Overview and usage
  - [TOKEN_MAPPING.md](./components/Button/TOKEN_MAPPING.md) - Complete token reference
  - [TOKEN_INTEGRATION_SUMMARY.md](./components/Button/TOKEN_INTEGRATION_SUMMARY.md) - Implementation details
  - [QUICK_REFERENCE.md](./components/Button/QUICK_REFERENCE.md) - Developer quick guide
  - [INTEGRATION_COMPLETE.md](./components/Button/INTEGRATION_COMPLETE.md) - Integration summary

## 🚀 Quick Links

### Getting Started
- [Architecture Overview](./architecture/TOKEN-ARCHITECTURE.md)
- [Component Documentation](./components/)

### For Designers
- [Typography System](./styles/TYPOGRAPHY.md)
- [Typography Examples](./styles/typography-example.html)

### For Developers
- [Token Architecture](./architecture/TOKEN-ARCHITECTURE.md)
- [Button Quick Reference](./components/Button/QUICK_REFERENCE.md)

## 📦 Related Files

- **Source Code**: [`/src`](../src/) - Component source code
- **Tokens**: [`/src/tokens`](../src/tokens/) - TypeScript design tokens
- **Styles**: [`/src/styles`](../src/styles/) - CSS files and variables

## 🔄 Workflow

To update the design system:

1. **Design Phase**: Update Figma design
2. **Sync Phase**: Run `npm run sync:all` (tokens), then `npm run generate:css-vars` (CSS)
3. **Documentation**: Update relevant docs if needed
4. **Components**: Build/update components using tokens

See [TOKEN-ARCHITECTURE.md](./architecture/TOKEN-ARCHITECTURE.md) for the full pipeline and [THEMING-CONTRACT.md](./architecture/THEMING-CONTRACT.md) for the brand/mode contract.
