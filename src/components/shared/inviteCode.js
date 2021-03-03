const getValueFromLocationSearch = (param, locationSearch = '') => {
  const idx1 = locationSearch.indexOf(param + '=');
  if (idx1 === -1) return '';
  const idx2 = locationSearch.indexOf('&', idx1);
  return locationSearch.substring(
    idx1 + param.length + 1,
    idx2 > idx1 ? idx2 : undefined
  );
};

export const getInviteCodeFromLocationSearchString = (locationSearchString) => {
  return getValueFromLocationSearch('inviteCode', locationSearchString);
};
