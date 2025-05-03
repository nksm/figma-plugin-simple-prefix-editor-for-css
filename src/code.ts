/// <reference types="@figma/plugin-typings" />
import { PluginMessage, UIMessage } from "./types";

// プラグインのUIを表示
figma.showUI(__html__, { width: 320, height: 360 });

// テーマ情報はUIのみで管理し、プラグイン側では関与しない
// OSの設定に基づいてUIが自動的に調整する

// UIからのメッセージを処理
figma.ui.onmessage = async (msg: UIMessage) => {
  if (msg.type === "cancel") {
    figma.closePlugin();
    return;
  }

  // テーマ取得リクエストは無視する - UIが自動的にシステム設定に基づいて調整する

  if (msg.type === "apply") {
    const { prefix, convertSlash } = msg;

    try {
      // 利用可能なすべての変数コレクションを取得
      const collections = figma.variables.getLocalVariableCollections();

      if (collections.length === 0) {
        figma.notify("変数コレクションが見つかりません。");
        return;
      }

      let totalUpdatedVariables: number = 0;

      // 各コレクションを処理
      for (const collection of collections) {
        // コレクション内のすべての変数IDを取得
        const variableIds = collection.variableIds;

        // 各変数に対して処理を行う
        for (const variableId of variableIds) {
          const variable = figma.variables.getVariableById(variableId);

          if (!variable) continue;

          // 変数の名前を取得
          let variableName: string = variable.name;

          // スラッシュをハイフンに変換するオプションが選択されている場合
          if (convertSlash) {
            variableName = variableName.replace(/\//g, "-");
          }

          // コード構文を設定
          variable.setVariableCodeSyntax(
            "WEB",
            `var(${prefix}${variableName})`
          );
          totalUpdatedVariables++;
        }
      }

      // 完了通知
      figma.notify(
        `${totalUpdatedVariables}個の変数のコード構文を更新しました`
      );
    } catch (error) {
      figma.notify(
        `エラーが発生しました: ${
          error instanceof Error ? error.message : String(error)
        }`
      );
    }

    // プラグインを閉じる
    figma.closePlugin();
  }
};
