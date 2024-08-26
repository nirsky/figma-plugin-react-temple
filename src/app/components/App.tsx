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
import Typography from '@mui/joy/Typography';
import Stack from '@mui/joy/Stack';
import Modal from '@mui/joy/Modal';
import ModalClose from '@mui/joy/ModalClose';
import Sheet from '@mui/joy/Sheet';
import IconButton from '@mui/joy/IconButton';
import Help from '@mui/icons-material/Help';



export default function App() {
  const [theme, setTheme] = useImmer(conf.jsonStructure);
  const [palettes, setPalettes] = useState(conf.testPalettes); 
  const test = true
  return( 
    <Stack
      direction="column"
      justifyContent="space-between"
      alignItems="center"
      spacing={1}
      sx={{width: 798}}>
        <Stack
          direction="row"
          justifyContent="space-between"
          alignItems="center"
          spacing={0.1}
          sx={{width: 798}}>
            <Typography color="primary" level="h1" >Style Manager for Tableau - TEST1</Typography> 
            <HelpModal />
        </Stack>
        <Tabs 
          aria-label="Basic tabs" 
          defaultValue={0}
          sx={{ width: 798 }}>
            <TabList sx={{justifyContent: 'center'}}>
              <Tab>Colour Manager</Tab>
              {test != true ? <Tab>Theme Manager</Tab> : '' }
            </TabList>
            <TabPanel value={0}>
              <ColourManager 
                palettes = {palettes}
                setPalettes = {setPalettes}/>
            </TabPanel>
            {test != true ? 
            <TabPanel value={1}>
              <ThemeManager
                theme={theme}
                setTheme={setTheme}
                palettes = {palettes} /> 
            </TabPanel> : '' }
        </Tabs>
        <Copyright />
    </Stack>)
}


function HelpModal() {
  const [open, setOpen] = React.useState(false);
  return (<>
        <IconButton
              variant="outlined" 
              color="primary" 
              size='sm'
              onClick={() => setOpen(true)}><Help />
        </IconButton>

      <Modal
        aria-labelledby="modal-title"
        aria-describedby="modal-desc"
        open={open}
        onClose={() => setOpen(false)}
        sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}
      >
        <Sheet
          variant="outlined"
          sx={{
            maxWidth: 500,
            borderRadius: 'md',
            p: 3,
            boxShadow: 'lg',
          }}
        >
          <ModalClose variant="plain" sx={{ m: 1 }} />
          <Typography
            component="h2"
            id="modal-title"
            level="h4"
            textColor="inherit"
            fontWeight="lg"
            mb={1}
          >
            Welcome to the Style Manager for Tableau
          </Typography>
          <Typography id="modal-desc" textColor="text.tertiary">
            Learn about the Colour Manager for Tabelau and the Theme Manager for Tableau. Both together with Figma.
          </Typography>
        </Sheet>
      </Modal>
      </>
  );
}

function Copyright() {
  return(<>Colour Manager for Tableau (v3.0) was created by Alex Waleczek @ vizku.</>
    
  )
}