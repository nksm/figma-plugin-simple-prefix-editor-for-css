/// <reference types="@figma/plugin-typings" />
import { ApplyMessage, CancelMessage, ThemeChangedMessage } from "./types";
import "./ui.css";

// DOMが読み込まれた後に実行
document.addEventListener("DOMContentLoaded", () => {
  const bodyElement = document.body;
  const prefixInput = document.getElementById("prefix") as HTMLInputElement;
  const convertSlashCheckbox = document.getElementById(
    "convertSlash"
  ) as HTMLInputElement;
  const previewCode = document.querySelector(".preview code") as HTMLElement;

  // テーマの設定を適用する関数
  const applyTheme = (isDarkMode: boolean) => {
    if (isDarkMode) {
      bodyElement.classList.add("figma-dark");
      bodyElement.classList.remove("figma-light");
    } else {
      bodyElement.classList.add("figma-light");
      bodyElement.classList.remove("figma-dark");
    }
  };

  // プレビュー表示を更新する関数
  const updatePreview = () => {
    if (previewCode) {
      previewCode.textContent = `var(${prefixInput.value}変数名)`;
    }
  };

  // 初期表示時にプレビューを更新
  updatePreview();

  // プレフィックスが変更されたらプレビューを更新
  if (prefixInput) {
    prefixInput.addEventListener("input", updatePreview);
  }

  // テーマはシステム設定から直接取得し、Figmaからのメッセージには依存しない

  // 適用ボタンのイベントリスナー
  const applyButton = document.getElementById("apply");
  if (applyButton) {
    applyButton.addEventListener("click", () => {
      // プラグインにメッセージを送信
      parent.postMessage(
        {
          pluginMessage: {
            type: "apply",
            prefix: prefixInput.value,
            convertSlash: convertSlashCheckbox.checked,
            // selectAllオプションは削除されたため、デフォルトでtrue
            selectAll: true,
          } as ApplyMessage,
        },
        "*"
      );
    });
  }

  // キャンセルボタンのイベントリスナー
  const cancelButton = document.getElementById("cancel");
  if (cancelButton) {
    cancelButton.addEventListener("click", () => {
      // プラグインにキャンセルメッセージを送信
      parent.postMessage(
        {
          pluginMessage: {
            type: "cancel",
          } as CancelMessage,
        },
        "*"
      );
    });
  }

  // ダークモード/ライトモードの自動検出（システム設定）
  // これはFigmaのテーマとは別に、ブラウザ/OSの設定に基づいて動作
  const darkModeMediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
  
  // 初期状態の設定
  applyTheme(darkModeMediaQuery.matches);
  
  // テーマ変更を検知
  darkModeMediaQuery.addEventListener("change", (e) => {
    applyTheme(e.matches);
  });
});
