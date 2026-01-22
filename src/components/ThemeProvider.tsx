
import React, { createContext, useContext } from 'react';

interface ThemeContextType {
  colors: {
    primary: string;
    secondary: string;
    accent: string;
    background: string;
    text: string;
    warm: string;
    success: string;
  };
  gradients: {
    primary: string;
    soft: string;
    warm: string;
    card: string;
  };
  fonts: {
    heading: string;
    body: string;
  };
  shadows: {
    soft: string;
    card: string;
    button: string;
  };
}

const defaultTheme: ThemeContextType = {
  colors: {
    primary: '#4F2D9E',
    secondary: '#7E5BC2',
    accent: '#E5DEFF',
    background: '#FDFCFF',
    text: '#1A1F2C',
    warm: '#E08D3C',
    success: '#22C55E',
  },
  gradients: {
    primary: 'linear-gradient(135deg, #4F2D9E 0%, #7E5BC2 100%)',
    soft: 'linear-gradient(135deg, #F5F3FF 0%, #FFF7ED 50%, #FAF5FF 100%)',
    warm: 'linear-gradient(135deg, #FFF7ED 0%, #F5F3FF 100%)',
    card: 'linear-gradient(180deg, rgba(255,255,255,0.9) 0%, rgba(255,255,255,0.7) 100%)',
  },
  fonts: {
    heading: 'font-semibold',
    body: 'font-normal',
  },
  shadows: {
    soft: '0 2px 8px -2px rgba(79, 45, 158, 0.1), 0 4px 16px -4px rgba(79, 45, 158, 0.1)',
    card: '0 4px 6px -1px rgba(79, 45, 158, 0.05), 0 10px 20px -5px rgba(79, 45, 158, 0.08)',
    button: '0 4px 14px -3px rgba(79, 45, 158, 0.4)',
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
