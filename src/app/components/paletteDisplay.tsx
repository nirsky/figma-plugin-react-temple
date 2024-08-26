import React from "react"
import { useState } from 'react';
import * as utils from './utils'
import chroma from "chroma-js"
import * as conf from './config';
import Sketch from '@uiw/react-color-sketch';
import Tippy from '@tippyjs/react'
import Button from '@mui/joy/Button';
import Input from '@mui/joy/Input';
import Typography from '@mui/joy/Typography';
import Sheet from '@mui/joy/Sheet';
import Textarea from '@mui/joy/Textarea';
import Chip from '@mui/joy/Chip';
import IconButton from '@mui/joy/IconButton';
import Edit from '@mui/icons-material/Edit';
import SwapHoriz from '@mui/icons-material/SwapHoriz';
import ArrowUpward from '@mui/icons-material/ArrowUpward';
import ArrowDownward from '@mui/icons-material/ArrowDownward';
import Delete from '@mui/icons-material/Delete';
import Check from '@mui/icons-material/Check';
import Upload from '@mui/icons-material/Upload';
import Download from '@mui/icons-material/Download';
import ButtonGroup from '@mui/joy/ButtonGroup';
import Stack from '@mui/joy/Stack';
import Divider from '@mui/joy/Divider';


/*function ColourPicker() {
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
}*/

function ShowPalettes({palettes}) {
  function handleOnClick() {
      console.log('palettes', palettes)
      console.log('palettes.stringify()', JSON.stringify(palettes))
  }
  return (<>  
      <button className='vizku' onClick={handleOnClick}>
          Show Palettes   
      </button>
  </>);
}

export default function ColourManager({palettes, setPalettes}) {
  return (
      <Intro 
          palettes = {palettes}
          setPalettes = {setPalettes}/>);
}

function Intro({palettes, setPalettes}) {
  return(
      <Stack
        direction="column"
        justifyContent="space-between"
        alignItems="flex-start"
        spacing={2}>
          <ButtonGroup
            color="primary"
            orientation="horizontal"
            size="sm"
            variant="solid">
              <ImportXML 
                palettes={palettes}
                setPalettes={setPalettes}/>
              <ExportXML 
                palettes = {palettes}/>
          </ButtonGroup>
          <AddPalettes
            palettes = {palettes}
            setPalettes = {setPalettes}/> 
      </Stack>);
}

function ImportXML({palettes, setPalettes}) {
  const handleOnFileChange = (e) => {
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
        <Button 
            component='label'
            startDecorator={<Upload />} >
                Upload 
                <conf.VisuallyHiddenInput type="file" onChange={handleOnFileChange} />
        </Button>);
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

  return (
            <Button
                size="sm" 
                onClick={handleOnClick}
                startDecorator={<Download />}>
                Download
            </Button>)
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

  function handleOnSelectClick(button) {
    let select = false
    switch (button){
      case 'none':
        select = false
        break;
      case 'all':
        select = true
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
              setColours = {setColours}/>
      )
  })

  const selectedColours = colours.filter(element => element.selected === true)
  const deselectedColours = colours.filter(element => element.selected === false)
  const border = 0
  return (
        <Stack
          direction="column"
          alignItems="flex-start"
          justifyContent="space-between"
          spacing={1}
          sx={{width: 766, border: border}} >
            <Textarea
              minRows={2}
              size="sm"
              id="colourstring"
              variant="outlined"
              onInput={handleOnChange} 
              onLoad={handleOnChange} 
              defaultValue="https://coolors.co/01161e-8dadb9-124559-e9e3e6-c4d6b0"
              sx={{width: 1}} />  
            <Stack
              direction="row"
              justifyContent="space-between"
              alignItems="flex-start"
              spacing={1}
              sx={{width: 766, border: border}}> 
                <Stack
                  direction="column"
                  justifyContent="space-between"
                  alignItems="flex-start"
                  spacing={1}
                  sx={{width: 766, border: border}}> 
                    <Stack
                      direction="row"
                      justifyContent="space-between"
                      alignItems="center"
                      spacing={1}
                      sx={{width: 766, border: border}}>
                        <div>
                          <Chip
                            onClick={() => handleOnSelectClick('all')}
                            color="primary"
                            size="md"
                            variant="solid"
                            disabled={deselectedColours.length === 0}>All </Chip> 
                          <Chip
                            onClick={() => handleOnSelectClick('none')}
                            color="primary"
                            size="md"
                            variant="solid"
                            disabled={selectedColours.length === 0}>None </Chip>
                        </div>
                        <Stack
                          direction="row"
                          justifyContent="center"
                          alignItems="flex-start"
                          spacing={1}
                          sx={{border: border}}>
                            <ShowPalettes palettes = {palettes} />
                            <AddCategorical colours = {colours} palettes = {palettes} setPalettes = {setPalettes} />
                            <AddSequential colours = {colours} palettes = {palettes} setPalettes = {setPalettes} />
                            <AddDivergingBright colours = {colours} palettes = {palettes} setPalettes = {setPalettes} />
                            <CreateEverything colours = {colours} palettes = {palettes} setPalettes = {setPalettes} />
                        </Stack>
                    </Stack>
                    <Stack
                      direction="row"
                      justifyContent="center"
                      alignItems="flex-start"
                      spacing={0.5}
                      sx={{border: border}}>
                        {rows}
                    </Stack>
                </Stack>   
            </Stack>
            <Palettes
                palettes = {palettes}
                setPalettes = {setPalettes}/>
        </Stack>);
}

