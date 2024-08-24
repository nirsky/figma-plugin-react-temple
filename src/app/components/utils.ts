
//import { chroma } from 'chroma-js'
import chroma from "chroma-js"
import * as conf from './config';


type Control = {
    type: 'swap' | 'up' | 'down' | 'delete'; // Enumerate the possible types
    name: string;
    position: number; 
    tooltip: string;
};

type Meta = {
    id: string,
    title: string;
    type: 'regular' | 'ordered-sequential' | 'ordered-diverging'; 
    seed: string[];
    comment: string;
    controls: Control[];
};

type Colour = {
    value: string;
    id: string;
};

type Palette = {
    meta: Meta;
    colours: Colour[];
};

interface JSONvariable {
    style: string;
    attribute: string;
    value: any;
    type: VariableResolvedDataType;
  }

export function generateUUID(length = 10) {
    const chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let result = '';
    const array = new Uint8Array(length);
    crypto.getRandomValues(array);
    for (let i = 0; i < length; i++) {
        result += chars[array[i] % chars.length];
    }
    return result;
}

export function parseXML(doc) {
    const parser = new DOMParser();
    const xmlDoc = parser.parseFromString(doc,"text/xml");
    const path = '//workbook/preferences/color-palette'
    const result = xmlDoc.evaluate(path, xmlDoc, null, XPathResult.ANY_TYPE, null);
    let loadedPalettes = []
    let node = null;

    while (node = result.iterateNext()) {
        let palette: Palette = {
            meta: {
                id: generateUUID(),
                title: node.getAttribute("name"),
                type: node.getAttribute("type"),
                seed: [],//node.getAttribute("seed").split(','),
                comment: '',
                controls: []
            },
            colours: []
        };
        for (let i = 0; i < node.childNodes.length; i++) {
            let colour: Colour = {
                value: '',
                id: ''
            }
            if (node.childNodes[i].nodeName === 'color') {
                colour.value = node.childNodes[i].childNodes[0].nodeValue.trim()
                colour.id = generateUUID()
                palette.colours.push(colour)
            }
        }
        loadedPalettes.push(palette)
    }
    return loadedPalettes
}

