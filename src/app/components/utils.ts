
//import { chroma } from 'chroma-js'
import chroma from "chroma-js"

type Control = {
    type: 'swap' | 'up' | 'down' | 'delete'; // Enumerate the possible types
    name: string;
    position: number; 
    tooltip: string;
};

type Meta = {
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
/*
export function generateSequential(colour, steps = 20) {
    let sequence = new Palette
    sequence.seed = [].concat(colour)[0]
    let newColours = [sequence.seed];
    let newColour = sequence.seed;
    let brightness = chroma(sequence.seed).luminance();

    while (brightness < 0.75) {
        newColour = chroma(newColour).brighten().hex();
        
        brightness = chroma(newColour).luminance();
        if (brightness < 0.95) {
            newColours.unshift(newColour);
        }
    }
    newColour = sequence.seed;
    brightness = chroma(sequence.seed).luminance();

    while (brightness > 0.25) {
        newColour = chroma(newColour).darken().hex();
        brightness = chroma(newColour).luminance();
        if ( brightness > 0.05) {
            newColours.push(newColour);
        }
    }
    newColours = chroma.bezier(newColours).scale().correctLightness();

    for (let i = 0; i < steps; i++) {
        sequence.addColour(newColours(i / steps).hex())
    }
    return sequence;
}*/