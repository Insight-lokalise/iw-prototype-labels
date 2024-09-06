import { loadUser } from './../user'
import { InsightUserObjectData } from './../__mocks__/InsightUserObject'

describe('User', () => {
  describe('loadUser', () => {
    it('Filters only properties we use and formats URLs', () => {
      window.InsightUserObject = {
        ready: jest.fn(() => {
          const promise = Promise.resolve(InsightUserObjectData)
          promise.fail = promise.catch
          return promise
        }),
      }

      return loadUser().then(d => {
        // Using a snapshot here because it would otherwise be a manual
        // task of copying output then pasting it here as expected.
        expect(d).toMatchSnapshot()
      })
    })
  })
})
