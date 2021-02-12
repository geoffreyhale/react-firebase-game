import React, { useState } from 'react';

export const AppContext = React.createContext({});

const AppProvider = ({ children, user, users }) => {
  const [modality, setModality] = useState(null);
  return (
    <AppContext.Provider value={{ modality, setModality, user, users }}>
      {children}
    </AppContext.Provider>
  );
};

export default AppProvider;
