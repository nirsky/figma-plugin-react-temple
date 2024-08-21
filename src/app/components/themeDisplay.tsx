import React from "react"
import { useState } from 'react';
//import { useImmer } from 'use-immer'
import { SketchPicker } from 'react-color';
import Tippy from '@tippyjs/react'
import * as conf from './config';
import * as utils from './utils'






export default function ThemeManager({theme, setTheme}) {
    const [sync, setSync] = useState('false');

    window.onmessage = async (message) => { 
        const msg = message.data.pluginMessage
        if (msg.type === 'store-variable') {
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
            setSync={setSync}/>
        <Theme 
            theme={theme}
            setTheme={setTheme}
            sync={sync}/>
      </div>
      );
  }

  function ShowTheme(theme) {
    function handleOnClick() {
        console.log('theme', theme)
    }
    return (<>  
        <button onClick={handleOnClick}>
            Show Theme   
        </button>
    </>);
  }

  function Intro({theme, setTheme, sync, setSync}) {

    return (<>
                <h1>Theme Manager for Tableau</h1>
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
                <LoadFromFigma
                        theme={theme}
                        setTheme={setTheme} />
                <ShowTheme
                        theme={theme} />
    
    </>);
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
                <button onClick={handleOnClick}>
                    Download JSON
                </button>
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

    return (<>  
        <button onClick={handleOnClick}>
            {sync === true ? 'Disable Sync to Figma' : 'Enable Sync to Figma'} {sync.toString()}  
        </button>
    </>);
  }

  function LoadFromFigma({theme, setTheme}) {
    function handleOnClick() {
        const msg = ''
        parent.postMessage({ pluginMessage: { type: 'request-variables', msg: msg} }, '*')
     }

    return (<>  
        <button onClick={handleOnClick}>
            Load Settings From Figma   
        </button>
    </>);
  }

  function Theme({theme, setTheme, sync}) {
    return (
        <>
            <Meta 
                theme={theme}
                setTheme={setTheme}/>
            <table id='attributes'>
                <thead>
                    <Header/>
                </thead>
                <tbody>
                    <Settings 
                        theme={theme}
                        setTheme={setTheme}
                        sync={sync}/>
                </tbody>
            </table>
        </>
        );
  }

  function Meta({theme, setTheme}) {
    function handleOnChange(e) {
        setTheme(draft => {
            draft.theme['base-theme'] = e.target.value
          })
    }
    let options = []
    conf.baseThemes.forEach(option => {
            options.push(
                <option key={option}>{option}</option>
            )
        })
    return (
        <>
            <div className='controls'>
                <input className='themeMeta' defaultValue='New Theme'></input>
                <div className='themeMeta'>Version: {theme.theme.version}</div>
                Base Theme: 
                <select onChange={handleOnChange} value={theme.theme['base-theme']}>
                    {options}
                </select> 
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
    function handleOnChange(e) {
        setTheme(draft => {
            draft.theme.styles[style][attribute] = e.target.value
          })
          if(sync === true) {
            utils.sendToFigma(style, attribute, e.target.value)
          }
    }
    const values = conf.attributeList.find(attr => attr.attr === attribute)
    let options = [<option></option>]
    values.value.forEach(option => {
            options.push(
                <option key={option}>{option}</option>
            )
        })
    
    return (
        <>
            <select key={attribute} onChange={handleOnChange} value={theme.theme.styles.hasOwnProperty([style]) ? theme.theme.styles[style][attribute] : ''}>
                {options}
            </select> 
        </>
        );
  }

  function ColourEdit({style, attribute, theme, setTheme, sync}) {
    function handleOnChange(color) {
        setTheme(draft => {
            draft.theme.styles[style][attribute] = color.hex
          })
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
                        <SketchPicker
                            color={theme.theme.styles.hasOwnProperty([style]) ? theme.theme.styles[style][attribute] : ''}
                            disableAlpha={true}
                            onChange={handleOnChange}
                            /></>
                    }>

                <div className={theme.theme.styles[style][attribute] == '' ? 'colour transparent' : 'colour'}
                        style={{backgroundColor: theme.theme.styles.hasOwnProperty([style]) ? theme.theme.styles[style][attribute] : ''}}></div>
            </Tippy>
            <input className='colourValue' onChange={handleOnChange} value={theme.theme.styles.hasOwnProperty([style]) ? theme.theme.styles[style][attribute] : ''}></input>
        </div>
      )
  }

  function NumberEdit({style, attribute, theme, setTheme, sync}) {
    function handleOnChange(e) {
        console.log('e.target.value', e.target.value)
        setTheme(draft => {
            draft.theme.styles[style][attribute] = e.target.value
          })
        if(sync === true) {
            utils.sendToFigma(style, attribute, e.target.value)
        }
    }
    let options = [<option></option>] 
    for(let i = 1; i <=100; i++) {
        options.push(
            <option key={i}>{i}</option>
        )
    }
    
    return (
        <>
            <select onChange={handleOnChange} value={theme.theme.styles.hasOwnProperty([style]) ? theme.theme.styles[style][attribute] : ''}>
                {options}
            </select> 
        </>
        );
  }