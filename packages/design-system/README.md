# @jasmine/design-system

Jasmine Design System - A reusable React component library with design tokens and components.

## Installation

```bash
npm install @jasmine/design-system
```

## Usage

```tsx
import { Button } from '@jasmine/design-system';
import '@jasmine/design-system/styles';
import * as Icons from 'react-feather';

function App() {
  return (
    <Button type="Primary" size="M">
      <Icons.Download size={20} /> Download
    </Button>
  );
}
```

## Components

- **Button** - Versatile button component with 13 variants, 3 sizes, loading and disabled states

## Development

This package is part of a monorepo. To develop locally:

```bash
# Install dependencies
npm install

# Start development mode
npm run dev

# Run tests
npm test

# Build package
npm run build
```

## Documentation

See the full documentation in Storybook.

## License

MIT © Jasmine Hoang
