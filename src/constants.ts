const MESSAGE_TYPE = {
  CANCEL: 'cancel',
  APPLY: 'apply',
  RESET: 'reset',
};

const CODE_SYNTAX_TYPE = {
  WEB: 'WEB',
  IOS: 'iOS',
  ANDROID: 'ANDROID',
};

type MessageType = (typeof MESSAGE_TYPE)[keyof typeof MESSAGE_TYPE];

export { MESSAGE_TYPE, CODE_SYNTAX_TYPE, type MessageType };
