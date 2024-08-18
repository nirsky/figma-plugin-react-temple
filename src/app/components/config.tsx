//Colour Manager
export const controls = [{
    "type": 'edit', 
    "name": 'edit', 
    "position": '1', 
    "tooltip": 'Edit Palette'
  }, /*
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

export const testPalettes = [
    {
    "meta": {
        "id": '123456',
        "title": 'palette 1',
        "type": 'regular',
        "seed": ['123456'],
        "comment": 'Thise is a test comment'
        },  
    "colours": [{"value": '#ff074e', "id": '123'}, {"value": '#fabcde', "id": '456789'}]
    },
    {
    "meta": {
        "id": '49846321',
        "title": 'palette 2',
        "type": 'ordered-sequential',
        "seed": ['123456'],
        "comment": 'Thise is a test comment'
    },  
    "colours": [{"value": '#763916', "id": '123456'}, {"value": '#96fe11', "id": '456789'}]
    },
    {
    "meta": {
        "id": '31564',
        "title": 'palette 3',
        "type": 'ordered-diverging',
        "seed": ['384321'],
        "comment": 'Thise is a test comment'
    },
    "colours": [{"value": '#369852', "id": '46548'}, {"value": '#153874', "id": '318494'}]
    }
  ]  

//Theme Manager
export const jsonStructure = {
    "theme": {
      "version": 1.0,
      "name": "New Theme",
      "base-theme": "default",
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

export const attributeList = [
    {name: 'Font Family', attr: 'saFontFamily', value: ['Comic Sans', 'Helvetica', 'Arial', 'Tableau Book'], type: 'STRING'},
    {name: 'Font Size', attr: 'saFontSize', value: ['8', '12', '16'], type: 'FLOAT'},
    {name: 'Font Weight', attr: 'saFontWeight', value: ['Bold', 'Semi-Bold', 'Light'], type: 'STRING'},
    {name: 'Font Colour', attr: 'saColor', type: 'COLOR'},
    {name: 'Background Colour', attr: 'saBackgroundColor', type: 'COLOR'},
    {name: 'Mark Colour', attr: 'saMarkColor', type: 'COLOR'}
  ]

export const baseThemes = ['default', 'previous', 'modern', 'classic']