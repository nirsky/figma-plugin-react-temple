import React from "react"

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
  
function Control({control}){
  return(
      <div className="control">
          <i 
            className="material-symbols-outlined"
            title={control.tooltip} >
            {control.name}</i>
      </div>
  )
}
  
function Controls({controls}){
  const rows = []

  controls.forEach((control) => {
      rows.push(
          <Control 
              control = {control}
              key = {control.name} />
      )

  })

  return(
      <div className="controls">
          {rows}
      </div>
  )
}
  
function Meta({meta}){
  return(
      <div className="meta">
          <input type="text" className="title" value={meta.title}></input>
          <div className="type">{meta.type}</div>
          <Controls controls = {meta.controls}/>
      </div>
  )
}
  
function Palette({palette}){
  return(
      <div className="palette">
          <Meta meta = {palette.meta}/>
          <Colours colours = {palette.colours}/>
      </div>
  )
}
  
export default function Palettes ( {palettes}) {
    const rows = []
    
    palettes.forEach((palette) => {
        rows.push(
            <Palette 
                palette = {palette}
                key = {palette.meta.title} />
        )
  
    })
    console.log('palettes', palettes)
    return (
      <div>
        <div>Header!?</div>
        <div>{rows}</div>
      </div>
      );
  
  }
  