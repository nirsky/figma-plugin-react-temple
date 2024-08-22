import React from 'react';
import { useState } from 'react';
import { useImmer } from 'use-immer'
import '../styles/ui.css';
import ColourManager from './paletteDisplay';
import ThemeManager from './themeDisplay';
import * as conf from './config';
import Tabs from '@mui/joy/Tabs';
import TabList from '@mui/joy/TabList';
import Tab from '@mui/joy/Tab';
import TabPanel from '@mui/joy/TabPanel';



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
      <Tabs 
        aria-label="Basic tabs" 
        defaultValue={0}
        sx={{ width: 798 }}>
      <TabList sx={{justifyContent: 'center'}}>
        <Tab>Colour Manager</Tab>
        <Tab>Theme Manager</Tab>
      </TabList>
      <TabPanel value={0}>
        <ColourManager 
              palettes = {palettes}
              setPalettes = {setPalettes}/>
      </TabPanel>
      <TabPanel value={1}>
        <ThemeManager
              theme={theme}
              setTheme={setTheme}
              palettes = {palettes} /> 
      </TabPanel>
    </Tabs>
      
    </>)
}