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
      <div>
        <Intro 
            theme={theme}
            setTheme={setTheme}
            sync={sync}
            setSync={setSync} />
        <Theme 
            theme={theme}
            setTheme={setTheme}
            sync={sync}
            palettes={palettes}/>
      </div>
      );
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

  function Intro({theme, setTheme, sync, setSync}) {

    return (<>
                <Typography color="primary" level="h1" >Theme Manager for Tableau</Typography>
                <UploadJSON 
                        theme={theme}
                        setTheme={setTheme}
                        sync={sync} />
                <DownloadJSON 
                        theme={theme} />
                <SyncToFigma
                        theme={theme}
                        sync={sync}
                        setSync={setSync} />
                <LoadFromFigma />
                <ShowTheme
                        theme={theme} />
                        

    </>);
  }

  function SelectPalette({palettes}) {
    function handleOnChange() {

    }
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
                    value={palette.meta.title} > 
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

    return (<>
                <form id="upload">
                    <label htmlFor="file" className="uploadButton">
                        Upload Theme.json
                    </label>
                    <input type="file" id="file" accept=".json" onChange={handleOnFileChange}></input>
                    {error && <p style={{ color: 'red' }}>{error}</p>}
                </form>
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
                    size="sm" 
                    onClick={handleOnClick}>
                    Download JSON
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

    return (<> Sync to Figma: 
        <Switch
            checked={sync}
            onChange={handleOnClick}
            sx={{
                "--Switch-trackWidth": "48px"
              }}
            />
    </>);
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
            Load Settings From Figma   
        </Button>
    </>);
  }

  function Theme({theme, setTheme, sync, palettes}) {
    return (
        <>
            <Meta 
                theme={theme}
                setTheme={setTheme}
                palettes={palettes}/>
            <Sheet sx={{ height: 300, overflow: 'auto' }}>
            <Table
                borderAxis="xBetween"
                color="neutral"
                size="sm"
                stickyHeader
                variant="plain" 
                id='attributes'
                sx={{ '& thead th:nth-child(3)': { width: '64px' },
                      '& thead th:nth-child(4)': { width: '96px' },
                      '& thead th:nth-child(5)': { width: '96px' },
                      '& thead th:nth-child(6)': { width: '96px' },
                      '& thead th:nth-child(7)': { width: '96px' }}}>
                <thead>
                    <Header/>
                </thead>
                <tbody>
                    <Settings 
                        theme={theme}
                        setTheme={setTheme}
                        sync={sync}/>
                </tbody>
            </Table>
            </Sheet>
        </>
        );
  }

  function Meta({theme, setTheme, palettes}) {
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
            <div className='controls'>
                <Input 
                    color="primary"
                    size="sm"
                    defaultValue='New Theme'></Input>
                <div className='themeMeta'>Version: {theme.theme.version}</div>
                Base Theme: 
                <Select 
                    size="sm"
                    color="primary"
                    onChange={handleOnChange} 
                    value={theme.theme['base-theme']}>
                    {options}
                </Select> 
                
                <SelectPalette
                        palettes={palettes} />
            </div>
        </>
        );
  }

  function Header() {
    let columns = []
    conf.attributeList.forEach(attr => {
        columns.push(
          <th key={attr.name}>{attr.name}</th>
      )
  })

    return (
        <tr>
          <th>Settings</th>
          {columns}
        </tr>
        );
  }

  function Settings({theme, setTheme, sync}) {
    const styleKeys = Object.keys(conf.jsonStructure.theme.styles);
    let rows = []
    styleKeys.forEach(style => {
        rows.push(
            <Setting 
                style={style}
                key={style}
                theme={theme}
                setTheme={setTheme}
                sync={sync}/>
        )
    })
    return (<>{rows}</>); 
  }

  function Setting({style, theme, setTheme, sync}) {
    let columns = []
    
    conf.attributeList.forEach(attr => {
        let output
            if(conf.jsonStructure.theme.styles[style].hasOwnProperty([attr.attr])) {
                switch (attr.type) {
                    case 'COLOR':
                        output = <ColourEdit 
                                    style={style}
                                    attribute={attr.attr}
                                    theme={theme}
                                    setTheme={setTheme}
                                    sync={sync}/>
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
            //output = theme.styles[style][attr.attr]
        columns.push(
          <td key={attr.attr}>{output}</td>
      )
  })

    return (
        <tr>
            <td>{style}</td>
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
                value={theme.theme.styles[style][attribute]}
                defaultValue=''>
                {options}
            </Select> 
        </>
        );
  }

  function ColourEdit({style, attribute, theme, setTheme, sync}) {
    const [colour, setColour] = useState(theme.theme.styles[style][attribute]);
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
                            color={theme.theme.styles.hasOwnProperty([style]) ? theme.theme.styles[style][attribute] : ''}
                            disableAlpha={true}
                            onChange={handleOnChange}
                            /></>
                    }>

                <div className={theme.theme.styles[style][attribute] == '' ? 'colour transparent' : 'colour'}
                        style={{backgroundColor: theme.theme.styles[style][attribute]}}></div>
            </Tippy>
            <Input 
                color="primary"
                size="sm"
                onChange={handleOnChange} 
                value={theme.theme.styles[style][attribute]}></Input>
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
    for(let i = 1; i <=100; i++) {
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
                value={theme.theme.styles[style][attribute]}
                defaultValue=''>
                {options}
            </Select>
        </>
        );
  }