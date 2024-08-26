
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

  function findClosestColour(colours) {
    let minDistance = Infinity;
    let closestColor = "";
    let output = []
    const colors = {
        "AliceBlue": "#F0F8FF", "AntiqueWhite": "#FAEBD7", "Aqua": "#00FFFF", "Aquamarine": "#7FFFD4", "Azure": "#F0FFFF", 
        "Beige": "#F5F5DC", "Bisque": "#FFE4C4", "Black": "#000000", "BlanchedAlmond": "#FFEBCD", "Blue": "#0000FF", "BlueViolet": "#8A2BE2", "Brown": "#A52A2A", "BurlyWood": "#DEB887",
        "CadetBlue": "#5F9EA0", "Chartreuse": "#7FFF00", "Chocolate": "#D2691E", "Coral": "#FF7F50", "CornflowerBlue": "#6495ED", "Cornsilk": "#FFF8DC", "Crimson": "#DC143C", "Cyan": "#00FFFF",
        "DarkBlue": "#00008B","DarkCyan": "#008B8B","DarkGoldenRod": "#B8860B","DarkGray": "#A9A9A9","DarkGreen": "#006400","DarkKhaki": "#BDB76B","DarkMagenta": "#8B008B","DarkOliveGreen": "#556B2F","DarkOrange": "#FF8C00","DarkOrchid": "#9932CC","DarkRed": "#8B0000","DarkSalmon": "#E9967A","DarkSeaGreen": "#8FBC8F","DarkSlateBlue": "#483D8B","DarkSlateGray": "#2F4F4F","DarkTurquoise": "#00CED1","DarkViolet": "#9400D3","DeepPink": "#FF1493","DeepSkyBlue": "#00BFFF","DimGray": "#696969","DodgerBlue": "#1E90FF",
        "FireBrick": "#B22222","FloralWhite": "#FFFAF0","ForestGreen": "#228B22","Fuchsia": "#FF00FF",
        "Gainsboro": "#DCDCDC","GhostWhite": "#F8F8FF","Gold": "#FFD700","GoldenRod": "#DAA520","Gray": "#808080","Green": "#008000","GreenYellow": "#ADFF2F",
        "HoneyDew": "#F0FFF0","HotPink": "#FF69B4",
        "IndianRed": "#CD5C5C","Indigo": "#4B0082","Ivory": "#FFFFF0",
        "Khaki": "#F0E68C",
        "Lavender": "#E6E6FA","LavenderBlush": "#FFF0F5","LawnGreen": "#7CFC00","LemonChiffon": "#FFFACD","LightBlue": "#ADD8E6","LightCoral": "#F08080","LightCyan": "#E0FFFF","LightGoldenRodYellow": "#FAFAD2","LightGray": "#D3D3D3","LightGreen": "#90EE90","LightPink": "#FFB6C1","LightSalmon": "#FFA07A","LightSeaGreen": "#20B2AA","LightSkyBlue": "#87CEFA","LightSlateGray": "#778899","LightSteelBlue": "#B0C4DE","LightYellow": "#FFFFE0","Lime": "#00FF00","LimeGreen": "#32CD32","Linen": "#FAF0E6",
        "Magenta": "#FF00FF","Maroon": "#800000","MediumAquaMarine": "#66CDAA","MediumBlue": "#0000CD","MediumOrchid": "#BA55D3","MediumPurple": "#9370DB","MediumSeaGreen": "#3CB371","MediumSlateBlue": "#7B68EE","MediumSpringGreen": "#00FA9A","MediumTurquoise": "#48D1CC","MediumVioletRed": "#C71585","MidnightBlue": "#191970","MintCream": "#F5FFFA","MistyRose": "#FFE4E1","Moccasin": "#FFE4B5",
        "NavajoWhite": "#FFDEAD","Navy": "#000080",
        "OldLace": "#FDF5E6","Olive": "#808000","OliveDrab": "#6B8E23","Orange": "#FFA500","OrangeRed": "#FF4500","Orchid": "#DA70D6",
        "PaleGoldenRod": "#EEE8AA","PaleGreen": "#98FB98","PaleTurquoise": "#AFEEEE","PaleVioletRed": "#DB7093","PapayaWhip": "#FFEFD5","PeachPuff": "#FFDAB9","Peru": "#CD853F","Pink": "#FFC0CB","Plum": "#DDA0DD","PowderBlue": "#B0E0E6","Purple": "#800080",
        "RebeccaPurple": "#663399","Red": "#FF0000","RosyBrown": "#BC8F8F","RoyalBlue": "#4169E1",
        "SaddleBrown": "#8B4513","Salmon": "#FA8072","SandyBrown": "#F4A460","SeaGreen": "#2E8B57","SeaShell": "#FFF5EE","Sienna": "#A0522D","Silver": "#C0C0C0","SkyBlue": "#87CEEB","SlateBlue": "#6A5ACD","SlateGray": "#708090","SpringGreen": "#00FF7F","SteelBlue": "#4682B4",
        "Tan": "#D2B48C","Teal": "#008080","Thistle": "#D8BFD8","Tomato": "#FF6347","Turquoise": "#40E0D0",
        "Violet": "#EE82EE",
        "Wheat": "#F5DEB3","White": "#FFFFFF","WhiteSmoke": "#F5F5F5",
        "Yellow": "#FFFF00","YellowGreen": "#9ACD32"
    };
    colours = [].concat(colours)

    colours.forEach(colour => {
        for (let colorName in colors) {
            let distance = chroma.distance(colour, colors[colorName]);
            if (distance < minDistance) {
                minDistance = distance;
                closestColor = colorName;
            }
        }
        output.push(closestColor.replace(/([A-Z])/g, ' $1').trim())
        minDistance = Infinity;
        closestColor = "";
    });
    return output.join(' - ');
}

function generateColourItems(colours) {
  colours = [].concat(colours)

  const colourItems = colours.map(colour => {
    return {
        value: colour,
        id: generateUUID()
    };
  });
  return colourItems
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
  colour = [].concat(colour)
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
      if (JSONvariable.attribute == "font-size") {
        JSONvariable.value = JSONvariable.value * 1.3333
      }
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

        if (variable.resolvedType == 'FLOAT') {
          if (variable.name.split("/")[1] == "font-size") {
            value = value / 1.3333
          }
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


export function createPalette(colours, type) {
  let paletteColours = []
  let seed
  switch (type) {
    case 'regular':
      paletteColours = colours
      seed = []
    break;
    case 'ordered-sequential':
      paletteColours = generateSequential(colours)
      seed = colours
    break;
    case 'ordered-diverging':
      paletteColours = generateSequential(colours[0], 10).reverse()
      paletteColours = paletteColours.concat(generateSequential(colours[1], 10))
      seed = colours
    break;
  }

  const colourItems = generateColourItems(paletteColours)
  const seedItems = generateColourItems(colours)

  let palette = {
    meta: {
        id: generateUUID(),
        title: type + ' ' + findClosestColour(seed),
        type: type,
        seed: seedItems,
        comment: '',
    },
    colours: colourItems
  };
  return palette
}