import React from "react"
import { useState } from 'react';
import { useImmer } from 'use-immer'
import { parseColours, parseXML, generateUUID } from './utils'
import chroma from "chroma-js"


const controls = [/*{
        "type": 'edit', 
        "name": 'edit', 
        "position": '1', 
        "tooltip": 'Edit Palette'
      }, 
      {
        "type": 'link', 
        "name": 'link', 
        "position": '2', 
        "tooltip": 'Create Linked Palettes'
      }, */
      {
        "type": 'swap', 
        "name": 'swap_horiz', 
        "position": '3', 
        "tooltip": 'Reveres Palette'
      }, 
      {
        "type": 'up', 
        "name": 'arrow_upward', 
        "position": '4', 
        "tooltip": 'Move Palette one up'
      }, 
      {
        "type": 'down', 
        "name": 'arrow_downward', 
        "position": '5', 
        "tooltip": 'Move Palette one down'
      }, 
      {
        "type": 'delete', 
        "name": 'delete', 
        "position": '6', 
        "tooltip": 'Delete Palette'
      }]

 const testPalettes = [
  {
  "meta": {
      "title": 'palette 1',
      "type": 'regular',
      "seed": ['123456'],
      "comment": 'Thise is a test comment'
      },  
  "colours": [{"value": '#ff074e', "id": '123'}, {"value": '#fabcde', "id": '456789'}]
  },
  {
  "meta": {
      "title": 'palette 2',
      "type": 'ordered-sequential',
      "seed": ['123456'],
      "comment": 'Thise is a test comment'
  },  
  "colours": [{"value": '#763916', "id": '123456'}, {"value": '#96fe11', "id": '456789'}]
  },
  {
  "meta": {
      "title": 'palette 3',
      "type": 'ordered-diverging',
      "seed": ['384321'],
      "comment": 'Thise is a test comment'
  },
  "colours": [{"value": '#369852', "id": '46548'}, {"value": '#153874', "id": '318494'}]
  }
]     

function Intro (palettes, setPalettes) {
  function handleOnFileChange(e) {
    e.preventDefault();

    const file = e.target.files[0];
    const reader = new FileReader();
    let newPalettes = []
    let xml = []

    if (!file) return;

    reader.readAsText(file);
    reader.onload = function() {
        xml = parseXML(reader.result);
        newPalettes = palettes.palettes.slice().concat(xml)
        palettes.setPalettes(newPalettes)
    };
  }

  return(
    <>
      <h1>Colour Manager for Tableau</h1>
        <div>
          <h2>Upload your preferences.tps (optional)</h2>
          <div>
              <p>Or add palettes below if you start from scratch.</p>
              <p>You can find it in: C:\Users\..\Documents\My Tableau Repository.</p>
              <p>For more details on what this tool is doing, visit <a href="https://help.tableau.com/current/pro/desktop/en-us/formatting_create_custom_colors.htm">the Tableau Knowledge Base</a></p>
          </div>
          <form id="upload">
              <input type="file" id="file" accept=".tps" onChange={handleOnFileChange}></input>
          </form>
      </div>
    </>
  );
}

function ColourActive({colour}){
  return(
    <div className="clr-field" style={{color: colour}}>
      <button type="button" aria-labelledby="clr-open-label"></button>
      <input type="text" className="coloris colourField" value={colour} data-coloris></input>
    </div>
  )
}

function Colours({colours}){
  const rows = []
  colours.forEach((colour) => {
    rows.push( 
        <ColourActive 
            colour = {colour.value}
            key = {colour.value}/>
    )
  })
  return(
      <div className="colours">
          {rows}
      </div>
  )
}
  
function Control({index, control, palette, setPalette, palettes, setPalettes}){
  function handleOnClick() {
    switch  (control.type) {
      case 'edit':
        console.log('edit')
        break;
      case 'link':
        console.log('link')
        break;
      case 'swap':
        setPalette(draft => {
          draft.colours = palette.colours.toReversed()
        })
        break;
      case 'up':
        if (index <= 0 || index > palettes.length - 1) {
          console.log('Cannot be moved up')
        } else {
          let newPalettes = palettes.slice()
          const element = newPalettes.splice(index, 1)[0];
          newPalettes.splice(index - 1, 0, element);
          setPalettes(newPalettes)
        }
        break;
      case 'down':
        if (index < 0 || index >= palettes.length - 1) {
          console.log('Cannot be moved down')
        } else {
          let newPalettes = palettes.slice()
          const element = newPalettes.splice(index, 1)[0];
          newPalettes.splice(index + 1, 0, element);
          setPalettes(newPalettes)
        }
        break;
      case 'delete':
        let newPalettes = palettes.slice()
        newPalettes.splice(index, 1)
        setPalettes(newPalettes)
        break;
    }
  }
  
  return(
      <div className="control">
          <i 
            className="material-symbols-outlined"
            title={control.tooltip} 
            onClick={handleOnClick} >
            {control.name}</i>
      </div>
  )
}
  
