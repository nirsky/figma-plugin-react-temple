import React from "react"
import { useState } from 'react';
import { useImmer } from 'use-immer'
import { parseXML } from './fileHandle'


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

function Intro (palettes, setPalettes) {
  console.log('palettes Intro', palettes)
  console.log('setPalettes Intro', setPalettes)
  function handleOnFileChange(e) {
    e.preventDefault();

    const file = e.target.files[0];
    const reader = new FileReader();
    let newPalettes = []
    let xml = []

    if (!file) return;

    console.log('file', file)
    reader.readAsText(file);
    reader.onload = function() {
        xml = parseXML(reader.result);
        console.log('xml', xml)
        newPalettes = palettes.palettes.slice().concat(xml)
        console.log('newPalettes', newPalettes)
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


function Colour({colour}){
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
        <Colour 
        colour = {colour.value}
            key = {colour.value} />
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
  //console.log('palette', palette)
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
  
  console.log('palettes Palettes', palettes)
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
    return (
      <>
        {rows}
      </>
      );
  
  }

  function AddPalettes() {
    return (
      <div>
        Add palettes
      </div>
      );
  }

  export default function ColourManager() {
    const [palettes, setPalettes] = useState([
      {
      "meta": {
          "title": 'palette 1',
          "type": 'categorical',
          "seed": ['123456'],
          "comment": 'Thise is a test comment',
          "controls": [{
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
          }, 
          {
            "type": 'swap', 
            "name": 'swap_horiz', 
            "position": '2', 
            "tooltip": 'Reveres Palette'
          }, 
          {
            "type": 'up', 
            "name": 'arrow_upward', 
            "position": '2', 
            "tooltip": 'Move Palette one up'
          }, 
          {
            "type": 'down', 
            "name": 'arrow_downward', 
            "position": '2', 
            "tooltip": 'Move Palette one down'
          }, 
          {
            "type": 'delete', 
            "name": 'delete', 
            "position": '2', 
            "tooltip": 'Delete Palette'
          }]
          },  
      "colours": [{"value": '#ff074e', "id": '123'}, {"value": '#fabcde', "id": '456789'}]
      },
      {
      "meta": {
          "title": 'palette 2',
          "type": 'sequential',
          "seed": ['123456'],
          "comment": 'Thise is a test comment',
          "controls": [{
            "type": 'swap', 
            "name": 'swap_horiz', 
            "position": '2', 
            "tooltip": 'Reveres Palette'
          }, 
          {
            "type": 'up', 
            "name": 'arrow_upward', 
            "position": '2', 
            "tooltip": 'Move Palette one up'
          }, 
          {
            "type": 'down', 
            "name": 'arrow_downward', 
            "position": '2', 
            "tooltip": 'Move Palette one down'
          }, 
          {
            "type": 'delete', 
            "name": 'delete', 
            "position": '2', 
            "tooltip": 'Delete Palette'
          }]
      },  
      "colours": [{"value": '#763916', "id": '123456'}, {"value": '#96fe11', "id": '456789'}]
      },
      {
      "meta": {
          "title": 'palette 3',
          "type": 'sequential',
          "seed": ['384321'],
          "comment": 'Thise is a test comment',
          "controls": [{
            "type": 'swap', 
            "name": 'swap_horiz', 
            "position": '2', 
            "tooltip": 'Reveres Palette'
          }, 
          {
            "type": 'up', 
            "name": 'arrow_upward', 
            "position": '2', 
            "tooltip": 'Move Palette one up'
          }, 
          {
            "type": 'down', 
            "name": 'arrow_downward', 
            "position": '2', 
            "tooltip": 'Move Palette one down'
          }, 
          {
            "type": 'delete', 
            "name": 'delete', 
            "position": '2', 
            "tooltip": 'Delete Palette'
          }]
      },  
      "colours": [{"value": '#369852', "id": '46548'}, {"value": '#153874', "id": '318494'}]
      }
    ]);
    //let paletteContent = []
    return (
      <div>
        <Intro 
            palettes = {palettes}
            setPalettes = {setPalettes}/>
        <Palettes
            palettes = {palettes}
            setPalettes = {setPalettes}/>
        <AddPalettes />
      </div>
      );
  }
  