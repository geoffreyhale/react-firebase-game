const getMillisFromDifferingTypes = (lastLogin) => {
  if (typeof lastLogin === 'number') {
    return lastLogin;
  }
  if (
    lastLogin &&
    typeof lastLogin === 'object' &&
    typeof lastLogin.toMillis === 'function'
  ) {
    return lastLogin.toMillis();
  }
  console.warn('Unhandled type for lastLogin getMillisFromDifferingTypes');
  return null;
};

export default getMillisFromDifferingTypes;
