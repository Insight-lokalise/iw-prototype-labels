/**
 * @example
 * import MsgBox from './..../components/iw-messageBox'
 *
 * MsgBox.addMsg('shopping-cart', { text: 'your message', severity: 'info', hideIcon: true })
 *
 * MsgBox.clear('shopping-cart') // to remove all displayed messages. Maybe not what you're looking for.
 *
 * // To remove a specific message, you must create an ID for it when you originally post the message
 * MsgBox.addMsg('shopping-cart', { msgId: 'mustSelectRequestorGroup', text: 'your message', severity: 'info', hideIcon: true })
 * MsgBox.removeMsg('shopping-cart', 'mustSelectRequestorGroup')
 */

import get from 'lodash-es/get'

/**
 * I'm not sure how I feel about importing the store from the storeConfig.
 * Another alternative would be to make this a very high level Component
 * (kind of alongside the router) that connects to dispatch and state updates
 * from a map[State|Props]ToProps.
 */
import { store } from './../../../app/libs/storeConfig'
const { dispatch, getState } = store

import * as MessageBox from './actions'
import * as selectors from './selectors'

export default {
    create,
    addMsg,
    hasMsg,
    clear,
    removeMsg,
    msg,
    hasMsgWithSeverity,
}

/**
* Create a message.
* @param  {String} msgName Id of the message we are updating.
* @param  {Object} options Parameters for the created message component. Currently unused
*                          but this will be used for configuring behavior of a particular MessageBox
* @return {Undefined}
*/
export function create(boxId, options) {
    if (!('messages' in options)) options.messages = []
    dispatch(MessageBox.create(boxId, options))
}

/**
 * Clear all of the messages from a MessageBox
 * @param  {String} boxId id of the MessageBox to clear
 * @return {undefined}
 */
export function clear(boxId) {
    dispatch(MessageBox.clear(boxId))
}

/**
 * Add a message to a MessageBox. If a message with the same msgId exists,
 * it is not added to the box. Accepts options:
 *  text<String>
 *  severity<String>
 *  scrollTo<CSS selector>
 * @param {String} boxId id of the MessageBox to clear
 * @param {Object} message  The message object to add. Usually looks like:
 *                          { text<String>, severity<String> }
 * @return {undefined}
 */
export function addMsg(boxId, message) {
    if (!message.msgId || (message.msgId && !hasMsg(boxId, message.msgId))) {
      dispatch(MessageBox.addMessage(boxId, message))
    }
}

/**
 * Whether @param boxId messageBox has a message with the msgId of @param msgId
 * @param  {[type]}  boxId [description]
 * @param  {[type]}  msgId [description]
 * @return {Boolean}       [description]
 */
export function hasMsg(boxId, msgId) {
    return selectors.hasMsg(getState(), boxId, msgId)
}

/**
 * Whether @param boxId messageBox has a message of severity @param severity
 * @param  {[type]}  boxId    [description]
 * @param  {[type]}  severity [description]
 * @return {Boolean}          [description]
 */
export function hasMsgWithSeverity(boxId, severity) {
    return selectors.hasMsgWithSeverity(getState(), boxId, severity)
}

/**
 * Remove a specific message from a MessageBox. A message must have a msgId key
 * when it is added for it to be removed dynamically.
 *
 * @example
 * MsgBox.addMsg('shopping-cart', { msgId: 'mustSelectRequestorGroup', text: 'your message', severity: 'info', hideIcon: true })
 * MsgBox.removeMsg('shopping-cart', 'mustSelectRequestorGroup')
 *
 * @param {String} boxId    id of the MessageBox
 * @param {String} msgId    id of the message to remove.
 * @return {undefined}
 */
export function removeMsg(boxId, msgId) {
    if (hasMsg(boxId, msgId)) {
        dispatch(MessageBox.removeMessage(boxId, msgId))
    }
}

/**
 *  Avoid using this if you can. It may be reasonable when checking the state of
 *  a MessageBox but directly reading from state may be better.
 *
 *  When displaying messages, prefer the props of the Content function of the Message:
 *
 *  <Message msgName="test" Content={props => <span>props.text</span>} />
 *
 * Get the text of the Message w/ message id @param msgName
 * @param  {String} msgName Id of the message we are getting.
 * @return {undefined}
 */
export function msg(boxId, msgId) {
    const state = getState()
    return get(state, ['messageBoxes', boxId, 'messages', msgId, 'text'], '')
}

/**
 * Find a DOM Node via @param CSSSelector and scroll it within view.
 * @param  {String} scrollTo CSS selector of node to scroll to
 * @return {Undefined}
 */
export function scrollIntoView(CSSSelector) {
    let element
    if (CSSSelector) {
        element = document.querySelector(CSSSelector)
    }
    if(element) {
      element.scrollIntoView({ behavior: 'smooth' })
      window.scrollBy(0, -10) // this is to scroll a bit extra
    }
}