function ColourSelect({colour, colours, setColours}){
  function handleOnClick() { 
    let newColours = colours.slice()
      newColours[colour.index].selected = !colour.selected
      setColours(newColours)
  }
  let selected = false
  if (colour.selected === true) {
    selected = true
  } 

  let textcolour = ''
  if (chroma.contrast(colour.value, '#ffffff') < 4.5 ) {
    textcolour = '#000000'
  } else {
    textcolour = '#ffffff'
  }

  return(
        <Sheet  
        color="primary" 
        onClick={handleOnClick}
        sx={{ bgcolor: colour.value, color: textcolour, width:24, height:24, borderRadius: 5}}> 
        {selected ? <Check /> : <></>}
        
        </Sheet>
  )
}

function AddCategorical({colours, palettes, setPalettes}) {

  function handleOnClick () {
    const selectedItems = colours.filter(element => element.selected === true);
    const selectedColours = selectedItems.map(element => element.value)
    let palette = utils.createPalette(selectedColours, 'regular')
   
    let newPalettes = palettes.slice()
    newPalettes.push(palette)
    setPalettes(newPalettes)
  }

  
  const selectedItems = colours.filter(element => element.selected === true);

  return(
            <Button
                size="sm" 
                onClick={handleOnClick}
                disabled={selectedItems.length === 0}>
                Categorical
            </Button>)
}

function AddSequential({colours, palettes, setPalettes}) {
  function handleOnClick () {
    const selectedItems = colours.filter(element => element.selected === true);
    const selectedColours = selectedItems.map(element => element.value)

    const palette = utils.createPalette(selectedColours, 'ordered-sequential')
 
    let newPalettes = palettes.slice()
    newPalettes.push(palette)
    setPalettes(newPalettes)
  }

  const selectedItems = colours.filter(element => element.selected === true);
  let sequential = ''
  switch (selectedItems.length) {
    case 0:
      sequential = 'disabled'
    break;
    default:
      sequential = ''
  }

  return(<>
            <Button
                size="sm" 
                id='seq'
                onClick={handleOnClick}
                disabled={sequential === 'disabled'}>
                Sequential
            </Button>
      </>
  )
}

function AddDivergingBright({colours, palettes, setPalettes}) {
  function handleOnClick () {
    const selectedItems = colours.filter(element => element.selected === true);
    const selectedColours = selectedItems.map(element => element.value)

    const palette = utils.createPalette(selectedColours, 'ordered-diverging')
    
    let newPalettes = palettes.slice()
    newPalettes.push(palette)
    setPalettes(newPalettes)
  }

  const selectedItems = colours.filter(element => element.selected === true);
  let diverging = 'disabled'
  switch (selectedItems.length) {
    case 2:
      diverging = ''
    break;
    default:
      diverging = 'disabled'
  }
  
  return(
            <Button
                size="sm" 
                onClick={handleOnClick}
                disabled={diverging === 'disabled'}>
                Diverging (midpoint)
            </Button>)
}

