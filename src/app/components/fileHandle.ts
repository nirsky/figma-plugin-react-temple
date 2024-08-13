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

function generateUUID(length = 10) {
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