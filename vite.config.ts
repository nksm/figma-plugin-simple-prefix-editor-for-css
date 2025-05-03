import { defineConfig, mergeConfig, UserConfig } from 'vite';
import { viteSingleFile } from 'vite-plugin-singlefile';
import path from 'path';
import fs from 'fs';

// Common build configuration
const baseConfig: UserConfig = {
  build: {
    outDir: 'dist',
    emptyOutDir: false,
    assetsInlineLimit: 100000000,
    chunkSizeWarningLimit: 100000000,
    cssCodeSplit: false,
  }
};

// Configuration for plugin code (background)
const codeConfig = defineConfig(mergeConfig(baseConfig, {
  build: {
    lib: {
      entry: path.resolve(__dirname, 'src/code.ts'),
      formats: ['es'],
      fileName: () => 'code.js',
    },
    rollupOptions: {
      output: {
        inlineDynamicImports: true,
      },
    },
  },
  define: {
    'process.env.NODE_ENV': JSON.stringify('production')
  }
}));

// Configuration for UI (using viteSingleFile)
const uiConfig = defineConfig(mergeConfig(baseConfig, {
  plugins: [
    viteSingleFile(),
    {
      name: 'move-html-output',
      closeBundle: {
        sequential: true,
        order: 'post',
        handler() {
          // Move HTML file
          const sourcePath = path.resolve(__dirname, 'dist/src/ui.html');
          const destPath = path.resolve(__dirname, 'dist/ui.html');
          const srcDir = path.resolve(__dirname, 'dist/src');
          
          if (fs.existsSync(sourcePath)) {
            // If the file exists, copy it and delete the original file
            fs.mkdirSync(path.dirname(destPath), { recursive: true });
            fs.copyFileSync(sourcePath, destPath);
            fs.unlinkSync(sourcePath);
            console.log(`Moved HTML file from ${sourcePath} to ${destPath}`);
            
            // Delete if the src directory becomes empty
            try {
              const files = fs.readdirSync(srcDir);
              if (files.length === 0) {
                fs.rmdirSync(srcDir);
                console.log(`Deleted empty directory: ${srcDir}`);
              }
            } catch (error) {
              console.error(`Error during directory deletion: ${error}`);
            }
          }
        }
      }
    }
  ],
  build: {
    rollupOptions: {
      input: {
        ui: path.resolve(__dirname, 'src/ui.html'),
      },
      output: {
        entryFileNames: '[name].js',
      },
    },
  }
}));

// Use different configurations based on command line options
export default defineConfig(({ mode, command }) => {
  if (command === 'build') {
    // Select configuration based on VITE_BUILD_TARGET environment variable
    const target = process.env.VITE_BUILD_TARGET;
    
    if (target === 'code') {
      return codeConfig;
    }
    
    if (target === 'ui') {
      return uiConfig;
    }
    
    // Default is uiConfig
    return uiConfig;
  }

  // For development mode, use UI configuration
  return uiConfig;
});