function CreateEverything({colours, palettes, setPalettes}) {
  function handleOnClick () {
    const selectedItems = colours.filter(element => element.selected === true);
    const selectedColours = selectedItems.map(element => element.value)

    let palette = []

    palette.push(utils.createPalette(selectedColours, 'regular'))

    selectedColours.forEach(function(colour) {
      palette.push(utils.createPalette(colour, 'ordered-sequential'))
    })

    selectedColours.forEach(function(colour, index) {
      for (let i = index + 1; i < selectedColours.length; i++) {
        palette.push(utils.createPalette([colour, selectedColours[i]], 'ordered-sequential'))
        palette.push(utils.createPalette([colour, selectedColours[i]], 'ordered-diverging'))
      }
    })
 
    let newPalettes = palettes.concat(palette)
    setPalettes(newPalettes)   
  }  

  const selectedItems = colours.filter(element => element.selected === true);
  return(<>
            <Button
                size="sm" 
                onClick={handleOnClick}
                disabled={selectedItems.length < 2}>
                Everything
            </Button>
      </>
  )
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
  return (
      <>
        <Divider orientation="horizontal" />
        <Stack
          direction="column"
          alignItems="flex-start"
          justifyContent="space-between"
          spacing={1}
          divider={<Divider orientation="horizontal" />}
          sx={{width: 766}} >
            {rows}
        </Stack>
      </>);
}

function Palette({index, palette, palettes, setPalettes}){
  const [edit, setEdit] = useState(false);

  return(
    <Stack
      direction="column"
      alignItems="flex-start"
      justifyContent="space-between"
      spacing={0.5}
      divider={<Divider orientation="vertical" />}
      sx={{width: 766}} >
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
          {palette.meta.type === 'regular' 
          ? <ColoursCategorical 
              id = {palette.meta.id}
              colours = {palette.colours}
              palettes = {palettes}
              setPalettes = {setPalettes}/> 
          : <ColoursSeeded
              id = {palette.meta.id}
              colours = {palette.colours}
              palettes = {palettes}
              setPalettes = {setPalettes}/>}  
          
          
      </Stack>
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
    <Stack
      direction="row"
      alignItems="flex-start"
      justifyContent="space-between"
      spacing={0.5}
      sx={{width: 766}} >
          <Input 
              color="primary"
              size="sm"
              defaultValue={meta.title}
              onChange={handleInputChange}
              sx={{width: 400}}></Input>
          <Typography color="neutral" level="body-md">{conf.paletteTypes[meta.type]}</Typography>
          <Controls 
            id = {id}
            index = {index}
            palettes = {palettes}
            setPalettes = {setPalettes}
            edit = {edit}
            setEdit = {setEdit}/>
      </Stack>
  )
}

