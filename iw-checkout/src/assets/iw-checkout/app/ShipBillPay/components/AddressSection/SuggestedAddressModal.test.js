import React from 'react'
import { fireEvent } from '@testing-library/react'
import { render } from '../../../../__tests__/test-utils'
import { enteredAddress, suggestedAddresses } from '../../../../__tests__/mockAddresses'
import SuggestedAddressModal from './SuggestedAddressModal'

jest.mock('@insight/toolkit-utils/lib/labels', ()=>{return {
  t: jest.fn(string => string)
}})

describe('<SuggestedAddressModal> tests', () => {
  test('should render', () => {
    const handleSuggestedAddressesContinueClick = jest.fn();
    const toggleShowSuggestedAddressesModal = jest.fn()

    const { getByText } = render(
      <SuggestedAddressModal enteredAddress={enteredAddress} 
      handleFormSubmit={handleSuggestedAddressesContinueClick}
      onHide={toggleShowSuggestedAddressesModal}
      suggestedAddresses={suggestedAddresses} />
    )

    expect(getByText('Address Validation')).toBeInTheDocument();
  })

  test('should select a new address', () => {
    const handleSuggestedAddressesContinueClick = jest.fn();
    const toggleShowSuggestedAddressesModal = jest.fn()

    const { getAllByRole } = render(
      <SuggestedAddressModal enteredAddress={enteredAddress} 
      handleFormSubmit={handleSuggestedAddressesContinueClick}
      onHide={toggleShowSuggestedAddressesModal}
      suggestedAddresses={suggestedAddresses} />
    )
    
    const radioInputs = getAllByRole("radio");
    fireEvent.click(radioInputs[2]);

		expect(radioInputs[2]).toBeChecked()
  })

  test('should filter the radio inputs and keep the first suggestion checked', (done) => {
    const handleSuggestedAddressesContinueClick = jest.fn();
    const toggleShowSuggestedAddressesModal = jest.fn()

    const { getAllByRole, getByRole } = render(
      <SuggestedAddressModal enteredAddress={enteredAddress} 
      handleFormSubmit={handleSuggestedAddressesContinueClick}
      onHide={toggleShowSuggestedAddressesModal}
      suggestedAddresses={suggestedAddresses} />
    )
    
    let radioInputs = getAllByRole("radio");
    const searchButton = getByRole('button', { name: /search/i })
    const searchInput = getByRole('textbox')

    fireEvent.change(searchInput, { target: { value: '1111' } })
    fireEvent.click(searchButton)
    
    setTimeout(() => {
      expect(radioInputs[1]).toBeChecked()
      done()
    }, 400)
  })

  test('should keep entered address selected after filter', (done) => {
    const handleSuggestedAddressesContinueClick = jest.fn();
    const toggleShowSuggestedAddressesModal = jest.fn()

    const { getAllByRole, getByRole } = render(
      <SuggestedAddressModal enteredAddress={enteredAddress} 
      handleFormSubmit={handleSuggestedAddressesContinueClick}
      onHide={toggleShowSuggestedAddressesModal}
      suggestedAddresses={suggestedAddresses} />
    )
    
    const radioInputs = getAllByRole("radio");
    const searchButton = getByRole('button', { name: /search/i })
    const searchInput = getByRole('textbox')
    
    fireEvent.click(radioInputs[0])
    fireEvent.change(searchInput, { target: { value: '1111' } })
    fireEvent.click(searchButton)

    setTimeout(() => {
      expect(radioInputs[0]).toBeChecked()
      done()
    }, 400)
  })

  test('should select entered address if filter finds no results', (done) => {
    const handleSuggestedAddressesContinueClick = jest.fn();
    const toggleShowSuggestedAddressesModal = jest.fn()

    const { getAllByRole, getByRole } = render(
      <SuggestedAddressModal enteredAddress={enteredAddress} 
      handleFormSubmit={handleSuggestedAddressesContinueClick}
      onHide={toggleShowSuggestedAddressesModal}
      suggestedAddresses={suggestedAddresses} />
    )
    
    let radioInputs = getAllByRole("radio");
    const searchButton = getByRole('button', { name: /search/i })
    const lengthBeforeFilter = radioInputs.length;
    const searchInput = getByRole('textbox')
    
    fireEvent.click(radioInputs[0])
    fireEvent.change(searchInput, { target: { value: '1234' } })
    fireEvent.click(searchButton)
    
    radioInputs = getAllByRole("radio")
    const lengthAfterFilter = radioInputs.length - 1

    setTimeout(() => {
      expect(lengthAfterFilter).toBeLessThan(lengthBeforeFilter)
      expect(radioInputs[0]).toBeChecked()
      done()
    }, 400)
  })
})