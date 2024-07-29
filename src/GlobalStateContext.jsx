// src/GlobalStateContext.jsx
import React, { createContext, useState, useContext } from 'react';

// Create a context
const GlobalStateContext = createContext();

// Create a provider component
export const GlobalStateProvider = ({ children }) => {
  const [selectedSeq, setSelectedSeq] = useState(null);

  return (
    <GlobalStateContext.Provider value={{ selectedSeq, setSelectedSeq }}>
      {children}
    </GlobalStateContext.Provider>
  );
};

// Custom hook to use the GlobalStateContext
export const useGlobalState = () => {
  const context = useContext(GlobalStateContext);
  if (context === undefined) {
    throw new Error('useGlobalState must be used within a GlobalStateProvider');
  }
  return context;
};