function Controls({index, palette, setPalette, palettes, setPalettes}){
  const rows = []
  controls.forEach((control) => {
      rows.push(
          <Control 
              index = {index}
              control = {control}
              key = {control.name}
              palette = {palette}
              setPalette = {setPalette}
              palettes = {palettes}
              setPalettes = {setPalettes} />
      )
  })

  return(
      <div className="controls">
          {rows}
      </div>
  )
}
  
function Meta({index, meta, palette, setPalette, palettes, setPalettes}){
  function handleInputChange(e) {
    
    setPalette(draft => {
      draft.meta.title = e.target.value;
    })
  }
  return(
      <div className="meta">
          <input 
            type="text" 
            className="title" 
            value={meta.title}
            onChange={handleInputChange}></input>
          <div className="type">{meta.type}</div>
          <Controls 
            index = {index}
            palette = {palette}
            setPalette = {setPalette}
            palettes = {palettes}
            setPalettes = {setPalettes}/>
      </div>
  )
}
  
function Palette({paletteContent, index, palettes, setPalettes}){
  const [palette, setPalette] = useImmer(paletteContent);
  return(
      <div className="palette">
          <Meta 
            index = {index}
            meta = {palette.meta}
            palette = {palette}
            setPalette = {setPalette}
            palettes = {palettes}
            setPalettes = {setPalettes}/>
          <Colours colours = {palette.colours}/>
      </div>
  )
}
  
function Palettes ( {palettes, setPalettes}) {
    const rows = []
    palettes.forEach((palette, index) => {
        rows.push(
            <Palette 
                paletteContent = {palette}
                index = {index}
                key = {palette.meta.title} 
                palettes = {palettes}
                setPalettes = {setPalettes}/>
        )
    })
    return (<>{rows}</>);
}

function ColourSelect({colour, colours, setColours}){
  function handleOnClick() { 
    let newColours = colours.slice()
      newColours[colour.index].selected = !colour.selected
      setColours(newColours)
  }
  let selected = ''
  if (colour.selected === true) {
    selected = 'check'
  } else {
    selected = ''
  }
  let textcolour = ''
  if (chroma.contrast(colour.value, '#ffffff') < 4.5 ) {
    textcolour = '#000000'
  } else {
    textcolour = '#ffffff'
  }

  return(
        <div className="colourfield" style={{backgroundColor: colour.value, color: textcolour}} onClick={handleOnClick}>
          <i className='material-symbols-outlined'>{selected}</i>
        </div>
  )
}

function AddButtons({colours, palettes, setPalettes}) {
  function handleOnCategoricalClick () {
    const selectedItems = colours.filter(element => element.selected === true);
    const selectedColours = selectedItems.map(element => {
      return {
          value: element.value,
          id: generateUUID()
      };
    });
    console.log('selectedColours', )

    let palette = {
      meta: {
          title: 'Categorical',
          type: 'regular',
          seed: [],
          comment: '',
      },
      colours: selectedColours
    };
    let newPalettes = palettes.slice()
    newPalettes.push(palette)
    setPalettes(newPalettes)
  }

  return(<>
          <p>
            <button>Create Everything</button>
          </p>
          <p>
            <button onClick={handleOnCategoricalClick}>Categorical Palette</button>
            <button id="create-sequential">Sequential Palette</button>
          </p>  
          <p>
            <button id="create-diverging">Diverging Palette (bright)</button>  
            <button id="create-diverging-tableau">Diverging Palette (dark)</button>  
          </p>
      </>
  )
}
  
function AddPalettes({palettes, setPalettes}) {
  const [colours, setColours] = useState([]);
  function handleOnChange(e) {
    let newColours = []
    const parsedColours = parseColours(e.target.value)
    parsedColours.forEach((parsedColour, index) => {
      newColours.push(
        {
          value: parsedColour,
          selected: false,
          index: index
        }
      )
    }) 
    setColours(newColours)
  }

  const rows = []
  colours.forEach((colour, index) => {
      rows.push(
          <ColourSelect 
              colour = {colour}
              key = {index}
              colours = {colours}
              setColours = {setColours} />
      )
  })

  return (
    <div>
              <textarea id="colourstring" placeholder="eg.: https://coolors.co/fb5012-#01fdf6 (cbbaed,#e9df00)#03fcba" onInput={handleOnChange} onLoad={handleOnChange} defaultValue='https://coolors.co/01161e-8dadb9-124559-e9e3e6-c4d6b0'></textarea>
              <div>You can insert any text with hexcodes, no need to clean them up. All found colours are displayed below.</div>
              <div className="colours">{rows}</div>
              <div>Select the coloured boxes above to create palettes</div>
                  <AddButtons colours = {colours} palettes = {palettes} setPalettes = {setPalettes} />
          </div>
    );
}

export default function ColourManager() {
  const [palettes, setPalettes] = useState(testPalettes);
  return (
    <div>
      <Intro 
          palettes = {palettes}
          setPalettes = {setPalettes}/>
      <Palettes
          palettes = {palettes}
          setPalettes = {setPalettes}/>
      <AddPalettes
          palettes = {palettes}
          setPalettes = {setPalettes}/>
    </div>
    );
}
