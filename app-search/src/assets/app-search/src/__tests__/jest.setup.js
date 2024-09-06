import '@testing-library/jest-dom'

jest.mock('app-api-user-service', ()=>{return {
  getUserInformation: jest.fn(() =>
    Promise.resolve({ data: {
        isLoggedIn: true,
        userInformation: {
          cdmUid: 123456,
          currencyCode: 'USD',
          sessionId: '12345sessionId'
        }
      } })
  )
}}, {virtual: true})
