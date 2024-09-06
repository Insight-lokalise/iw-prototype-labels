import React from 'react'
import { render } from '@testing-library/react'
import configureMockStore from 'redux-mock-store'
import reduxThunk from 'redux-thunk'

import IWInsightApplicationData from './IWInsightApplicationData'
import { loadInsightApplicationData } from './actions'
import { insightApplicationData as mockData } from './../IWInsightApplicationData/__mocks__/InsightApplicationDataObject'

let wrapper
let store
const mockStore = configureMockStore([reduxThunk])
jest.mock('./actions', () => ({
  loadInsightApplicationData: jest.fn(() => () => Promise.resolve({ type: 'LOAD_DATA', payload: {} })),
}))

// Prep the window with a mocked InsightApplicationDataObject
window.InsightApplicationDataObject = {
  ready: () => Promise.resolve(mockData),
}

describe('IWInsightApplicationData', () => {
  beforeEach(() => {
    store = mockStore({})
  })
  afterEach(() => {
    jest.clearAllMocks()
  })

  it('renders children only after loading insightApplicationData', done => {
    const {queryByTestId, getByTestId} = render(
      <IWInsightApplicationData store={store}>
        <div className="child" data-testid="child" />
      </IWInsightApplicationData>
    )
    expect(queryByTestId('child')).not.toBeInTheDocument()
    setTimeout(() => {
      try {
        expect(getByTestId('child')).toBeInTheDocument()
        done()
      } catch (e) {
        done.fail(e)
      }
    })
  })

  it('calls loadInsightApplicationData after mounting', () => {
    expect(loadInsightApplicationData).not.toHaveBeenCalled()
    render(
      <IWInsightApplicationData store={store}>
        <div className="child"/>
      </IWInsightApplicationData>
    )
    expect(loadInsightApplicationData).toHaveBeenCalled()
  })
})
