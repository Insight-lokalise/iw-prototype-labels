import * as constants from './constants'
import * as reducer from './reducer'

const state = {
    boxId1: {
        boxId: 'boxId1',
        messages: [{
            message: 'message1',
            msgId: '1',
        }, {
            message: 'message2',
            msgId: '2',
        }],
    },
}

describe('messageBoxes', () => {
    it('handles CREATE_MESSAGEBOX', () => {
        const type = constants.CREATE_MESSAGEBOX
        const payload = {
            boxId: 'boxId2',
            options: { messages: [{
                message: 'message1',
                msgId: '1',
            }] },
        }
        const input = [
            state,
            { type, payload },
        ]
        const expected = {
            boxId1: {
                boxId: 'boxId1',
                messages: [{
                    message: 'message1',
                    msgId: '1',
                }, {
                    message: 'message2',
                    msgId: '2',
                }],
            },
            boxId2: {
                boxId: 'boxId2',
                messages: [{
                    message: 'message1',
                    msgId: '1',
                }],
            },
        }
        expect(reducer.messageBoxes(...input)).toEqual(expected)
    })
    it('handles ADD_MESSAGE', () => {
        const type = constants.ADD_MESSAGE
        const payload = {
            boxId: 'boxId1',
            message: {
                message: 'message3',
                msgId: '3',
            },
        }
        const input = [
            state,
            { type, payload },
        ]
        const expected = {
            boxId1: {
                boxId: 'boxId1',
                messages: [{
                    message: 'message1',
                    msgId: '1',
                }, {
                    message: 'message2',
                    msgId: '2',
                }, {
                    message: 'message3',
                    msgId: '3',
                }],
            },
        }
        expect(reducer.messageBoxes(...input)).toEqual(expected)
    })
    it('handles CLEAR_MESSAGEBOX', () => {
        const type = constants.CLEAR_MESSAGEBOX
        const payload = {
            boxId: 'boxId1',
        }
        const input = [
            state,
            { type, payload },
        ]
        const expected = {
            boxId1: {
                boxId: 'boxId1',
                messages: [],
            },
        }
        expect(reducer.messageBoxes(...input)).toEqual(expected)
    })
    it('handles REMOVE_MESSAGE', () => {
        const type = constants.REMOVE_MESSAGE
        const payload = {
            boxId: 'boxId1',
            msgId: '1',
        }
        const input = [
            state,
            { type, payload },
        ]
        const expected = {
            boxId1: {
                boxId: 'boxId1',
                messages: [{
                    message: 'message2',
                    msgId: '2',
                }],
            },
        }
        expect(reducer.messageBoxes(...input)).toEqual(expected)
    })
    it('handles invalid type', () => {
        const type = 'invalid'
        const payload = {
            boxId: 'boxId2',
            options: { messages: ['message1'] },
        }
        const input = [
            undefined,
            { type, payload },
        ]
        expect(reducer.messageBoxes(...input)).toEqual({})
    })
})
