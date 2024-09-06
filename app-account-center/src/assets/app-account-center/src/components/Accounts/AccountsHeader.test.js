import React from 'react'
import {render} from '@testing-library/react'

import AccountsHeader from "./AccountsHeader";

jest.mock('@insight/toolkit-utils/lib/labels', ()=>({
  t: jest.fn(string => string)
}))

jest.mock('app-api-user-service', ()=>{return {
  getUserInformation: jest.fn(() =>
    Promise.resolve({ data: {
      isLoggedIn: true,
      userInformation: {
        account: 123456
      }
    } })
  )
}}, {virtual: true})

window.scroll = jest.fn()

const setup = async () => {
  const setFilterString = jest.fn()
  const wrapper = render(<AccountsHeader
    setFilterString={setFilterString}
  />)

  return {
    ...wrapper
  }
}

describe('AccountsHeader', () => {
  it('renders accounts page header', async () => {
    const { getByText, getByTestId } = await setup()

    expect(getByText('Accounts')).toBeInTheDocument()
    expect(getByText('Search accounts')).toBeInTheDocument()
    expect(getByTestId('accountsFilterInput')).toBeInTheDocument()
    expect(getByTestId('accountsFilterButton')).toBeInTheDocument()
  })

})
