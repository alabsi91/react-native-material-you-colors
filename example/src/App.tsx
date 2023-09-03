import React from 'react';

import Home from './screens/Home';
import { ThemeProvider } from './styles/Theme';

export default function App() {
  return (
    <>
      <ThemeProvider defaultTheme='auto'>
        <Home />
      </ThemeProvider>
    </>
  );
}
