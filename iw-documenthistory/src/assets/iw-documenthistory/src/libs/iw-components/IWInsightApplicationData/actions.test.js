import configureMockStore from 'redux-mock-store'
import reduxThunk from 'redux-thunk'

import * as actions from './actions'
import * as constants from './types'

let store
const mockStore = configureMockStore([reduxThunk])
jest.mock('./model', () => ({
  loadInsightApplicationData: jest.fn(() => Promise.resolve('mockReturn')),
}))

describe('actions', () => {
  describe('loadInsightApplicationData', () => {
    beforeEach(() => {
      store = mockStore({})
    })
    afterEach(() => {
      store.clearActions()
    })
    it('async dispatches a LOAD_INSIGHT_APPLICATION_DATA type action', () => {
      const action = actions.loadInsightApplicationData()
      return store.dispatch(action).then(() => {
        expect(store.getActions()).toContainEqual({
          type: constants.LOAD_INSIGHT_APPLICATION_DATA,
          payload: 'mockReturn',
        })
      })
    })
  })
})
