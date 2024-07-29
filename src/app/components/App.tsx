import React from 'react';
import '../styles/ui.css';
import Palettes from './paletteDisplay';


const palettes = [
  {
  "meta": {
      "title": 'palette 1',
      "type": 'categorical',
      "seed": ['123456'],
      "comment": 'Thise is a test comment',
      "controls": [{
        "name": 'edit', 
        "position": '1', 
        "tooltip": 'Edit Palette'
      }, 
      {
        "name": 'link', 
        "position": '2', 
        "tooltip": 'Create Linked Palettes'
      }, 
      {
        "name": 'swap_horiz', 
        "position": '2', 
        "tooltip": 'Reveres Palette'
      }, 
      {
        "name": 'arrow_upward', 
        "position": '2', 
        "tooltip": 'Move Palette one up'
      }, 
      {
        "name": 'arrow_downward', 
        "position": '2', 
        "tooltip": 'Move Palette one down'
      }, 
      {
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
        "name": 'swap_horiz', 
        "position": '2', 
        "tooltip": 'Reveres Palette'
      }, 
      {
        "name": 'arrow_upward', 
        "position": '2', 
        "tooltip": 'Move Palette one up'
      }, 
      {
        "name": 'arrow_downward', 
        "position": '2', 
        "tooltip": 'Move Palette one down'
      }, 
      {
        "name": 'delete', 
        "position": '2', 
        "tooltip": 'Delete Palette'
      }]
  },  
  "colours": [{"value": '#763916', "id": '123456'}, {"value": '#96fe11', "id": '456789'}]
  },
]

export default function App() {
  return <Palettes palettes={palettes} />;
}