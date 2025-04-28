
import React, { createContext, useContext } from 'react';

interface ThemeContextType {
  colors: {
    primary: string;
    secondary: string;
    accent: string;
    background: string;
    text: string;
  };
  fonts: {
    heading: string;
    body: string;
  };
}

const defaultTheme: ThemeContextType = {
  colors: {
    primary: '#4F2D9E',
    secondary: '#7E5BC2', 
    accent: '#E5DEFF',
    background: '#F8F5FF',
    text: '#1A1F2C',
  },
  fonts: {
    heading: 'font-medium',
    body: 'font-normal',
  },
};

const ThemeContext = createContext<ThemeContextType>(defaultTheme);

export const useTheme = () => useContext(ThemeContext);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <ThemeContext.Provider value={defaultTheme}>
      {children}
    </ThemeContext.Provider>
  );
};

export default ThemeProvider;
