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

export interface GetThemeMessage {
  type: "get-theme";
}

export interface ThemeChangedMessage {
  type: "theme-changed";
  isDarkMode: boolean;
}

export type UIMessage = ApplyMessage | CancelMessage | GetThemeMessage;
export type PluginMessage = UIMessage | ThemeChangedMessage;