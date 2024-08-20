import chroma from "chroma-js"

figma.showUI(__html__);
figma.ui.resize(800, 1000)

interface JSONvariable {
  style: string;
  attribute: string;
  value: any;
  type: VariableResolvedDataType;
}

/*function createCollection() {
  const collection = figma.variables.createVariableCollection(`themes-for-tableau`)
  const variable = figma.variables.createVariable(`All/saFontFamily`, collection, "STRING")
  variable.setValueForMode(collection.modes[0].modeId, 'Comic Sans MS' )
}*/

async function saveVariable(JSONvariable: JSONvariable) {
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
  if (JSONvariable.type == 'COLOR') {
    colourRGB = chroma(JSONvariable.value).rgb()
    JSONvariable.value = {r: colourRGB[0] / 255, g: colourRGB[1] / 255, b: colourRGB[2] / 255}
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
          console.log('JSONvariable', JSONvariable)
          variable.setValueForMode(collection.modes[0].modeId, JSONvariable.value) 
          console.log('variable', variable)
        } else {
          variable.remove()
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
      console.log('Variable could not be created')
    }
  }
}

figma.ui.onmessage = (msg) => {
 
  if (msg.type === 'save-variables') {
    console.log('msg received', msg)
    console.log('saving variable')
    saveVariable(msg.msg)
    console.log('Variable saved')
  }
  
};
