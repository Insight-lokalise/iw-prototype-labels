import React from 'react'
import {render, waitFor, fireEvent} from '@testing-library/react'

import AccountsList from "./AccountsList";


jest.mock('@insight/toolkit-utils/lib/labels', ()=>({
  t: jest.fn(string => string)
}))

jest.mock('app-api-user-service', ()=>({}), {virtual: true})

const addToast = jest.fn()
const setup = async ({
                       filterString,
                     }) => {
  const wrapper = render(<AccountsList
    filterString={filterString}
    addToast={addToast}
  />)

  return {
    ...wrapper,
  }
}

describe('AccountsList render', () => {
  it('renders  Accounts with default and current', async () => {
    const { getByText, getAllByText } = await setup({
      filterString: '',
    })

    await waitFor(() => {
      expect(getByText("Showing 1 - 12 of 25")).toBeInTheDocument()
      expect(getAllByText("Default").length).toEqual(1)
      expect(getAllByText("Current").length).toEqual(1)
    });

  })
  it('renders two account tiles', async () => {
    const { getByText, getAllByText } = await setup({
      filterString: '',
    })

    await waitFor(() => {
      expect(getAllByText("Set as default").length).toEqual(1)
      expect(getAllByText("Default").length).toEqual(1)
    });

  })
  it('should render pagination', async () => {
    const { container } = await setup({
      filterString: '',
    })

    await waitFor(() => {
      expect(container.querySelector(".c-pagination")).toBeInTheDocument()
    });

  })

  it('should render top pagination', async () => {
    const { getByText, container } = await setup({
      filterString: '',
    })

    await waitFor(() => {
      expect(getByText(/Showing 1 - 12 of 25/)).toBeInTheDocument()
      expect(container.querySelector(".c-account-page-size")).toBeInTheDocument()
    });

  })
})