export function parseColours(input: string) {
    const hexColorRegex = /(?<=\W|x|^)([a-fA-F0-9]{8}|[a-fA-F0-9]{6}|#[a-fA-F0-9]{3})(?=\W|$)/g;
    let colours = []
    if (input != "") {
        colours = input.match(hexColorRegex);
     }

     colours = colours.map( value => chroma(value).hex())
    /*if (colours != null){
        colours.forEach(function(colour) {
            palette.addColour(chroma(colour).hex())
        })
    }*/
    return colours;
}

export function generateSequential(colour, steps = 20) {
    if(colour.length == 1) {
        let newColour = colour[0]
        let brightness = chroma(newColour).luminance();
        while (brightness < 0.75) {
            newColour = chroma(newColour).brighten().hex();  
            brightness = chroma(newColour).luminance();
        } 
        let newColours = [newColour]

        newColour = colour[0]
        brightness = chroma(newColour).luminance();

        while (brightness > 0.25) {
            newColour = chroma(newColour).darken().hex();
            brightness = chroma(newColour).luminance();
        }

        newColours.push(newColour)
        let newScale = chroma.bezier(newColours).scale().correctLightness().colors(steps);
        return newScale;

    } else if (colour.length > 1) {
        let newScale = chroma.bezier(colour).scale().correctLightness().colors(steps);
        return newScale;
    }
   
}

export function createXML(palettes) {
    const xmlDoc = document.implementation.createDocument(null, "workbook");
    const xmlPref = xmlDoc.createElement("preferences");
    xmlDoc.getElementsByTagName("workbook")[0].appendChild(xmlPref);
    
    let paletteNames = []

    palettes.forEach(palette => {
        let i = 1
        while (paletteNames.includes(palette.meta.title)) {
            if (i > 1) {
                palette.name = palette.name.slice(0, -2); 
            } 
            palette.name += " " + i
            i++
        }
        paletteNames.push(palette.meta.title)

        const xmlPalette = xmlDoc.createElement("color-palette");
        xmlPalette.setAttribute('name', palette.meta.title)
        xmlPalette.setAttribute('type', palette.meta.type)
        /*if (palette.seed) {
            xmlPalette.setAttribute('seed', palette.seed)
        }*/
        
        let colours = palette.colours
        colours.forEach(function(colour){
            const xmlColour = xmlDoc.createElement("color");
            /*if (colours.colours[el].uuid) {
                xmlColour.setAttribute('uuid', colours.colours[el].uuid)
            }*/
            const xmlColourValue = xmlDoc.createTextNode(chroma(colour.value).hex());
            xmlColour.appendChild(xmlColourValue);
            xmlPalette.appendChild(xmlColour);
        })
        xmlPref.appendChild(xmlPalette)
    })

    const pi = xmlDoc.createProcessingInstruction('xml', "version='1.0'");
    xmlDoc.insertBefore(pi, xmlDoc.firstChild);

    let serializer = new XMLSerializer();
    let xmlString = serializer.serializeToString(xmlDoc);
    xmlString = xmlString.replace(/<workbook/g, '\n\t<workbook');
    xmlString = xmlString.replace(/<\/workbook/g, '\n\t</workbook');
    xmlString = xmlString.replace(/<preferences/g, '\n\t\t<preferences');
    xmlString = xmlString.replace(/<\/preferences/g, '\n\t\t</preferences');
    xmlString = xmlString.replace(/<color/g, '\n\t\t\t\t<color');
    xmlString = xmlString.replace(/<color-palette/g, '\n\t\t\t<color-palette');
    xmlString = xmlString.replace(/<\/color-palette>/g, '\n\t\t\t</color-palette>\n');
    //let output = "<!--\tThis file was created by the Tableau Colour Manager\n\t\tfor mroe infos on the tool and how to use it, visit \n\n\t\tvizku.nz/tableau-colour-manager\n\n\t\tdesgined by Alex Waleczek at Vizku          -->\n\n"
    //output += xmlString
    console.log(xmlString)
    return xmlString
}

export function removeEmptyValues(obj: Record<string, any>): Record<string, any> {
    const cleanedObj: Record<string, any> = {};

    // Recursive function to clean empty string values
    const cleanObject = (o: Record<string, any>) => {
      for (const key in o) {
        if (typeof o[key] === 'object' && o[key] !== null) {
          const nestedObj = cleanObject(o[key]); // Recursively clean nested objects
          if (Object.keys(nestedObj).length > 0) {
            cleanedObj[key] = nestedObj;
          }
        } else if (o[key] !== '') {
          cleanedObj[key] = o[key]; // Only add key if value is not an empty string
        }
      }
      return cleanedObj;
    };
  
    return cleanObject(obj);
}

export function sendToFigma(style, attribute, value) {
        const attributeMeta = conf.attributeList.find(attr => attr.attr === attribute);
        const msg = {
            style: style, 
            attribute: attribute, 
            value: value, 
            type: attributeMeta.type
        }
        parent.postMessage({ pluginMessage: { type: 'save-variables', msg: msg} }, '*')
}

export function loopStyles(theme) {
    const styles = theme.styles;
    for (const style in styles) {
        if (styles.hasOwnProperty(style)) {
    
            const attributes = styles[style];
            
            for (const attribute in attributes) {
                    const value = styles[style][attribute];
                    
                    sendToFigma(style, attribute, value)
            }
        }
    }
}

export async function saveVariable(JSONvariable: JSONvariable) {
    let collections
    let collection
    let variable: Variable | null
    let saved = false
    let colourRGB
  
      // Try to load existing collection
    try {
      collections = await figma.variables.getLocalVariableCollectionsAsync();
      collection = collections.find(item => item.name === 'themes-for-tableau');
    } catch (error) {
      console.log("Collections couldn't be loaded")
    }
      // Create collection if it doesn't exist yet
    if (!collection) {
      collection = figma.variables.createVariableCollection(`themes-for-tableau`)
    }
      //Convert hex to Figma RGB
    if (JSONvariable.type == 'COLOR' && JSONvariable.value != '') {
      colourRGB = chroma(JSONvariable.value).rgb()
      JSONvariable.value = {r: colourRGB[0] / 255, g: colourRGB[1] / 255, b: colourRGB[2] / 255}
    }
      //Convert String to number
    if (JSONvariable.type == 'FLOAT') {
      JSONvariable.value = Number(JSONvariable.value) || null;
    }
  
      //Load fonts
    if (JSONvariable.attribute == 'saFontFamily' && JSONvariable.value != '') {
      try {
        await figma.loadFontAsync({ family: JSONvariable.value, style: "Regular" });
      } catch (error) {
        console.log('Font could not be loaded')
      }
    }
      //Loop through variables in collection until you find the right one and change the value
    collection.variableIds.forEach(async varID => {
        try {             
          variable = await figma.variables.getVariableByIdAsync(varID);
        } catch (error) { 
          console.log("Variable couldn't be loaded")
        }
        if (variable != null &&  variable.name == JSONvariable.style + `/` + JSONvariable.attribute) {
          if(JSONvariable.value !== '' && JSONvariable.value) {
            variable.setValueForMode(collection.modes[0].modeId, JSONvariable.value) 
          } 
          saved = true
        }  
    }); 
      // If Variable wasn't found, create new variable with value
    if (saved === false && JSONvariable.value !== '' && JSONvariable.value) {
      try {
        variable = figma.variables.createVariable(JSONvariable.style + `/` + JSONvariable.attribute, collection, JSONvariable.type)
        variable.setValueForMode(collection.modes[0].modeId, JSONvariable.value )
      } catch (error) {
        console.log('Variable could not be created', error)
      }
    }
}

export async function parseVariables() {
let collections, collection
let variable
    //check if collection exists
    try {
        collections = await figma.variables.getLocalVariableCollectionsAsync();
        collection = collections.find(item => item.name === 'themes-for-tableau');
      } catch (error) {
        console.log("Collections couldn't be loaded")
        
      }
    //return message if no collection is found
    if (!collection) {
        return('no collection')
    }

    collection.variableIds.forEach(async varID => {
        try {             
          variable = await figma.variables.getVariableByIdAsync(varID);
        } catch (error) { 
          console.log("Variable couldn't be loaded")
        }

        //Convert hex to Figma RGB
        let value
        if (variable.resolvedType == 'COLOR') {
            let rgb = Object.values(variable['valuesByMode'])
            value = chroma(rgb[0].r * 255,  rgb[0].g * 255, rgb[0].b * 255).hex()
        } else {
            value = Object.values(variable['valuesByMode'])[0]
        }


        let style = {
            style: variable.name.split("/")[0],
            attribute: variable.name.split("/")[1],
            value: value,
            type: variable.resolvedType
        }
        figma.ui.postMessage({ type: 'store-variable', style});
    }); 

}

export function getSectionDetails(section, theme) {
    // Extract the list of styles in the 'text' section
const styleNames = conf.styleSections.find(sec => sec.section === section).styles;
// Extract the keys from the styles object
const allStyleKeys = Object.keys(theme.styles);
// Filter and return the keys that match the 'text' section
const  sectionStyles = allStyleKeys.filter(styleKey => styleNames.includes(styleKey));

// get all objects
const styleObjects = sectionStyles.map(name => theme.styles[name] || {});
//extract all attributes
const allAttr = styleObjects.flatMap(style => Object.keys(style));
// get unique attributes
let sectionAttr = []
sectionAttr = [...new Set(allAttr)];

return {
    styles: sectionStyles,
    attributes: sectionAttr
}
}