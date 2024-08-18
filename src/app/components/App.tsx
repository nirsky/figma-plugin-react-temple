import React from 'react';
import { useState } from 'react';
import { useImmer } from 'use-immer'
import '../styles/ui.css';
import ColourManager from './paletteDisplay';
import ThemeManager from './themeDisplay';
import * as conf from './config';


export default function App() {
  
  const [theme, setTheme] = useImmer(conf.jsonStructure);
  const [palettes, setPalettes] = useState(conf.testPalettes); 
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
      {screen === 'themeManager' ? <ThemeManager
            theme={theme}
            setTheme={setTheme} /> 
            : <ColourManager 
            palettes = {palettes}
            setPalettes = {setPalettes}/>}
    </>)
}