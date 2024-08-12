import React from "react"
import { useState } from 'react';

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
        setPalette({
          ...palette,
          colours: palette.colours.toReversed()
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
        console.log('up')
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
  
function Controls({index, controls, palette, setPalette, palettes, setPalettes}){
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
  function handleOnChange() {
    setPalette({
      ...palette,
      meta.title: palette.colours.toReversed()
    })
  }
  return(
      <div className="meta">
          <input 
            type="text" 
            className="title" 
            value={meta.title}
            onChange={handleOnChange}></input>
          <div className="type">{meta.type}</div>
          <Controls 
            index = {index}
            controls = {meta.controls}
            palette = {palette}
            setPalette = {setPalette}
            palettes = {palettes}
            setPalettes = {setPalettes}/>
      </div>
  )
}
  
function Palette({paletteContent, index, palettes, setPalettes}){
  const [palette, setPalette] = useState(paletteContent);
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
  
export default function Palettes ( {paletteContent}) {
  const [palettes, setPalettes] = useState(paletteContent);
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
    //console.log('palettes', palettes)
    return (
      <div>
        <div>Header!?</div>
        <div>{rows}</div>
      </div>
      );
  
  }
  