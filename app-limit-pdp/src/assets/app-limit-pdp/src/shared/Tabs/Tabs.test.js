import React from 'react'
import { render, screen, fireEvent } from '@testing-library/react'
import { Tabs } from './Tabs'
import { Tab } from './Tab'

const clickHandler = jest.fn()
describe('<Tabs />', () => {
  beforeEach(() => {
    render(
      <Tabs selected="tab-second-tab">
        <Tab>first tab</Tab>
        <Tab id="second-tab">Content for the second tab</Tab>
        <Tab onClick={clickHandler}>third tab</Tab>
      </Tabs>
    )
  })
  it('should render without a problem', () => {
    expect(screen.getByTestId('tabs'))
  })
  it('should render 3 tabs', () => {
    expect(screen.getByRole('button', { name: /tab-0/i }))
    expect(screen.getByRole('button', { name: /second-tab/i }))
    expect(screen.getByRole('button', { name: /tab-2/i }))
  })
  it('should show the data for the default tab selected', async () => {
    const selectedTabContent = await screen.findByText(
      'Content for the second tab'
    )
    expect(selectedTabContent)
  })
  it('should fire click handler on click of tab', async () => {
    fireEvent.click(screen.getByRole('button', { name: /tab-2/i }))
    expect(clickHandler).toBeCalledTimes(1)
  })
  it.todo('should select a new tab')
})
