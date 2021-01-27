const getMillisFromDifferingTypes = (lastLogin) =>
  typeof lastLogin === 'object' ? lastLogin.toMillis() : lastLogin;

export default getMillisFromDifferingTypes;
