import React, { createContext, useState } from 'react';

const ThemeContext = createContext(null);

const ThemeProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  return (
    <ThemeContext.Provider value={{ user, setUser }}>
      {children}
    </ThemeContext.Provider>
  );
};

export { ThemeContext, ThemeProvider };
