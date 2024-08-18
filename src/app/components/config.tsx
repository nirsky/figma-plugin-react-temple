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