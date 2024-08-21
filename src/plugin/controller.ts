import chroma from "chroma-js"
import * as utils from '../app/components/utils'

figma.showUI(__html__);
figma.ui.resize(800, 1000)



/*function createCollection() {
  const collection = figma.variables.createVariableCollection(`themes-for-tableau`)
  const variable = figma.variables.createVariable(`All/saFontFamily`, collection, "STRING")
  variable.setValueForMode(collection.modes[0].modeId, 'Comic Sans MS' )
}*/



figma.ui.onmessage = (msg) => {
 
  if (msg.type === 'save-variables') {
    utils.saveVariable(msg.msg)
  }

  if (msg.type === 'request-variables') {
    utils.parseVariables()
  }
  
};
