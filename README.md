# CSS Custom Property Formatter for Figma

A Figma plugin that formats variable code syntax as CSS custom properties.

## Features

- Sets custom prefixes for all variables at once
- Automatically converts slashes (/) to hyphens (-)
- Formats variables as CSS custom properties with `var()` function
- Works with all variable collections in the document

## How to Use

1. Launch the plugin
2. Enter your desired CSS custom property prefix (e.g., `--ds-`)
3. Click "Apply"
4. All variables will now use the formatted syntax when copied in developer mode

## Benefits

- Standardizes variable naming across design systems
- Ensures CSS custom property naming convention compliance (hyphen-separated)
- Outputs variables wrapped in `var()` function ready to paste into CSS
- Preserves variable hierarchy while improving readability

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

- Modern development environment with TypeScript and Vite
- Efficient implementation using Figma Variables API
- CSS custom property format: `var(--prefix-variableName)`
- Automatic dark/light mode support

## License

ISC

---

_This plugin helps bridge the gap between Figma Variables and CSS custom properties, making it easier to export design tokens to code._
