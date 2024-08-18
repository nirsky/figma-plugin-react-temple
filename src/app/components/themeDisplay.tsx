import React from "react"
import { useState } from 'react';
import { useImmer } from 'use-immer'
import { SketchPicker } from 'react-color';
import Tippy from '@tippyjs/react'
import * as conf from './config';
import * as utils from './utils'


export default function ThemeManager() {
    const [theme, setTheme] = useImmer(conf.jsonStructure); 
    return (
      <div>
        <Intro 
            theme={theme}
            setTheme={setTheme}/>
        <Theme 
            theme={theme}
            setTheme={setTheme}/>
      </div>
      );
  }

  

  function Intro({theme, setTheme}) {

    return (<>
                <h1>Theme Manager for Tableau</h1>
                <UploadJSON 
                        theme={theme}
                        setTheme={setTheme} />
                <DownloadJSON 
                        theme={theme}
                        setTheme={setTheme} />
    
    </>);
  }

  function UploadJSON({theme, setTheme}) {
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

  function DownloadJSON({theme, setTheme}) {
  
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

  function Theme({theme, setTheme}) {
    return (
        <>
            <Meta 
                theme={theme}
                setTheme={setTheme}/>
            <table id='attributes'>
                <thead>
                    <Header 
                        theme={theme}
                        setTheme={setTheme}/>
                </thead>
                <tbody>
                    <Settings 
                        theme={theme}
                        setTheme={setTheme}/>
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

  function Header(theme, setTheme) {
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

  function Settings({theme, setTheme}) {
    const styleKeys = Object.keys(conf.jsonStructure.theme.styles);
    let rows = []
    styleKeys.forEach(style => {
        rows.push(
            <Setting 
                style={style}
                key={style}
                theme={theme}
                setTheme={setTheme}/>
        )
    })
    return (<>{rows}</>); 
  }

  function Setting({style, theme, setTheme}) {
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
                                    setTheme={setTheme} />
                    break;
                    case 'STRING':
                        output = <StringEdit 
                                    style={style}
                                    attribute={attr.attr}
                                    theme={theme}
                                    setTheme={setTheme} />
                    break;
                    case 'FLOAT':
                        output = <NumberEdit
                                    style={style} 
                                    attribute={attr.attr}
                                    theme={theme}
                                    setTheme={setTheme} />
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

  function StringEdit({style, attribute, theme, setTheme}) {
    function handleOnChange(e) {

        setTheme(draft => {
            draft.theme.styles[style][attribute] = e.target.value
          })
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

 /* function ColourEdit({style, attribute, theme, setTheme}) {

    return(
        <div key={attribute} className="clr-field" style={{color: theme.styles.hasOwnProperty([style]) ? theme.styles[style][attribute] : ''}}>
          <input type="text" className="coloris colourField" defaultValue={theme.styles.hasOwnProperty([style]) ? theme.styles[style][attribute] : ''} readOnly data-coloris></input>
          <button type="button" aria-labelledby="clr-open-label"></button>
        </div>
      )
  }*/

  function ColourEdit({style, attribute, theme, setTheme}) {
    function handleOnChange(e) {
        setTheme(draft => {
            draft.theme.styles[style][attribute] = e.target.value
          })
    }
    return(<div className='controls'>
            <Tippy interactive={true}
                placement='left'
                duration={0}
                arrow={false}
                    content={
                        <SketchPicker
                            color={theme.theme.styles.hasOwnProperty([style]) ? theme.theme.styles[style][attribute] : ''}
                            onChange={color => setTheme(draft => {
                                draft.theme.styles[style][attribute] = color.hex
                              })}
                            />
                    }>

                <div className={theme.theme.styles[style][attribute] == '' ? 'colour transparent' : 'colour'}
                        style={{backgroundColor: theme.theme.styles.hasOwnProperty([style]) ? theme.theme.styles[style][attribute] : ''}}></div>
            </Tippy>
            <input className='colourValue' onChange={handleOnChange} value={theme.theme.styles.hasOwnProperty([style]) ? theme.theme.styles[style][attribute] : ''}></input>
        </div>
      )
  }

  function NumberEdit({style, attribute, theme, setTheme}) {
    function handleOnChange(e) {
        setTheme(draft => {
            draft.theme.styles[style][attribute] = e.target.value
          })
    }
    let options = [<option></option>] 
    for(let i = 0; i <=100; i++) {
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