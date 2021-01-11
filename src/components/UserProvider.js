import React from 'react';

export const UserContext = React.createContext('test');

const UserProvider = ({ children, user }) => (
  <UserContext.Provider value={user}>{children}</UserContext.Provider>
);

export default UserProvider;
