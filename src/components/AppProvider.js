import React from 'react';

export const AppContext = React.createContext({});

const AppProvider = ({ children, user, users }) => (
  <AppContext.Provider value={{ user, users }}>{children}</AppContext.Provider>
);

export default AppProvider;
