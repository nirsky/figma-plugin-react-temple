import React from "react"
import { useState } from 'react';
import * as utils from './utils'
import chroma from "chroma-js"
import * as conf from './config';

import Saturation from '@uiw/react-color-saturation';
import Sketch from '@uiw/react-color-sketch';


//import Saturation from '@uiw/react-color-saturation';
import Tippy from '@tippyjs/react'

export default function ColourManager({palettes, setPalettes}) {
  return (
    <div>
      
      <Intro />
      <ImportXML 
          palettes={palettes}
          setPalettes={setPalettes}/>
      <ShowPalettes
          palettes={palettes} />
      <Palettes
          palettes = {palettes}
          setPalettes = {setPalettes}/>
      <AddPalettes
          palettes = {palettes}
          setPalettes = {setPalettes}/> 
    </div>
    );
}

function ColourPicker() {
  const [hsva, setHsva] = useState({ h: 0, s: 0, v: 68, a: 1 });
  return (<>
    <Saturation
      hsva={hsva}
      onChange={(newColor) => {
        setHsva({ ...hsva, ...newColor, a: hsva.a });
      }}
    />
    <Sketch />
    </>
  );
}

function Intro() {
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
      </div>
    </>
  );
}

function ImportXML({palettes, setPalettes}) {
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
        newPalettes = palettes.slice().concat(xml)
        setPalettes(newPalettes)
    };
  }

  return(
    <>
          <form id="upload">
              <label htmlFor="file" className="uploadButton">
                Upload Preferences.tps
              </label>
              <input type="file" id="file" accept=".tps" onChange={handleOnFileChange}></input>
          </form>
    </>
  );
}

function ShowPalettes({palettes}) {
  function handleOnClick() {
      console.log('palettes', palettes)
  }
  return (<>  
      <button className='vizku' onClick={handleOnClick}>
          Show Palettes   
      </button>
  </>);
}

function Palettes({palettes, setPalettes}) {
  const rows = []
  palettes.forEach((palette, index) => {
      rows.push(
          <Palette 
              index = {index}
              palette = {palette}
              key = {palette.meta.id} 
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

function Palette({index, palette, palettes, setPalettes}){
  const [edit, setEdit] = useState(false);

  return(
      <div className="palette">
          <Meta 
            id = {palette.meta.id}
            index = {index}
            meta = {palette.meta}
            palettes = {palettes}
            setPalettes = {setPalettes}
            edit = {edit}
            setEdit = {setEdit}/>
          {edit ? <EditPalette
            id = {palette.meta.id}
            palettes = {palettes}
            setPalettes = {setPalettes}/> : ''}
          <Colours 
            id = {palette.meta.id}
            colours = {palette.colours}
            palettes = {palettes}
            setPalettes = {setPalettes}/>
          
      </div>
  )
}

function Meta({id, index, meta, palettes, setPalettes, edit, setEdit}){
  function handleInputChange(e) {
    
    const updatedPalettes = palettes.map(palette => {
      if (palette.meta.id === id) {
        return {
          ...palette,
          meta: {
              ...palette.meta,
              title: e.target.value
          }
        };
      }
      return palette;
    });

    setPalettes(updatedPalettes)
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
            id = {id}
            index = {index}
            palettes = {palettes}
            setPalettes = {setPalettes}
            edit = {edit}
            setEdit = {setEdit}/>
      </div>
  )
}

function Controls({id, index, palettes, setPalettes, edit, setEdit}){
  const rows = []
  conf.controls.forEach((control) => {
      rows.push(
          <Control 
              id = {id}
              index = {index}
              control = {control}
              key = {control.name}
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

function Control({id, index, control, palettes, setPalettes, edit, setEdit}){
  function handleOnClick() {
    let updatedPalettes
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
        updatedPalettes = palettes.map(palette => {
          if (palette.meta.id === id) {
              return {
                  ...palette,
                  colours: [...palette.colours].reverse()
              };
          }
          return palette;
      });
        setPalettes(updatedPalettes)
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
        updatedPalettes = palettes.filter(palette => palette.meta.id !== id);
        setPalettes(updatedPalettes)
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
// CHECK THIS ONE!
function EditPalette({id, palettes, setPalettes}) {
  const colours = palettes
                      .find(palette => palette.meta.id === id)?.colours
                      .map(colour => colour.value) || [];
  function handleOnChange(e) {
    console.log('e.target.value', e.target.value)
    const parsedColours = utils.parseColours(e.target.value)
    console.log('parsedColours', parsedColours)
    const newItems = parsedColours.map(element => {
      return {
          value: element,
          id: utils.generateUUID()
      };

    });
    console.log('newItems', newItems)
    
    const newPalettes = (newColours) => {
      return palettes.map(palette => {
          if (palette.meta.id === id) {
              return {
                  ...palette,
                  colours: newItems
              };
          }
          return palette;
      });
  };
    setPalettes(newPalettes)
    console.log('done')
  }


  return(<>
    <textarea onChange={handleOnChange} defaultValue={colours}></textarea>
    </>
  )
}

function Colours({id, colours, palettes, setPalettes}){
  const rows = []
  colours.forEach((colour) => {
    rows.push( 
        <ColourActive 
            id = {id}
            colour = {colour}
            key = {colour.id}
            palettes = {palettes}
            setPalettes = {setPalettes}/>
    )
  })
  return(
      <div className="colours">
          {rows}
      </div>
  )
}

function ColourActive({id, colour, palettes, setPalettes}){
  const [colourPicker, setColourPicker] = useState(colour.value);
  function handleOnChange(newColour) {
    
    setColourPicker(newColour.hex)
    const updatedPalettes = palettes.map(palette => {
      if (palette.meta.id === id) {
          return {
              ...palette,
              colours: palette.colours.map(c => {
                  if (c.id === colour.id) {
                      return {
                          ...c,
                          value: newColour.hex
                      };
                  }
                  return c;
              })
          };
      }
      return palette;
    });
    setPalettes(updatedPalettes);
  }
/*return(<><div className='colour'
  style={{backgroundColor: colour.value}}></div></>)*/
  return(
            <Tippy interactive={true}
                placement='bottom'
                duration={0}
                arrow={false}
                    content={
                        
                        <Sketch
                            color={colourPicker}
                            disableAlpha={true}
                            presetColors={[]}
                            onChange={handleOnChange}/>
                            
                    }>

                <div className='colour'
                        style={{backgroundColor: colourPicker}}></div>
            </Tippy>
            
                           
    
  )
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
    <button className='vizku' onClick={handleOnClick}>Export Preferences</button>
    </>
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
                                className='vizku'
                                disabled={deselectedColours.length === 0}>All</button>
                        <button onClick={handleOnSelectClick} 
                                className='vizku'
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
        <div className="colour" style={{backgroundColor: colour.value, color: textcolour}} onClick={handleOnClick}>
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
          id: utils.generateUUID(),
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
                                    className='vizku'
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
          id: utils.generateUUID(),
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
                    className='vizku'
                    disabled={sequential === 'disabled'}>Sequential Palette</button>
            <button onClick={handleOnClick}
                    id='div_dark'
                    className='vizku'
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
          id: utils.generateUUID(),
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
                                    className='vizku'
                                    disabled={diverging === 'disabled'}>Diverging Bright Palette</button>
      </>
  )
}