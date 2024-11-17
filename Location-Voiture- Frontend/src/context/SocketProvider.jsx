import React, { createContext, useContext, useState } from "react";

const SocketContext = createContext();

export const useSocket = () => {
  return useContext(SocketContext);
};

export const SocketProvider = ({ children }) => {
  const [socket, setSocket] = useState(null);

  const value = {
    socket,
    setSocket,
  };

  return (
    <SocketContext.Provider value={value}>{children}</SocketContext.Provider>
  );
};
