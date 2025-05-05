import { MESSAGE_TYPE } from "./constants";

// Message type definitions
export interface ApplyMessage {
  type: typeof MESSAGE_TYPE.APPLY;
  prefix?: string;
}

export interface CancelMessage {
  type: typeof MESSAGE_TYPE.CANCEL;
}

export interface ResetMessage {
  type: typeof MESSAGE_TYPE.RESET;
}

export type UIMessage = ApplyMessage | CancelMessage | ResetMessage;
export type PluginMessage = UIMessage;
