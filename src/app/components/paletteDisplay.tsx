import React from "react"
import { useState } from 'react';
import { useImmer } from 'use-immer'
import * as utils from './utils'
import chroma from "chroma-js"
import * as conf from './config';

export default function ColourManager() {
  const [palettes, setPalettes] = useState(conf.testPalettes);
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

function Intro (palettes) {
  function handleOnFileChange(e) {
    e.preventDefault();

    const file = e.target.files[0];
    const reader = new FileReader();
    let newPalettes = []
    let xml = []

    if (!file) return;

    reader.readAsText(file);
    reader.onload = function() {
        xml = utils.parseXML(reader.result);
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
              <label htmlFor="file" className="uploadButton">
                Upload Preferences.tps
              </label>
              <input type="file" id="file" accept=".tps" onChange={handleOnFileChange}></input>
          </form>
      </div>
    </>
  );
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
  return (<>{rows}
          {rows.length > 0 ? 
            <>
              <ExportXML 
                  palettes = {palettes}/>
            </>: ''}
          </>);
}

function ExportXML({palettes}) {
  function handleOnClick() {
    const xmlString = utils.createXML(palettes)
    let filename = "preferences.tps";
    let pom = document.createElement('a');
    let bb = new Blob([xmlString], {type: 'text/plain'});
  
    pom.setAttribute('href', window.URL.createObjectURL(bb));
    pom.setAttribute('download', filename);
  
    pom.dataset.downloadurl = ['text/plain', pom.download, pom.href].join(':');
    pom.draggable = true; 
    pom.classList.add('dragout');
  
    pom.click();
  }



  return (<>
    <button onClick={handleOnClick}>Export Preferences</button>
    </>
  )
}

function Palette({paletteContent, index, palettes, setPalettes}){
  const [palette, setPalette] = useImmer(paletteContent);
  const [edit, setEdit] = useState(false);
  return(
      <div className="palette">
          <Meta 
            index = {index}
            meta = {palette.meta}
            palette = {palette}
            setPalette = {setPalette}
            palettes = {palettes}
            setPalettes = {setPalettes}
            edit = {edit}
            setEdit = {setEdit}/>
          {edit ? <EditPalette
            palette = {palette}
            setPalette = {setPalette}/> : ''}
          <Colours colours = {palette.colours}/>
          
      </div>
  )
}

function EditPalette({palette, setPalette}) {
  let colours = palette.colours.map(element => element.value)
  function handleOnChange(e) {
    const parsedColours = utils.parseColours(e.target.value)
    const newItems = parsedColours.map(element => {
      return {
          value: element,
          id: utils.generateUUID()
      };
    });
    
    setPalette(draft => {
      draft.colours = newItems
    })
  }


  return(<>
    <textarea onChange={handleOnChange} defaultValue={colours}></textarea>
    </>
  )
}

function Meta({index, meta, palette, setPalette, palettes, setPalettes, edit, setEdit}){
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
            setPalettes = {setPalettes}
            edit = {edit}
            setEdit = {setEdit}/>
      </div>
  )
}

function Controls({index, palette, setPalette, palettes, setPalettes, edit, setEdit}){
  const rows = []
  conf.controls.forEach((control) => {
      rows.push(
          <Control 
              index = {index}
              control = {control}
              key = {control.name}
              palette = {palette}
              setPalette = {setPalette}
              palettes = {palettes}
              setPalettes = {setPalettes} 
              edit = {edit}
              setEdit = {setEdit}/>
      )
  })

  return(
      <div className="controls">
          {rows}
      </div>
  )
}

function Control({index, control, palette, setPalette, palettes, setPalettes, edit, setEdit}){
  function handleOnClick() {
    switch  (control.type) {
      case 'edit':
        console.log('edit')
        if (edit === false ){
          setEdit(true)
        } else {
          setEdit(false)
        }
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

function Colours({colours}){
  const rows = []
  colours.forEach((colour) => {
    rows.push( 
        <ColourActive 
            colour = {colour.value}
            key = {colour.id}/>
    )
  })
  return(
      <div className="colours">
          {rows}
      </div>
  )
}

function ColourActive({colour}){
  return(
    <div className="clr-field" style={{color: colour}}>
      <input type="text" className="coloris colourField" value={colour} readOnly data-coloris></input>
      <button type="button" aria-labelledby="clr-open-label"></button>
    </div>
  )
}   
  
function AddPalettes({palettes, setPalettes}) {
  const [colours, setColours] = useState([]);
  function handleOnChange(e) {
    let newColours = []
    const parsedColours = utils.parseColours(e.target.value)
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

  function handleOnSelectClick(e) {
    let select = false
    switch (e.target.textContent){
      case 'All':
        select = true
        break;
      case 'None':
        select = false
        break;
    }
    const newColours = colours.map(element => {
      return {
          ...element,
          selected: select
      };
    });
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

  let selectButtons
  const selectedColours = colours.filter(element => element.selected === true)
  const deselectedColours = colours.filter(element => element.selected === false)

  if (colours.length > 0) {
    selectButtons  =  <>
                        <button onClick={handleOnSelectClick} 
                                className={deselectedColours.length === 0 ? 'selectColour disabled' : 'selectColour'}
                                disabled={deselectedColours.length === 0}>All</button>
                        <button onClick={handleOnSelectClick} 
                                className={selectedColours.length === 0 ? 'selectColour disabled' : 'selectColour'}
                                disabled={selectedColours.length === 0}>None</button>
                      </>
  }

  return (
    <div>
              <textarea id="colourstring" placeholder="eg.: https://coolors.co/fb5012-#01fdf6 (cbbaed,#e9df00)#03fcba" onInput={handleOnChange} onLoad={handleOnChange} defaultValue='https://coolors.co/01161e-8dadb9-124559-e9e3e6-c4d6b0'></textarea>
              <div>You can insert any text with hexcodes, no need to clean them up. All found colours are displayed below.</div>
              {selectButtons}
              <div className="colours">{rows}</div>
              {rows.length > 0 ? <>
              <div>Select the coloured boxes above to create palettes</div>
                  <AddCategorical colours = {colours} palettes = {palettes} setPalettes = {setPalettes} />
                  <AddSequential colours = {colours} palettes = {palettes} setPalettes = {setPalettes} />
                  <AddDivergingBright colours = {colours} palettes = {palettes} setPalettes = {setPalettes} /> </>: ''}
          </div>
    );
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

function AddCategorical({colours, palettes, setPalettes}) {


  function handleOnClick () {
    const selectedItems = colours.filter(element => element.selected === true);
    const selectedColours = selectedItems.map(element => {
      return {
          value: element.value,
          id: utils.generateUUID()
      };
    });

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

  
  const selectedItems = colours.filter(element => element.selected === true);

  return(<>
            <button onClick={handleOnClick}
                                    className={selectedItems.length === 0 ? 'disabled' : ''}
                                    disabled={selectedItems.length === 0}>Categorical Palette</button>
      </>
  )
}

function AddSequential({colours, palettes, setPalettes}) {
  function handleOnClick (e) {
    const selectedItems = colours.filter(element => element.selected === true);
    const selectedColours = selectedItems.map(element => element.value)
    const paletteColours = utils.generateSequential(selectedColours)
    const paletteItems = paletteColours.map(element => {
      return {
          value: element,
          id: utils.generateUUID()
      };
    });
    let type, title
    switch (e.target.id) {
      case 'seq':
        type = 'ordered-sequential'
        title = 'Sequential'
        break;
      case 'div_dark':
        type = 'ordered-diverging'
        title = 'Diverging Dark'
        break;
      default:
        type = 'unexpected value'
    }

    let palette = {
      meta: {
          title: title,
          type: type,
          seed: [],
          comment: '',
      },
      colours: paletteItems
    };
    
    let newPalettes = palettes.slice()
    newPalettes.push(palette)
    setPalettes(newPalettes)
  }


  const selectedItems = colours.filter(element => element.selected === true);
  let sequential, diverging = ''
  switch (selectedItems.length) {
    case 0:
      sequential = 'disabled'
      diverging = 'disabled'
    break;
    case 1:
      sequential = ''
      diverging = 'disabled'
    break;
    case 2:
      sequential = 'disabled'
      diverging = ''
    break;
    default:
      sequential = 'disabled'
      diverging = 'disabled'
  }
  

  return(<>
            <button onClick={handleOnClick}
                    id='seq'
                    className={sequential}
                    disabled={sequential === 'disabled'}>Sequential Palette</button>
            <button onClick={handleOnClick}
                    id='div_dark'
                    className={diverging}
                    disabled={diverging === 'disabled'}>Diverging Dark Palette</button>
      </>
  )
}

function AddDivergingBright({colours, palettes, setPalettes}) {
  function handleOnClick () {
    const selectedItems = colours.filter(element => element.selected === true);
    const selectedColours = selectedItems.map(element => element.value)

    let paletteColours = utils.generateSequential([selectedColours[0]], 10).reverse()
    paletteColours = paletteColours.concat(utils.generateSequential([selectedColours[1]], 10))

    const paletteItems = paletteColours.map(element => {
      return {
          value: element,
          id: utils.generateUUID()
      };
    });
   
    let palette = {
      meta: {
          title: 'Diverging Bright',
          type: 'ordered-diverging',
          seed: [],
          comment: '',
      },
      colours: paletteItems
    };
    
    let newPalettes = palettes.slice()
    newPalettes.push(palette)
    setPalettes(newPalettes)
  }


  const selectedItems = colours.filter(element => element.selected === true);
  let diverging = ''
  switch (selectedItems.length) {
    case 0:
      diverging = 'disabled'
    break;
    case 1:
      diverging = 'disabled'
    break;
    case 2:
      diverging = ''
    break;
    default:
      diverging = 'disabled'
  }
  

  return(<>
            <button onClick={handleOnClick}
                                    className={diverging}
                                    disabled={diverging === 'disabled'}>Diverging Bright Palette</button>
      </>
  )
}