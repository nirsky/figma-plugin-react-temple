
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
    console.log('loadedPalettes', loadedPalettes)
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
    const styles = theme.theme.styles;

for (const style in styles) {
    if (styles.hasOwnProperty(style)) {
        console.log(`Style: ${style}`);

        const attributes = styles[style];
        
        for (const attribute in attributes) {
            if (style.hasOwnProperty(attribute)) {
                const value = style[attribute];
                console.log(`  Subkey: ${attribute}, Value: ${value}`);
                
                // Call your function here, e.g., test(value);
            }
        }
    }
}
}