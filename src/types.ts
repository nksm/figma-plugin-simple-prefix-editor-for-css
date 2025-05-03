// メッセージの型定義
export interface ApplyMessage {
  type: "apply";
  prefix: string;
  convertSlash: boolean;
  selectAll: boolean;
}

export interface CancelMessage {
  type: "cancel";
}

export type PluginMessage = ApplyMessage | CancelMessage;