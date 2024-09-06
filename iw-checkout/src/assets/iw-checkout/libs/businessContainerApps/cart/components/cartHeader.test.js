import React from 'react'
import {act, render, fireEvent} from '@testing-library/react'

import CartHeader from './cartHeader';
import CartView from './cartView';

jest.mock('@insight/toolkit-utils/lib/labels', ()=>({
  t: jest.fn(string => string)
}))

const setup = async ({ isCES, emptyCart, showProductImages, toggleProductImages,updateCartItemQuantities, cartItemTentativeQuantities }) => {
    const wrapper = render(
        <CartHeader 
            isCES={isCES} 
            showProductImages={showProductImages}
            toggleProductImages={toggleProductImages}
            updateCartItemQuantities={updateCartItemQuantities}
            cartItemTentativeQuantities={cartItemTentativeQuantities}
            cart={{}}
            emptyCart={emptyCart}
        />)
    return {...wrapper}
}

describe('ShowItemsInCartHeader', () => {
  test('renders Update all quantities & Hide images', async () => {
    const { queryByText } = await setup({ isCES:false, showProductImages:false })
    expect(queryByText("Update all quantities")).toBeInTheDocument()
    expect(queryByText("Show images")).toBeInTheDocument()
  })

  test('renders Update all quantities & Show images', async () => {
    const { queryByText } = await setup({ isCES:false, showProductImages:true })
    expect(queryByText("Update all quantities")).toBeInTheDocument()
    expect(queryByText("Hide images")).toBeInTheDocument()
  })

  test('renders neither Update all quantities or Hide images', async () => {
    const { queryByText } = await setup({ isCES:true})
    expect(queryByText('Update all quantities')).not.toBeInTheDocument();
    expect(queryByText("Show images")).not.toBeInTheDocument();
    expect(queryByText("Hide images")).not.toBeInTheDocument();
  })

  test('should toggleProductImages been called when on click', async() => {
    const toggleProductImages = jest.fn()
    const { container } = await setup({ toggleProductImages:toggleProductImages })
    fireEvent.click(container.querySelector('#toggleProductImage'))
    expect(toggleProductImages).toBeCalledTimes(1)
  })

  test('udpateAllQuanrities should be disbaled when no cartItemTentativeQuantities', async() => {
    const { container } = await setup({cartItemTentativeQuantities:[] })
    expect(container.querySelector('#updateAllQuantities').classList.contains('section__header-disabled')).toBe(true)
  })

  test('udpateAllQuanrities should be enabaled when cartItemTentativeQuantities is not empty', async() => {
    const { container } = await setup({cartItemTentativeQuantities:['',''] })
    expect(container.querySelector('#updateAllQuantities').classList.contains('section__header-disabled')).toBe(false)
  })

  test('render empty Item when press emptyCart', async() => {
    const emptyCart = jest.fn()
    const { container } = await setup({ emptyCart:emptyCart })
    fireEvent.click(container.querySelector('#emptyCart'))
    expect(emptyCart).toBeCalledTimes(1)
  })
})
