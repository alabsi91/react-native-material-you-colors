import React from 'react';

import Home from './screens/Home';
import { ThemeProvider } from './styles/Theme';

export default function App() {
  return (
    <ThemeProvider seedColor='auto' colorScheme='auto' fallbackColor='#1b6ef3' generationStyle='TONAL_SPOT'>
      <Home />
    </ThemeProvider>
  );
}
