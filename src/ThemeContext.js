//ThemeContext.js
import React, { createContext, useState, useEffect } from 'react';
import Cookies from 'js-cookie';

export const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState(() => {
    const savedTheme = Cookies.get('theme');
    return savedTheme ? savedTheme : 'light';
  });

  useEffect(() => {
    document.body.className = theme;
    Cookies.set('theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prevTheme) => (prevTheme === 'light' ? 'dark' : 'light'));
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

// import React, { createContext, useState, useEffect } from 'react';
// import Cookies from 'js-cookie';

// export const ThemeContext = createContext();

// export const ThemeProvider = ({ children }) => {
//   const [theme, setTheme] = useState(() => {
//     const savedTheme = Cookies.get('theme');
//     return savedTheme ? savedTheme : 'light';
//   });

//   useEffect(() => {
//     document.body.className = theme;
//     Cookies.set('theme', theme);
//   }, [theme]);

//   const toggleTheme = () => {
//     setTheme((prevTheme) => (prevTheme === 'light' ? 'dark' : 'light'));
//   };

//   return (
//     <>
//       <style>
//         {`
//           body.light {
//             background-color: #ffffff;
//             color: #000000;
//           }
//           body.dark {
//             background-color: #121212;
//             color: #ffffff;
//           }
//         `}
//       </style>
//       <ThemeContext.Provider value={{ theme, toggleTheme }}>
//         {children}
//       </ThemeContext.Provider>
//     </>
//   );
// };


