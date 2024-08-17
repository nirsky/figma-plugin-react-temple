import React from 'react';
import { useState } from 'react';
import '../styles/ui.css';
import ColourManager from './paletteDisplay';
import ThemeManager from './themeDisplay';

export default function App() {
  const [screen, setScreen] = useState('themeManager');
  function handleOnClick() {
    if (screen == 'themeManager') {
      setScreen('colourManager')
    } else {
      setScreen('themeManager')
    }
  }


  return( 
    <>
      <button 
        className={screen === 'themeManager' ? 'disabled' : ''}
        disabled={screen === 'colourManager'}
        onClick={handleOnClick}>Colour Manager</button>
      <button 
        className={screen === 'themeManager' ? '' : 'disabled'}
        disabled={screen === 'themeManager'}
        onClick={handleOnClick}>Theme Manager</button>
      {screen === 'themeManager' ? <ThemeManager /> : <ColourManager />}
    </>)
}