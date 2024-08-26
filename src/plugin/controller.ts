import * as utils from '../app/components/utils'

figma.showUI(__html__);
figma.ui.resize(830, 1000)


figma.ui.onmessage = (msg) => {
 
  if (msg.type === 'save-variables') {
    utils.saveVariable(msg.msg)
  }

  if (msg.type === 'request-variables') {
    utils.parseVariables()
  }
  
};
