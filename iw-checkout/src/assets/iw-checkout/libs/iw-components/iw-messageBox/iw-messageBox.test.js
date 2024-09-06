import React from 'react'
import { render } from '@testing-library/react'
import configureMockStore from 'redux-mock-store'
import IWMessageBox from './iw-messageBox'
import msgBox from './model'

const initialStore = {
    messageBoxes: {
        boxId1: {
            boxId: 'boxId1',
            messages: [{
                msgId: '1',
                message: 'message1',
            }],
        },
        boxId2: {
            boxId: 'boxId2',
        },
        boxId4: {
            boxId: 'boxId4',
            messages: [],
        },
    },
}

jest.mock('./model', () => ({ create: jest.fn() }))

const mockStore = configureMockStore([])

let store = mockStore(initialStore)

const Content = (props) => <div className={props.messages[0].message} />

describe('IWMessageBox', () => {
    let wrapper
    describe('with existing boxId', () => {
        afterEach(() => {
            wrapper.unmount()
        })
        it('renders Content when message exists', () => {
          wrapper = render(
            <IWMessageBox
              store={store}
              Content={Content}
              boxId='boxId1'
            />
          )
          const {container} = wrapper
          expect(container.querySelector('.message1')).toBeInTheDocument()
        })
        it('renders null when messages does not exist', () => {
          wrapper = render(
            <IWMessageBox
              store={store}
              Content={Content}
              boxId='boxId2'
            />
          )
          const {container} = wrapper
          expect(container.firstChild).toBe(null)
        })
        it('renders null when messages array is empty', () => {
          wrapper = render(
            <IWMessageBox
              store={store}
              Content={Content}
              boxId='boxId4'
            />
          )
          const {container} = wrapper
          expect(container.firstChild).toBe(null)
        })
    })
    it('creates box w/ new boxId', () => {
        wrapper = render(
            <IWMessageBox
                store={store}
                Content={Content}
                boxId='boxId3'
            />
        )
        expect(msgBox.create.mock.calls.length).toBe(1)
    })
})
