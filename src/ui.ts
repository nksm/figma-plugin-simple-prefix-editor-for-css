/// <reference types="@figma/plugin-typings" />
import { ApplyMessage, CancelMessage } from './types';
import './ui.css';

// DOMが読み込まれた後に実行
document.addEventListener("DOMContentLoaded", () => {
  const prefixInput = document.getElementById("prefix") as HTMLInputElement;
  const convertSlashCheckbox = document.getElementById("convertSlash") as HTMLInputElement;
  const previewCode = document.querySelector(".preview code") as HTMLElement;
  
  // プレビュー表示を更新する関数
  const updatePreview = () => {
    if (previewCode) {
      previewCode.textContent = `${prefixInput.value}変数名`;
    }
  };
  
  // 初期表示時にプレビューを更新
  updatePreview();
  
  // プレフィックスが変更されたらプレビューを更新
  if (prefixInput) {
    prefixInput.addEventListener("input", updatePreview);
  }
  
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
});