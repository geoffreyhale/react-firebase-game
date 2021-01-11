import React from 'react';

export const AppContext = React.createContext({});

const AppProvider = ({ children, user }) => (
  <AppContext.Provider value={{ user }}>{children}</AppContext.Provider>
);

export default AppProvider;