function Controls({id, index, palettes, setPalettes, edit, setEdit}){
  const rows = []
  const palette = palettes.find(palette => palette.meta.id === id)
  conf.controls.forEach((control) => {
    if(control.type === 'edit') {
       if(palette.meta.type === 'regular') {
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
       }
      
        
    } else {
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
    }
  })

  return(
    <Stack
    direction="row"
    justifyContent="center"
    alignItems="flex-start"
    spacing={0.1}>
          {rows}
      </Stack>
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
  let button
  switch(control.type) {
    case 'edit':
      button = <Edit />
    break;
    case 'swap':
      button = <SwapHoriz />
    break;
    case 'up':
      button = <ArrowUpward />
    break;
    case 'down':
      button = <ArrowDownward />
    break;
    case 'delete':
      button = <Delete />
    break;
  }

  return(
            <IconButton
              variant="plain"
              color={control.type === 'delete' ? "danger" : "primary" }
              size='sm'
              onClick={handleOnClick}>{button}</IconButton>)
}

function EditPalette({id, palettes, setPalettes}) {
  const colours = palettes
                      .find(palette => palette.meta.id === id)?.colours
                      .map(colour => colour.value) || [];
  function handleOnChange(e) {
    const parsedColours = utils.parseColours(e.target.value)
    const newItems = parsedColours.map(element => {
      return {
          value: element,
          id: utils.generateUUID()
      };

    });
    
    const newPalettes = () => {
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
  }


  return(
  <Textarea
                minRows={2}
                size="sm"
                id="colourstring"
                variant="outlined"
                onInput={handleOnChange} 
                onLoad={handleOnChange} 
                defaultValue={colours}
                sx={{width: 1}}
              />)
}

function ColoursCategorical({id, colours, palettes, setPalettes}){
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
    <Stack
      direction="row"
      justifyContent="center"
      alignItems="flex-start"
      spacing={0.5}>
        {rows}
    </Stack>)
}

function ColoursSeeded({id, colours, palettes, setPalettes}){
  
  const paletteColours = []

  const newPalette = palettes.find(palette => palette.meta.id === id)
  const seeds = newPalette.meta.seed
  
  
  
  colours.forEach((colour) => {
    paletteColours.push( 
      <Sheet  
        color="neutral" 
        variant="outlined" 
        key={colour.id}
        sx={{ bgcolor: colour.value, width:24, height:24, borderRadius: 5 }}/> 
    )
  })


  const seedColours = []
  seeds.forEach((seed) => {
    seedColours.push( 
      <ColourSeed 
      id = {id}
      colour = {seed}
      key = {seed.id}
      palettes = {palettes}
      setPalettes = {setPalettes}
      seeds={seeds}/>
    )
  })

  return(   
    <Stack
      direction="row"
      justifyContent="space-between"
      alignItems="flex-start"
      spacing={2}
      sx={{width: 766}}>

        <Sheet
          color="primary"
          variant="outlined"
          sx={{padding: 0.5, bgcolor: 'primary.50', borderRadius: 4}}>
          <Stack
            direction="row"
            justifyContent="center"
            alignItems="flex-start"
            spacing={0.5}>
              {paletteColours} 
              </Stack>
        </Sheet>
        <Stack
          direction="row"
          justifyContent="center"
          alignItems="flex-start"
          spacing={0.5}>
            {seedColours}
        </Stack>
    </Stack>)
}

function ColourActive({id, colour, palettes, setPalettes}){
  const [colourPicker, setColourPicker] = useState(colour.value);
  function handleOnChange(newColour) {
    
    setColourPicker(newColour.hex)


    let updatedPalettes
 
      updatedPalettes = palettes.map(palette => {
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
                  <Sheet  
                      color="neutral" 
                      variant="outlined" 
                      sx={{ bgcolor: colourPicker, width:24, height:24, borderRadius: 5 }}/> 
            </Tippy>)
}  

function ColourSeed({id, colour, palettes, setPalettes, seeds}){
  const [colourPicker, setColourPicker] = useState(colour.value);
  function handleOnChange(newColour) {

    setColourPicker(newColour.hex)
    seeds = seeds.map(element => element.value === colour.value ? {value: newColour.hex, id: element.id} : element);
    seeds.find(seed => seed.value === colour.value)?.id
    const seedID = seeds.find(seed => seed.value === colour.value)?.id
    let updatedPalettes
    
      updatedPalettes = palettes.map(palette => {
        if (palette.meta.id === id) {
          let newPalette
          switch (palette.meta.type) {
            case 'ordered-sequential':
              newPalette = utils.createPalette(seeds.map(element => element.value), 'ordered-sequential')
              break;
            case 'ordered-diverging':
              newPalette = utils.createPalette(seeds.map(element => element.value), 'ordered-diverging')
              break;

          } 
            return {
                meta: {
                  ...palette.meta,
                  seed: seeds.map(s => {
                    if (s.id === seedID) {
                        return {
                            ...s,
                            value: newColour.hex
                        };
                    }
                    return s;
                })
                },
                colours: newPalette.colours
            };
        }
        return palette;
      });
    setPalettes(updatedPalettes);
  }

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
      <Sheet  
          color="neutral" 
          variant="outlined" 
          sx={{ bgcolor: colourPicker, width:24, height:24, borderRadius: 5 }}/> 
</Tippy>)
}  