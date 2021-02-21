import React, { useEffect, useState } from 'react';
import getROOMS from './views/Rooms/getROOMS';

export const AppContext = React.createContext({});

const AppProvider = ({ children, user, users }) => {
  const [modality, setModality] = useState(null);
  const [rooms, setRooms] = useState({});
  const [showWizard, setShowWizard] = useState(true);

  useEffect(() => {
    getROOMS((rooms) => setRooms(rooms));
  }, []);

  return (
    <AppContext.Provider
      value={{
        modality,
        setModality,
        rooms,
        user,
        users,
        showWizard,
        setShowWizard,
        toggleShowWizard: () => setShowWizard(!showWizard),
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export default AppProvider;
