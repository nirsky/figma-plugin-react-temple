
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
      "Almond": "#EFDECD",
      "AntiqueBrass": "#CD9575",
      "Apricot": "#FDD9B5",
      "Aquamarine": "#78DBE2",
      "Asparagus": "#87A96B",
      "AtomicTangerine": "#FFA474",
      "BananaMania": "#FAE7B5",
      "Beaver": "#9F8170",
      "Bittersweet": "#FD7C6E",
      "Black": "#000000",
      "BlizzardBlue": "#ACE5EE",
      "Blue": "#1F75FE",
      "BlueBell": "#A2A2D0",
      "BlueGreen": "#0D98BA",
      "BlueViolet": "#7366BD",
      "Blush": "#DE5D83",
      "BrickRed": "#CB4154",
      "Brown": "#B4674D",
      "BurntOrange": "#FF7F49",
      "BurntSienna": "#EA7E5D",
      "CadetBlue": "#B0B7C6",
      "Canary": "#FFFF99",
      "CaribbeanGreen": "#00CC99",
      "CarnationPink": "#FFAACC",
      "Cerise": "#DD4492",
      "Cerulean": "#1DACD6",
      "Chestnut": "#BC5D58",
      "Copper": "#DD9475",
      "Cornflower": "#9ACEEB",
      "CottonCandy": "#FFBCD9",
      "Dandelion": "#FDDB6D",
      "Denim": "#2B6CC4",
      "DesertSand": "#EFCDB8",
      "Eggplant": "#6E5160",
      "ElectricLime": "#CEFF1D",
      "Fern": "#71BC78",
      "ForestGreen": "#6DAE81",
      "Fuchsia": "#C364C5",
      "FuzzyWuzzy": "#CC6666",
      "Gold": "#E7C697",
      "Goldenrod": "#FCD975",
      "GrannySmithApple": "#A8E4A0",
      "Gray": "#95918C",
      "Green": "#1CAC78",
      "GreenYellow": "#F0E891",
      "HotMagenta": "#FF1DCE",
      "Inchworm": "#B2EC5D",
      "Indigo": "#5D76CB",
      "JazzberryJam": "#CA3767",
      "JungleGreen": "#3BB08F",
      "LaserLemon": "#FEFE22",
      "Lavender": "#FCB4D5",
      "LemonYellow": "#FFF44F",
      "MacaroniandCheese": "#FFBD88",
      "Magenta": "#F664AF",
      "MagicMint": "#AAF0D1",
      "Mahogany": "#CD4A4C",
      "Maize": "#EDD19C",
      "Manatee": "#979AAA",
      "MangoTango": "#FF8243",
      "Maroon": "#C8385A",
      "Mauvelous": "#EF98AA",
      "Melon": "#FDBCB4",
      "MidnightBlue": "#1A4876",
      "MountainMeadow": "#30BA8F",
      "Mulberry": "#C54B8C",
      "NavyBlue": "#1974D2",
      "NeonCarrot": "#FFA343",
      "OliveGreen": "#BAB86C",
      "Orange": "#FF7538",
      "Orchid": "#E6A8D7",
      "OuterSpace": "#414A4C",
      "OutrageousOrange": "#FF6E4A",
      "PacificBlue": "#1CA9C9",
      "Peach": "#FFCFAB",
      "Periwinkle": "#C5D0E6",
      "PineGreen": "#158078",
      "PinkFlamingo": "#FC74FD",
      "PinkSherbet": "#F78FA7",
      "Plum": "#8E4585",
      "PurpleHeart": "#7442C8",
      "PurpleMountainsMajesty": "#9D81BA",
      "PurplePizzazz": "#FE4EDA",
      "RadicalRed": "#FF496C",
      "RawSienna": "#D68A59",
      "RawUmber": "#714B23",
      "RazzleDazzleRose": "#FF48D0",
      "Razzmatazz": "#E3256B",
      "Red": "#EE204D",
      "RedOrange": "#FF5349",
      "RedViolet": "#C0448F",
      "RobinEggBlue": "#1FCECB",
      "RoyalPurple": "#7851A9",
      "Salmon": "#FF9BAA",
      "Scarlet": "#FC2847",
      "ScreaminGreen": "#76FF7A",
      "SeaGreen": "#93DFB8",
      "Sepia": "#A5694F",
      "Shadow": "#8A795D",
      "Shamrock": "#45CEA2",
      "ShockingPink": "#FB7EFD",
      "Silver": "#CDC5C2",
      "SkyBlue": "#80DAEB",
      "SpringGreen": "#ECEABE",
      "Sunglow": "#FFCF48",
      "SunsetOrange": "#FD5E53",
      "Tan": "#FAA76C",
      "TickleMePink": "#FC89AC",
      "Timberwolf": "#DBD7D2",
      "TropicalRainForest": "#17806D",
      "Tumbleweed": "#DEAA88",
      "TurquoiseBlue": "#77DDE7",
      "UnmellowYellow": "#FFFF66",
      "VioletPurple": "#926EAE",
      "VividTangerine": "#FFA089",
      "VividViolet": "#8F509D",
      "White": "#FFFFFF",
      "WildBlueYonder": "#A2ADD0",
      "WildStrawberry": "#FF43A4",
      "WildWatermelon": "#FC6C85",
      "Wisteria": "#CDA4DE",
      "Yellow": "#FCE883",
      "YellowGreen": "#C5E384",
      "YellowOrange": "#FFAE42"
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
            let rgb: any = Object.values(variable['valuesByMode'])
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