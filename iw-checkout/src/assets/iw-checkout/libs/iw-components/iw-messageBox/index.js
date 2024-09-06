import msgBox from './model'
export default msgBox

export {
    default as IWMessageBox,
} from './iw-messageBox'

export {
    IWMessage,
} from './../iw-message/iw-message.js'

export {
    messageBoxes,
} from './reducer'

// TODO refactor files
// TODO automatically check existence before add/remove
// TODO refactor accesses to selectors (maybe all)
