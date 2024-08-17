import React from "react"
import { useImmer } from 'use-immer'

const jsonStructure = {
    "theme": {
      "version": 1.0,
      "name": "my theme",
      "base-theme": "Smooth",
      "styles": {
        "All": {
          "saColor": "",
          "saFontFamily": ""
        },
        "Worksheet": {
          "saFontSize": "",
          "saColor": "",
          "saFontFamily": ""
        },
        "Title": {
          "saFontFamily": "",
          "saFontSize": "",
          "saColor": ""
        },
        "Tooltip": {
          "saFontSize": "",
          "saColor": "",
          "saFontFamily": ""
        },
        "DashTitle": {
          "saFontSize": "",
          "saColor": "",
          "saFontFamily": "",
          "saFontWeight": ""
        },
        "StoryTitle": {
          "saFontFamily": "",
          "saFontSize": "",
          "saColor": ""
        },
        "Header": {
          "saColor": "",
          "saFontFamily": ""
        },
        "Legend": {
          "saFontSize": "",
          "saColor": "",
          "saFontFamily": "",
          "saBackgroundColor": ""
        },
        "LegendTitle": {
          "saFontFamily": "",
          "saFontSize": "",
          "saColor": ""
        },
        "QuickFilter": {
          "saFontSize": "",
          "saColor": "",
          "saFontFamily": "",
          "saBackgroundColor": ""
        },
        "QuickFilterTitle": {
          "saFontFamily": "",
          "saFontSize": "",
          "saColor": ""
        },
        "ParameterCtrl": {
          "saFontFamily": "",
          "saFontSize": "",
          "saColor": "",
          "saBackgroundColor": ""
        },
        "ParameterCtrlTitle": {
          "saFontFamily": "",
          "saColor": "",
          "saFontSize": ""
        },
        "DataHighlighter": {
          "saFontSize": "",
          "saColor": "",
          "saFontFamily": "",
          "saBackgroundColor": ""
        },
        "DataHighlighterTitle": {
          "saFontSize": "",
          "saFontFamily": "",
          "saColor": ""
        },
        "PageCardBody": {
          "saFontSize": "",
          "saFontFamily": ""
        },
        "Table": {
          "saBackgroundColor": ""
        },
        "Mark": {
          "saMarkColor": ""
        }
      }
    }
  }

const attributeList = [
    {name: 'Font Family', attr: 'saFontFamily', value: ['Comic Sans', 'Helvetica', 'Arial', 'Tableau Book'], type: 'STRING'},
    {name: 'Font Size', attr: 'saFontSize', value: ['8', '12', '16'], type: 'FLOAT'},
    {name: 'Font Weight', attr: 'saFontWeight', value: ['Bold', 'Semi-Bold', 'Light'], type: 'STRING'},
    {name: 'Font Colour', attr: 'saColor', type: 'COLOR'},
    {name: 'Background Colour', attr: 'saBackgroundColor', type: 'COLOR'},
    {name: 'Mark Colour', attr: 'saMarkColor', type: 'COLOR'}
  ]

const testTheme = {
    "theme": {
      "version": 1.0,
      "name": "Theme One",
      "base-theme": "Smooth",
      "styles": {
        "All": {
          "saColor": "#136595",
          "saFontFamily": "Arial"
        },
        "Worksheet": {
          "saFontSize": "12",
          "saColor": "#367928",
          "saFontFamily": "Tableau Book"
        },
        "Title": {
          "saFontFamily": "Helvetica",
          "saFontSize": "24",
          "saColor": "#138761",
          "saFontWeight": "Bold"
        },
        "Tooltip": {
          "saFontSize": "12",
          "saColor": "#216795",
          "saFontFamily": "Arial"
        }
      }
    }
  }

export default function ThemeManager() {
    const [theme, setTheme] = useImmer(testTheme.theme); 
    return (
      <div>
        <Intro />
        <Theme 
            theme={theme}
            setTheme={setTheme}/>
      </div>
      );
  }

  function Intro() {
    return (<h1>Theme Manager for Tableau</h1>);
  }

  function Theme({theme, setTheme}) {
    return (
        <>
            <div className='controls'>
                <input className='themeMeta' defaultValue='New Theme'></input>
                <div className='themeMeta'>Version: {theme.version}</div>
                <div className='themeMeta'>Base Theme: {theme.name}</div>
            </div>
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

  function Header(theme, setTheme) {
    let columns = []
    attributeList.forEach(attr => {
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
    const styleKeys = Object.keys(jsonStructure.theme.styles);
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
    
    attributeList.forEach(attr => {
        let output
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
    const values = attributeList.find(attr => attr.attr === attribute)
    let options = [<option></option>]
    values.value.forEach(option => {
            options.push(
                <option key={option}>{option}</option>
            )
        })
    
    return (
        <>
            <select key={attribute} defaultValue={theme.styles.hasOwnProperty([style]) ? theme.styles[style][attribute] : ''}>
                {options}
            </select> 
        </>
        );
  }

  function ColourEdit({style, attribute, theme, setTheme}) {
    return(
        <div key={attribute} className="clr-field" style={{color: theme.styles.hasOwnProperty([style]) ? theme.styles[style][attribute] : ''}}>
          <input type="text" className="coloris colourField" defaultValue={theme.styles.hasOwnProperty([style]) ? theme.styles[style][attribute] : ''} readOnly data-coloris></input>
          <button type="button" aria-labelledby="clr-open-label"></button>
        </div>
      )
  }

  function NumberEdit({style, attribute, theme, setTheme}) {
    let options = [<option></option>] 
    for(let i = 0; i <=100; i++) {
        options.push(
            <option key={i}>{i}</option>
        )
    }
    return (
        <>
            <select defaultValue={theme.styles.hasOwnProperty([style]) ? theme.styles[style][attribute] : ''}>
                {options}
            </select> 
        </>
        );
  }