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
  "version": 1,
  "base-theme": "default",
  "name": "New Theme 2",
  "styles": {
    "all": {
      "font-family": "",
      "font-color": ""
    },
    "worksheet": {
      "font-family": "",
      "font-color": "",
      "font-size": ""
    },
    "worksheet-title": {
      "font-family": "",
      "font-color": "",
      "font-size": ""
    },
    "tooltip": {
      "font-family": "",
      "font-color": "",
      "font-size": ""
    },
    "dashboard-title": {
      "font-family": "",
      "font-color": "",
      "font-size": "",
      "font-weight": ""
    },
    "story-title": {
      "font-family": "",
      "font-color": "",
      "font-size": ""
    },
    "header": {
      "font-family": "",
      "font-color": ""
    },
    "legend": {
      "font-family": "",
      "font-color": "",
      "font-size": "",
      "background-color": ""
    },
    "legend-title": {
      "font-family": "",
      "font-color": "",
      "font-size": ""
    },
    "filter": {
      "font-family": "",
      "font-color": "",
      "font-size": "",
      "background-color": ""
    },
    "filter-title": {
      "font-family": "",
      "font-color": "",
      "font-size": ""
    },
    "parameter-ctrl": {
      "font-family": "",
      "font-color": "",
      "font-size": "",
      "background-color": ""
    },
    "parameter-ctrl-title": {
      "font-family": "",
      "font-color": "",
      "font-size": ""
    },
    "highlighter": {
      "font-family": "",
      "font-color": "",
      "font-size": "",
      "background-color": ""
    },
    "highlighter-title": {
      "font-family": "",
      "font-color": "",
      "font-size": ""
    },
    "page-ctrl": {
      "font-family": "",
      "font-size": ""
    },
    "page-ctrl-title": {
      "font-color": "",
      "font-family": ""
    },
    "view": {
      "background-color": ""
    },
    "gridline": {
      "line-visibility": "",
      "line-pattern": "",
      "line-color": "",
      "line-width": ""
    },
    "zeroline": {
      "line-visibility": "",
      "line-pattern": "",
      "line-color": "",
      "line-width": ""
    },
    "mark": {
      "mark-color": ""
    }
  }
}

export const styleSections = [
    {
        section: 'Text',
        styles: ["all",
            "worksheet",
            "worksheet-title",
            "tooltip",
            "dashboard-title",
            "story-title",
            "header",
            "view",
          ]},
    {
        section: 'Cards',
        styles: [
          "legend",
          "legend-title",
          "filter",
          "filter-title",
          "parameter-ctrl",
          "parameter-ctrl-title",
          "highlighter",
          "highlighter-title",
          "page-ctrl",
          "page-ctrl-title",
        ]},
    {
        section: 'Content',
        styles: [
          "mark"
        ]},
    {
        section: 'Lines',
        styles: [
          "gridline",
          "zeroline"
        ]}
]


export const attributeList = [
    {name: 'Font Family', attr: "font-family", value: ["Arial", "Calibri", "Courier New", "Georgia", "Poppins", "Roboto", "Tableau Book", "Times New Roman", "Trebuchet MS", "Verdana", "Meryio UI", "Noto CJK Sans", "Noto CJK Serif", "Noto Thai Sans", "Noto Thai Serif"], type: 'STRING'},
    {name: 'Font Size', attr: "font-size", type: 'FLOAT'},
    {name: 'Font Weight', attr: 'font-weight', value: ["normal", "bold"], type: 'STRING'},
    {name: 'Font Colour', attr: "font-color", type: 'COLOR'},
    {name: 'Bg Colour', attr: "background-color", type: 'COLOR'},
    {name: 'Mark Colour', attr: "mark-color", type: 'COLOR'},
    {name: 'Line Visibility', attr: "line-visibility", value: ['on', 'off'], type: 'STRING'},
    {name: 'Line Pattern', attr: "line-pattern", value: ["dotted", "dashed", "solid"], type: 'STRING'},
    {name: 'Line Colour', attr: "line-color", type: 'COLOR'},
    {name: 'Line Width', attr: "line-width", type: 'FLOAT'}
  ]

export const baseThemes = ["default", "classic", "modern", "clean", "smooth"]