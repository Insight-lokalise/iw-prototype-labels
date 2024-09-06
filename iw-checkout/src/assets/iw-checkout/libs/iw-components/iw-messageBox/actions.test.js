import * as constants from './constants'
import * as actions from './actions'

describe('actions', () => {
    it('create', () => {
        const args = ['1', '2']
        const expectedAction = {
            type: constants.CREATE_MESSAGEBOX,
            payload: {
                boxId: '1',
                options: '2',
            },
        }
        expect(actions.create(...args)).toEqual(expectedAction)
    })
    it('addMessage', () => {
        const args = ['1', '2']
        const expectedAction = {
            type: constants.ADD_MESSAGE,
            payload: {
                boxId: '1',
                message: '2',
            },
        }
        expect(actions.addMessage(...args)).toEqual(expectedAction)
    })
    it('clear', () => {
        const args = ['1']
        const expectedAction = {
            type: constants.CLEAR_MESSAGEBOX,
            payload: {
                boxId: '1',
            },
        }
        expect(actions.clear(...args)).toEqual(expectedAction)
    })
    it('removeMessage', () => {
        const args = ['1', '2']
        const expectedAction = {
            type: constants.REMOVE_MESSAGE,
            payload: {
                boxId: '1',
                msgId: '2',
            },
        }
        expect(actions.removeMessage(...args)).toEqual(expectedAction)
    })
})
