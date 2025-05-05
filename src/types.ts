import { MESSAGE_TYPE } from "./constants";

// Message type definitions
export interface ApplyMessage {
  type: typeof MESSAGE_TYPE.APPLY;
  prefix?: string;
}

export interface CancelMessage {
  type: typeof MESSAGE_TYPE.CANCEL;
}

export type UIMessage = ApplyMessage | CancelMessage;
export type PluginMessage = UIMessage;
