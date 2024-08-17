import React from 'react';
import '../styles/ui.css';
import ColourManager from './paletteDisplay';
import ThemeManager from './themeDisplay';


/*const palettes = [
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
]*/






export default function App() {
  return( 
    <>
      <ThemeManager />
    </>)

}

/*


      <ColourManager />
*/