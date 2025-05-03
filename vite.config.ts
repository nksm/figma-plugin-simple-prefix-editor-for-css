import { defineConfig, mergeConfig, UserConfig } from 'vite';
import { viteSingleFile } from 'vite-plugin-singlefile';
import path from 'path';
import fs from 'fs';

// 共通のビルド設定
const baseConfig: UserConfig = {
  build: {
    outDir: 'dist',
    emptyOutDir: false,
    assetsInlineLimit: 100000000,
    chunkSizeWarningLimit: 100000000,
    cssCodeSplit: false,
  }
};

// プラグインコード（バックグラウンド）用の設定
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

// UI用の設定（viteSingleFileを使用）
const uiConfig = defineConfig(mergeConfig(baseConfig, {
  plugins: [
    viteSingleFile(),
    {
      name: 'move-html-output',
      closeBundle: {
        sequential: true,
        order: 'post',
        handler() {
          // HTMLファイルを移動
          const sourcePath = path.resolve(__dirname, 'dist/src/ui.html');
          const destPath = path.resolve(__dirname, 'dist/ui.html');
          const srcDir = path.resolve(__dirname, 'dist/src');
          
          if (fs.existsSync(sourcePath)) {
            // ファイルが存在する場合はコピーして元のファイルを削除
            fs.mkdirSync(path.dirname(destPath), { recursive: true });
            fs.copyFileSync(sourcePath, destPath);
            fs.unlinkSync(sourcePath);
            console.log(`HTMLファイルを ${sourcePath} から ${destPath} に移動しました`);
            
            // srcディレクトリが空になったら削除
            try {
              const files = fs.readdirSync(srcDir);
              if (files.length === 0) {
                fs.rmdirSync(srcDir);
                console.log(`空のディレクトリを削除しました: ${srcDir}`);
              }
            } catch (error) {
              console.error(`ディレクトリ削除中にエラーが発生しました: ${error}`);
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

// コマンドラインオプションに基づいて、異なる設定を使用
export default defineConfig(({ mode, command }) => {
  if (command === 'build') {
    // 環境変数 VITE_BUILD_TARGET に基づいて設定を選択
    const target = process.env.VITE_BUILD_TARGET;
    
    if (target === 'code') {
      return codeConfig;
    }
    
    if (target === 'ui') {
      return uiConfig;
    }
    
    // デフォルトはuiConfig
    return uiConfig;
  }

  // 開発モードの場合は、UI設定を使用
  return uiConfig;
});