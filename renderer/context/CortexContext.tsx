// contexts/CortexContext.tsx
import React, { createContext, useState, useContext, ReactNode } from 'react';

interface CortexContextProps {
  onboarded: boolean;
  setOnboarded: (onboarded: boolean) => void;
}

const CortexContext = createContext<CortexContextProps>({
  onboarded: false,
  setOnboarded: () => {},
});

export const useCortex = () => useContext(CortexContext);

interface CortexProviderProps {
  children: ReactNode;
}

export const CortexProvider: React.FC<CortexProviderProps> = ({ children }) => {
  const [onboarded, setOnboarded] = useState<boolean>(false);

  return (
    <CortexContext.Provider value={{ onboarded, setOnboarded }}>
      {children}
    </CortexContext.Provider>
  );
};