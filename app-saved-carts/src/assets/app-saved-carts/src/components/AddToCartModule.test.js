import React from 'react';
import { render } from '@testing-library/react';
import AddToCartModal from "./AddToCartModal";

jest.mock('@insight/toolkit-utils/lib/labels', () => ({
  t: jest.fn(string => string)
}))

const setup = async ({cartName, closeModal, goToCheckout, isDone, isModalOpen}) => {
  const wrapper = render(
    <AddToCartModal cartName={cartName} closeModal={closeModal}
                    goToCheckout={goToCheckout} isDone={isDone}  isModalOpen={isModalOpen}/>
  )
  return {
    ...wrapper
  }
}

describe('AddToCartModal Component', () => {
  it('Should render the AddToCartModal with footer', async () => {
    const {getByTestId} = await setup({cartName: 'My cart', closeModal: ()=>{}, goToCheckout: () =>{}, isDone: true, isModalOpen: true });
    expect(getByTestId('modal-with-footer')).toBeInTheDocument();
  })
})

describe('AddToCartModal Component', () => {
  it('Should render the AddToCartModal without footer', async () => {
    const {getByTestId} = await setup({cartName: 'My cart', closeModal: ()=>{}, goToCheckout: () =>{}, isDone: false, isModalOpen: true });
    expect(getByTestId('modal-without-footer')).toBeInTheDocument();
  })
})


