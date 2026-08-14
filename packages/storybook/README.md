# Jasmine Design System - Storybook Documentation

This package contains Storybook documentation for the Jasmine Design System.

## 🚀 Quick Start

### Recommended: Using the Reliable Startup Script

```bash
# From the monorepo root
npm run start:storybook

# Or directly from the storybook package
cd packages/storybook
./start-storybook.sh
```

This script automatically:
- ✅ Kills any existing process on port 6006
- ✅ Clears all Storybook caches
- ✅ Verifies all required files exist
- ✅ Starts Storybook with clean state

### Alternative: Direct Start

```bash
# From the monorepo root
npm run dev:storybook

# Or from the storybook package
cd packages/storybook
npm run dev
```

## 🌐 Access Storybook

Once started, Storybook will be available at:
- **Local:** http://localhost:6006/
- **Network:** http://10.0.0.5:6006/

## 🏗️ Project Structure

```
packages/storybook/
├── .storybook/           # Storybook configuration
│   ├── main.ts          # Main config (stories pattern, addons)
│   └── preview.ts       # Global decorators and parameters
├── stories/             # Story files
│   └── Button.stories.tsx
├── start-storybook.sh   # Reliable startup script
└── package.json
```

## 🔧 Troubleshooting

### Storybook Not Loading

If Storybook isn't working:

1. **Use the startup script** (recommended):
   ```bash
   ./start-storybook.sh
   ```

2. **Manual cleanup**:
   ```bash
   # Kill any process on port 6006
   lsof -ti:6006 | xargs kill -9
   
   # Clear caches
   rm -rf node_modules/.cache storybook-static .storybook-out
   
   # Restart
   npm run dev
   ```

### TypeScript Errors

If you see TypeScript errors:
- Ensure `packages/design-system` has all required files
- Check that imports use relative paths: `../../design-system/src/...`
- Run `npx tsc --noEmit` to see detailed errors

### Port Already in Use

The startup script automatically handles this, but manually:
```bash
lsof -ti:6006 | xargs kill -9
```

### Stories Not Found

Check that:
- Story files are in `stories/` directory
- Files match pattern: `*.stories.@(js|jsx|mjs|ts|tsx)`
- Imports point to correct design-system paths

## 📝 Scripts

| Script | Description |
|--------|-------------|
| `npm run dev` | Start Storybook dev server |
| `npm run start` | Start with full cleanup (recommended) |
| `npm run build` | Build static Storybook |
| `npm run preview` | Preview built Storybook |

## 🔗 Dependencies

This package uses:
- **Storybook 7.6.23** with React Vite
- Direct imports from `@jasmine/design-system` source
- React 18.2.0 and react-feather for icons

## 💡 Best Practices

1. **Always use the startup script** when having issues
2. **Clear browser cache** if components don't update
3. **Check terminal output** for errors
4. **Verify file paths** when adding new stories

## 🔄 Adding New Stories

1. Create story file in `stories/` directory:
   ```tsx
   // stories/YourComponent.stories.tsx
   import type { Meta, StoryObj } from '@storybook/react';
   import { YourComponent } from '../../design-system/src/components/YourComponent';
   
   const meta: Meta<typeof YourComponent> = {
     title: 'Components/YourComponent',
     component: YourComponent,
     tags: ['autodocs'],
   };
   
   export default meta;
   type Story = StoryObj<typeof YourComponent>;
   
   export const Default: Story = {
     args: {
       // your props
     },
   };
   ```

2. Restart Storybook to see changes

## 🛠️ Configuration

### main.ts
- Defines story file patterns
- Configures addons
- Sets up Vite framework

### preview.ts
- Imports global styles (`variables.css`)
- Sets up global decorators
- Configures controls and parameters

## ⚙️ Technical Notes

- **No TypeScript project references**: Uses direct source imports
- **CSS Modules**: Button component uses scoped styles
- **Design Tokens**: Imported via `variables.css`
- **Icon System**: Uses `react-feather` with `Icons.*` namespace

## 📚 Resources

- [Storybook Documentation](https://storybook.js.org/)
- [React Vite Framework](https://storybook.js.org/docs/react/builders/vite)
- [Writing Stories](https://storybook.js.org/docs/react/writing-stories/introduction)
