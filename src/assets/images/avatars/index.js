const avatars = {
  default: require('./default.png'),
  emily: require('./emily.png'),
  noah: require('./noah.png'),
  lucas: require('./lucas.png'),
  logan: require('./logan.png'),
  aiden: require('./aiden.png'),
};

export const getAvatar = (key) => avatars[key] ?? avatars.default;

export default avatars;
