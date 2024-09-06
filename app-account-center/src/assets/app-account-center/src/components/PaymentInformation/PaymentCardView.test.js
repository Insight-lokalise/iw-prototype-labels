import React from 'react'
import {render} from '@testing-library/react'

import PaymentCardView from './PaymentCardView'

describe('Payment Card component', () => {
  test('renders correctly', () => {
    const { getByText } = render(<PaymentCardView card={{
      cardNum: "************1111",
      cardDesc: "test card 1",
      cardExpMonth: 1,
      cardExpYear: 2023, 
      cardHolderName: "test 1", 
      cardId: 540249,
      cardToken: "************1111",
      cardType: "VISA",
    }}/>)


    expect(getByText(/test card 1/i)).toBeInTheDocument()
    expect(getByText('1/2023')).toBeInTheDocument()
    expect(getByText(/test 1/i)).toBeInTheDocument()
  })
  
  test('renders children correctly', () => {
    const { getByText } = render(<PaymentCardView card={{
      cardNum: "************1111",
      cardDesc: "test card 1",
      cardExpMonth: 1,
      cardExpYear: 2023, 
      cardHolderName: "test 1", 
      cardId: 540249,
      cardToken: "************1111",
      cardType: "VISA",
    }}>
      <div>children test</div>
    </PaymentCardView>)


    expect(getByText(/test card 1/i)).toBeInTheDocument()
    expect(getByText('1/2023')).toBeInTheDocument()
    expect(getByText(/test 1/i)).toBeInTheDocument()
    expect(getByText(/children test/i)).toBeInTheDocument()
  }) 
})

