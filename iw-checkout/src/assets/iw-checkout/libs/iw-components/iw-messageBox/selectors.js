import get from 'lodash-es/get'
import some from 'lodash-es/some'

export function hasMsg(state, boxId, msgId) {
    const messages = get(state, ['messageBoxes', boxId, 'messages'], [])
    return some(messages, msg => msg.msgId === msgId)
    // msgBox && msgBox.messages.filter(msg => msg.msgId === msgId).length !== 0
}

export function hasMsgWithSeverity(state, boxId, severity) {
    const messages = get(state, ['messageBoxes', boxId, 'messages'], [])
    return some(messages, msg => msg.severity === severity)
    // get(state, ['messages', boxId, 'messages'], []).filter(msg => msg.severity === severity).length > 0
}
