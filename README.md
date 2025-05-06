# Simple Prefix Editor for CSS

A lightweight Figma plugin for quickly adding prefixes to variable code syntax as CSS custom properties.

## Features

- Sets custom prefixes for all variables at once
- Automatically converts slashes (/) to hyphens (-)
- Formats variables as CSS custom properties with `var()` function
- Works with all variable collections in the document
- Reset functionality to remove custom syntax

## How to Use

1. Launch the plugin
2. Enter your desired CSS custom property prefix (e.g., `ds`)
3. Click "Apply" to add prefixes (formatted as `var(--ds-variableName)`)
4. Click "Reset" to remove all custom syntax

## Benefits

- Streamlines design-to-code workflow
- Standardizes variable naming across design systems
- Ensures CSS custom property naming convention compliance
- Creates code-ready variables with minimal effort
- Preserves variable hierarchy while improving readability

## Use Cases

- Design systems that require standardized CSS variables
- Front-end development teams using Figma variables
- Design handoff processes requiring formatted code syntax
- Projects with consistent naming conventions

## Development

### Prerequisites

- Node.js
- npm

### Setup

```bash
# Install dependencies
npm install

# Run in development mode (watch for changes)
npm run dev

# Build the project
npm run build
```

### Testing in Figma

1. Open Figma
2. Go to Plugins > Development > Import plugin from manifest
3. Select the `manifest.json` file from this repository

## Technical Details

- Built with TypeScript and Vite
- Efficient implementation using Figma Variables API
- Simple and intuitive user interface
- CSS custom property format: `var(--prefix-variableName)`
- Automatic dark/light mode support

## License

MIT

---

_This plugin bridges the gap between Figma Variables and CSS custom properties, making design-to-code workflows seamless and consistent._