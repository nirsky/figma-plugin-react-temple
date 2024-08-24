import React from "react"
import { useState } from 'react';
import Tippy from '@tippyjs/react'
import * as conf from './config';
import * as utils from './utils'
import Sketch from '@uiw/react-color-sketch';
import Select from '@mui/joy/Select';
import Option from '@mui/joy/Option';
import Switch from '@mui/joy/Switch';
import Button from '@mui/joy/Button';
import Input from '@mui/joy/Input';
import Table from '@mui/joy/Table';
import Typography from '@mui/joy/Typography';
import Sheet from '@mui/joy/Sheet';
import Tabs from '@mui/joy/Tabs';
import TabList from '@mui/joy/TabList';
import Tab from '@mui/joy/Tab';
import TabPanel from '@mui/joy/TabPanel';
import Upload from '@mui/icons-material/Upload';
import Download from '@mui/icons-material/Download';
import { styled } from '@mui/joy';
import ButtonGroup from '@mui/joy/ButtonGroup';
import Stack from '@mui/joy/Stack';
import Divider from '@mui/joy/Divider';

import { SwatchPresetColor } from '@uiw/react-color-swatch';

export default function ThemeManager({theme, setTheme, palettes}) {
    const [sync, setSync] = useState(false);

    window.onmessage = async (message) => { 
        const msg = message.data.pluginMessage
        if (msg && msg.type === 'store-variable') {
            setTheme(draft => {
                draft.theme.styles[msg.style.style][msg.style.attribute] = msg.style.value
              })
          }
    }

    return (
        <Stack
            direction="column"
            justifyContent="space-between"
            alignItems="flex-start"
            spacing={2}
            divider={<Divider orientation="horizontal" />}>
            <Intro 
                theme={theme}
                setTheme={setTheme}
                sync={sync}
                setSync={setSync}/>
            <Theme 
                theme={theme}
                setTheme={setTheme}
                sync={sync}
                palettes={palettes}/>
      </Stack>
      );
  }

  function Intro({theme, setTheme, sync, setSync}) {

    return (<Stack
                direction="row"
                justifyContent="space-between"
                alignItems="flex-start"
                spacing={2}
                divider={<Divider orientation="vertical" />}>
                    <ButtonGroup
                        color="primary"
                        orientation="horizontal"
                        size="sm"
                        variant="solid">
                            <UploadJSON 
                                    theme={theme}
                                    setTheme={setTheme}
                                    sync={sync} />
                            <DownloadJSON 
                                    theme={theme} />
                    </ButtonGroup>
                    <Stack
                        direction="row"
                        justifyContent="flex-end"
                        alignItems="flex-start"
                        spacing={2}
                        divider={<Divider orientation="vertical" />}>
                            <SyncToFigma
                                    theme={theme}
                                    sync={sync}
                                    setSync={setSync} />
                            <LoadFromFigma />
                    </Stack>
                </Stack>
    );//<ShowTheme theme={theme} />                     
  }

  function UploadJSON({theme, setTheme, sync}) {
    const [error, setError] = useState('');
    const handleOnFileChange = (event) => {
        const file = event.target.files[0];
    
        if (file) {
          const reader = new FileReader();
            reader.onload = (e) => {
                // Type guard to ensure the result is a string
                const result = e.target.result;
                if (typeof result === 'string') {
                    try {
                        const parsedData = JSON.parse(result);
                        setTheme(draft => {draft.theme = {
                                                ...draft.theme,
                                                ...parsedData.theme,
                                                styles: {
                                                ...draft.theme.styles,
                                                ...parsedData.theme.styles,
                                                },
                                            };
                                        }
                        )
                        
                        setError('');
                    } catch (error) {
                        setError('Error parsing JSON file');
                    }
                } else {
                    setError('Error: File content is not a string');
                }
            };
          reader.readAsText(file);
        }

    };

    if (sync === true ) {
        utils.loopStyles(theme)
    } 

    const VisuallyHiddenInput = styled('input')`
    clip: rect(0 0 0 0);
    clip-path: inset(50%);
    height: 1px;
    overflow: hidden;
    position: absolute;
    bottom: 0;
    left: 0;
    white-space: nowrap;
    width: 1px;
  `;

    return (<> <Button 
                    component='label'
                    startDecorator={<Upload />} >
                        Upload 
                        <VisuallyHiddenInput type="file" onChange={handleOnFileChange} />
                </Button>
    </>);
  }

  function DownloadJSON({theme}) {
  
      const handleOnClick = () => {
        const jsonString = JSON.stringify(theme, null, 2); // Convert object to JSON string with indentation
        const blob = new Blob([jsonString], { type: "application/json" });
        const url = URL.createObjectURL(blob);
    
        // Create a link element, set href and download attributes, then trigger click
        const link = document.createElement('a');
        link.href = url;
        link.download = 'data.json';
        link.click();
    
        // Clean up and revoke object URL
        URL.revokeObjectURL(url);
      };

    return (<>  
                <Button
                    onClick={handleOnClick}
                    startDecorator={<Download />}>
                    Download
                </Button>
            </>);
  }

  function SyncToFigma({theme, sync, setSync}) {
    function handleOnClick() {
        if (sync === true ) {
            setSync(false)
        } else {
            setSync(true)
            utils.loopStyles(theme)
        } 
     }

    return ( <Stack
                    direction="row"
                    justifyContent="center"
                    alignItems="flex-start"
                    spacing={1}>
        <Sheet>Sync to Figma: </Sheet>
        
        <Switch
            checked={sync}
            onChange={handleOnClick}
            sx={{
                "--Switch-trackWidth": "48px"
              }}
            />
    </Stack>);
  }

  function LoadFromFigma() {
    function handleOnClick() {
        const msg = ''
        parent.postMessage({ pluginMessage: { type: 'request-variables', msg: msg} }, '*')
     }

    return (<>  
        <Button
            size="sm"  
            onClick={handleOnClick}>
            Load From Figma   
        </Button>
    </>);
  }
  
  function ShowTheme({theme}) {
    function handleOnClick() {
        console.log('theme', theme)
    }
    return (<>  
        <Button 
            size="sm"
            onClick={handleOnClick}>
            Show Theme   
        </Button>
    </>);
  }

  function Theme({theme, setTheme, sync, palettes}) {
    
    const [palette, setPalette] = useState([])
    let rows = []
    let tabs = []
    conf.styleSections.forEach((sectionName, index) => {
        tabs.push(<Tab key={sectionName.section}>{sectionName.section}</Tab>)
        rows.push(
            <TabPanel value={index} key={index}>
                <Section 
                    sectionName={sectionName.section}
                    theme={theme}
                    setTheme={setTheme}
                    sync={sync}
                    palette={palette} /> 
            </TabPanel>
        )
    })


    return (
        <>
            <Meta 
                theme={theme}
                setTheme={setTheme}
                palettes={palettes}
                setPalette={setPalette}/>
            <Sheet sx={{ height: 300, overflow: 'auto' }}>
            

    <Tabs 
        aria-label="Basic tabs" 
        defaultValue={0}
        sx={{ width: 725 }}>
      <TabList  sticky='top' 
                sx={{justifyContent: 'center'}}>
        {tabs}
      </TabList>
      {rows}
    </Tabs>

            </Sheet>
        </>
        );
  }

  function Meta({theme, setTheme, palettes, setPalette}) {
    function handleOnChange(e) {
        setTheme(draft => {
            draft.theme['base-theme'] = e.target.value
          })
    }
    let options = []
    conf.baseThemes.forEach(option => {
            options.push(
                <Option 
                    key={option}
                    value={option}>{option}</Option>
            )
        })
    return (
        <>
            <Stack
                direction="row"
                justifyContent="space-between"
                alignItems="flex-start"
                spacing={2}
                divider={<Divider orientation="vertical" />}>
                <Input 
                    color="primary"
                    size="sm"
                    defaultValue='New Theme'></Input>
                <Sheet>Version: {theme.version}</Sheet>
                <Stack
                    direction="row"
                    justifyContent="center"
                    alignItems="flex-start"
                    spacing={1}>
                    <Sheet>Base Theme:</Sheet>
                    <Select 
                        size="sm"
                        color="primary"
                        onChange={handleOnChange} 
                        value={theme['base-theme']}>
                        {options}
                    </Select> 
                </Stack>
                <SelectPalette
                        palettes={palettes}
                        setPalette={setPalette} />
            </Stack>
        </>
        );
  }

  function SelectPalette({palettes, setPalette}) {
    const handleOnChange = (event, newValue) => {
        const palette = palettes.find(palette => palette.meta.id === newValue);
        setPalette(palette.colours.map(colour => colour.value))
      };
    let options = [<Option key='thisisakey' value=''></Option>] 
    
    palettes.forEach(palette => {
        let colours = []
        palette.colours.forEach(colour => {
            colours.push(<div className='colourSmall' 
                            key={colour.value}
                style={{backgroundColor: colour.value}}></div>)
        })
        options.push(
            <Option key={palette.meta.id}
                    value={palette.meta.id} > 
                <div className='paletteDropdown'>
                    <div className='paletteTitle' >{palette.meta.title}</div>
                    <div className='paletteContent' >{colours}</div>
                </div>
            </Option>
        )
    });
    
    return (
        <>
            <Select onChange={handleOnChange} 
                    defaultValue=''
                    placeholder="Select Palette"
                    color="primary"
                    size="sm"
                    variant="outlined"
                    sx={{ width: 240 }}
                    >
                {options}
            </Select> 
        </>
        );
  }

  function Section({sectionName, theme, setTheme, sync, palette}) {

    const section = utils.getSectionDetails(sectionName, theme)
  
  
  return( <Table
      borderAxis="xBetween"
      color="neutral"
      size="sm"
      variant="plain" 
      id='attributes'
      sx={{ 
            mt: 0}}>
      <thead>
          <Header
                  section={section}/>
      </thead>
      <tbody>
          <Settings 
              section={section}
              theme={theme}
              setTheme={setTheme}
              sync={sync}
              palette={palette}/>
      </tbody>
  </Table>)
  }

  function Header({section}) {

    let columns = []
    section.attributes.forEach(key => {
        //const styleObjects = key.attributes.map(attr => conf.attributeList || {});
        const item = conf.attributeList.find(item => item.attr === key);
        const attrName = item ? item.name : null;
        columns.push(
            <th key={attrName}>{attrName}</th>
        )
    })
    return (
        <tr>
          <th>Settings</th>
          {columns}
        </tr>
        );
  }

  function Settings({section, theme, setTheme, sync, palette}) {
    
    let rows = []
    section.styles.forEach(style => {
        rows.push(
            <Setting 
                section={section}
                style={style}
                key={style}
                theme={theme}
                setTheme={setTheme}
                sync={sync}
                palette={palette}/>
        )
    })
    return (<>{rows}</>); 
  }

  function Setting({section, style, theme, setTheme, sync, palette}) {
    let columns = []
    section.attributes.forEach(key => {
        console.log('section', section)
        console.log('key', key)
        console.log('style', style)
        const attr = conf.attributeList.find(item => item.attr === key);
        console.log('attr', attr)
        let output
        console.log('conf.jsonStructure', conf.jsonStructure)
        console.log('conf.jsonStructure.styles', conf.jsonStructure.styles)
        console.log('conf.jsonStructure.styles[style]', conf.jsonStructure.styles[style])
            if(conf.jsonStructure.styles[style].hasOwnProperty([attr.attr])) {
                console.log('test')
                switch (attr.type) {
                    case 'COLOR':
                        output = <ColourEdit 
                                    style={style}
                                    attribute={attr.attr}
                                    theme={theme}
                                    setTheme={setTheme}
                                    sync={sync}
                                    palette={palette}/>
                    break;
                    case 'STRING':
                        output = <StringEdit 
                                    style={style}
                                    attribute={attr.attr}
                                    theme={theme}
                                    setTheme={setTheme} 
                                    sync={sync}/>
                    break;
                    case 'FLOAT':
                        output = <NumberEdit
                                    style={style} 
                                    attribute={attr.attr}
                                    theme={theme}
                                    setTheme={setTheme}
                                    sync={sync}/>
                    break;
                }
            }
            
        console.log('output', output)
            //output = theme.styles[style][attr.attr]
        columns.push(
          <td key={attr.attr}>{output}</td>
      )
  })

    return (
        <tr>
            <td key={style}>{style}</td>
            {columns}
        </tr>
        );
  }

  function StringEdit({style, attribute, theme, setTheme, sync}) {
    const handleOnChange = (event, newValue) => {
        setTheme(draft => {
            draft.theme.styles[style][attribute] = newValue
          })
          if(sync === true) {
            utils.sendToFigma(style, attribute, newValue)
          }
    }

    const values = conf.attributeList.find(attr => attr.attr === attribute)
    let options = [<Option 
                        key='thisisakey'
                        value=''></Option>]
    values.value.forEach(option => {
            options.push(
                <Option 
                    key={option}
                    value={option}>{option}</Option>
            )
        })
    
    return (
        <>
            <Select
                color="primary"
                size="sm" 
                onChange={handleOnChange} 
                value={theme.styles[style][attribute]}
                defaultValue=''>
                {options}
            </Select> 
        </>
        );
  }

  function ColourEdit({style, attribute, theme, setTheme, sync, palette}) {
    const [colour, setColour] = useState(theme.styles[style][attribute]);
    function handleOnChange(color) {
        setTheme(draft => {
            draft.theme.styles[style][attribute] = color.hex
          })
        setColour(color.hex)
        if(sync === true) {
            utils.sendToFigma(style, attribute, color.hex)
        }
    }

    return(<div className='controls'>
            <Tippy interactive={true}
                placement='left'
                duration={0}
                arrow={false}
                    content={<>
                        <Sketch
                            color={theme.styles.hasOwnProperty([style]) ? theme.styles[style][attribute] : ''}
                            disableAlpha={true}
                            onChange={handleOnChange}
                            presetColors={palette}
                            /></>
                    }>

                <div className={theme.styles[style][attribute] == '' ? 'colour transparent' : 'colour'}
                        style={{backgroundColor: theme.styles[style][attribute]}}></div>
            </Tippy>
            <Input 
                color="primary"
                size="sm"
                onChange={handleOnChange} 
                value={theme.styles[style][attribute]}></Input>
        </div>
      )
  }

  function NumberEdit({style, attribute, theme, setTheme, sync}) {
    const handleOnChange = (event, newValue) => {
        setTheme(draft => {
            draft.theme.styles[style][attribute] = newValue
          })
          if(sync === true) {
            utils.sendToFigma(style, attribute, newValue)
          }
    }
    let options = [<Option 
                        key='thisisakey'
                        value=''></Option>] 
    for(let i = 1; i <=99; i++) {
        options.push(
            <Option 
                key={utils.generateUUID()}
                value={i}>{i}</Option>
        )
    }
    
    return (
        <>
            <Select
                color="primary"
                size="sm" 
                onChange={handleOnChange} 
                value={theme.styles[style][attribute]}
                defaultValue=''>
                {options}
            </Select>
        </>
        );
  }