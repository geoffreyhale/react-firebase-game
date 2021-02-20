import React, { useEffect, useState } from 'react';
import getROOMS from './views/Rooms/getROOMS';

export const AppContext = React.createContext({});

const AppProvider = ({ children, user, users }) => {
  const [modality, setModality] = useState(null);
  const [rooms, setRooms] = useState({});

  useEffect(() => {
    getROOMS((rooms) => setRooms(rooms));
  }, []);

  return (
    <AppContext.Provider value={{ modality, setModality, rooms, user, users }}>
      {children}
    </AppContext.Provider>
  );
};

export default AppProvider;
