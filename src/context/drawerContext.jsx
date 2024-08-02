import React, { createContext, useContext, useState } from 'react';

// Drawer 상태를 관리할 컨텍스트 생성
const DrawerContext = createContext();

export const useDrawer = () => {
  const context = useContext(DrawerContext);
  if (context === undefined) {
    throw new Error('useDrawer must be used within a DrawerProvider');
  }
  return context;
};

export const DrawerProvider = ({ children }) => {
  const [isDrawerOpen, setIsDrawerOpen] = useState(true);
  const [selectedMenuItem, setSelectedMenuItem] = useState(null);

  return (
    <DrawerContext.Provider value={{ isDrawerOpen, setIsDrawerOpen, selectedMenuItem, setSelectedMenuItem }}>
      {children}
    </DrawerContext.Provider>
  );
};