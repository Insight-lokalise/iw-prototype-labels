import React from 'react'
import { render, waitFor, fireEvent } from '@testing-library/react'

import PaymentsList from "./PaymentsList";

jest.mock('@insight/toolkit-utils/lib/labels', ()=>({
  t: jest.fn(string => string)
}))

jest.mock('app-api-user-service', ()=>{return {}}, {virtual: true})

  const ccCards =  [
  {
    "storedCardId": 540249,
    "lpWebLoginProfileId": 5752851,
    "storedCardDesc": "test card 1",
    "storedCardHolderName": "test 1",
    "storedCardToken": "************1111",
    "worldPayToken": null,
    "storedCardExpMonth": 1,
    "storedCardExpYear": 2023,
    "storedCardType": "VISA",
    "isDefaultCard": true,
    "storedCardMethodId": 2,
    "storedCardPoNum": null,
    "displayCardNum": "************1111",
    "createdOn": 1641599695883,
    "updatedOn": 1641599695883,
    "exceptionExists": false,
    "exceptionsList": null,
    "storedCardDetailsChanged": false,
    "storedCardNewExpMonth": 0,
    "storedCardNewExpYear": 0
  },
    {
      "storedCardId": 540252,
      "lpWebLoginProfileId": 5752851,
      "storedCardDesc": "test card 2 ",
      "storedCardHolderName": "test 2",
      "storedCardToken": "************4242",
      "worldPayToken": null,
      "storedCardExpMonth": 1,
      "storedCardExpYear": 2025,
      "storedCardType": "VISA",
      "isDefaultCard": false,
      "storedCardMethodId": 2,
      "storedCardPoNum": null,
      "displayCardNum": "************4242",
      "createdOn": 1641859249713,
      "updatedOn": 1641859249713,
      "exceptionExists": false,
      "exceptionsList": null,
      "storedCardDetailsChanged": false,
      "storedCardNewExpMonth": 0,
      "storedCardNewExpYear": 0
    }
  ]
  const pcCards = [
  {
    "storedCardId": 540238,
    "lpWebLoginProfileId": 5752851,
    "storedCardDesc": "Pcard MC",
    "storedCardHolderName": "Test Name",
    "storedCardToken": "************4444",
    "worldPayToken": null,
    "storedCardExpMonth": 8,
    "storedCardExpYear": 2027,
    "storedCardType": "MC",
    "isDefaultCard": true,
    "storedCardMethodId": 3,
    "storedCardPoNum": null,
    "displayCardNum": "************4444",
    "createdOn": 1641400545213,
    "updatedOn": 1641400545213,
    "exceptionExists": false,
    "exceptionsList": null,
    "storedCardDetailsChanged": false,
    "storedCardNewExpMonth": 0,
    "storedCardNewExpYear": 0
  }
]

const setup = async ({
  isCreditCard,
  isLoading,
  cards,
}) => {
  const addToast = jest.fn()
  const setIsLoading = jest.fn()
  const getCards = jest.fn()
  const wrapper = render(<PaymentsList
    isCreditCard={isCreditCard} 
    addToast={addToast}
    setIsLoading={setIsLoading}
    getCards={getCards}
    isLoading={isLoading}
    cards={cards}
  />)

  return {
    ...wrapper,
  }
}

describe('Payments List', () => {
  test('renders correctly', async () => {
    const { getByText } = await setup({ isCreditCard: true, isLoading: true, cards:null })
 
    expect(getByText('Credit cards')).toBeInTheDocument()
    expect(getByText('Loading...')).toBeInTheDocument() 
  })

  test('renders procurment and loading if cards are null', async () => {
    const { getByText } = await setup({ isCreditCard: false, isLoading: true, cards:null })
 
    expect(getByText('Procurement cards')).toBeInTheDocument()
    expect(getByText('Loading...')).toBeInTheDocument() 
  })

  test('renders credit card verbiage if isCreditCard is true', async () => {
    const { getByText } = await setup({ isCreditCard: true, isLoading: true, cards:[]})
 
    expect(getByText('Credit cards')).toBeInTheDocument()
    expect(getByText('No credit cards available')).toBeInTheDocument() 
  })

  test('renders procurment card verbiage if isCreditCard is false', async () => {
    const { getByText } = await setup({ isCreditCard: false, isLoading: true, cards:[]})
 
    expect(getByText('Procurement cards')).toBeInTheDocument()
    expect(getByText('No procurement cards available')).toBeInTheDocument() 
  })

  test('renders credit card with default', async () => {
    const { getAllByText } = await setup({ isCreditCard: true, cards: ccCards, isLoading: false })
    
    await waitFor(() => {
      expect(getAllByText("Default").length).toEqual(1)
      expect(getAllByText("Set as default").length).toEqual(1)
    })
  })

  test('renders procurement card with default', async () => {
    const { getAllByText } = await setup({ isCreditCard: false, cards: pcCards, isLoading: false })
    
    await waitFor(() => {
      expect(getAllByText("Default").length).toEqual(1)
    })
  })
  
  test('test address delete confirmation modal', async () => {
    const { getByText, getByTestId } = await setup({ isCreditCard: true, cards: ccCards, isLoading: false })

    await waitFor(() => {
      expect(getByTestId("card-delete-button-540252")).toBeInTheDocument()
      fireEvent.click(getByTestId("card-delete-button-540252"))
      expect(getByText("Are you sure you want to delete this card?")).toBeInTheDocument()
    })
  })
})
