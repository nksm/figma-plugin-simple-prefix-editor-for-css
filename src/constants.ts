const MESSAGE_TYPE = {
  CANCEL: "cancel",
  APPLY: "apply",
  RESET: "reset",
};

type MessageType = (typeof MESSAGE_TYPE)[keyof typeof MESSAGE_TYPE];

export { MESSAGE_TYPE, type MessageType };
