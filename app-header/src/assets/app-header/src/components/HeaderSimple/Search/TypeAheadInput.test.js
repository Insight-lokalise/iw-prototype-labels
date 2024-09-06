import React from 'react'
import { fireEvent, render } from '@testing-library/react'
import TypeAheadInput from './TypeAheadInput'
import KEY_CODES from '@insight/toolkit-utils/lib/types/keyCodes'

const setup = async ({hint, value}) => {

  const handleChange = jest.fn()
  const handleFocus = jest.fn()
  const handleKeyUp = jest.fn()

  const wrapper = render(
    <TypeAheadInput
        name='header'
        hint={hint}      
        value={value}
        handleChange={handleChange}
        handleFocus={handleFocus}
        handleKeyUp={handleKeyUp}
        placeholder='placeholder text'
      />)

  return {
    ...wrapper,
    handleChange,
    handleFocus,
    handleKeyUp,
  }
}

describe('TypeAheadInput tests', () => {
  test('Render TypeAheadInput', async () => {
    const { container } = await setup({hint: 'mouse', value: 'mo'});
    expect(container.querySelector('.c-type-ahead-input').value).toEqual('mo')
    expect(container.querySelector('.c-type-ahead-hint').value).toEqual('mouse')
  })
  test('Test hint disabled', async () => {
    const { container } = await setup({hint: '', value: 'mo'});
    expect(container.querySelector('.c-type-ahead-input').value).toEqual('mo')
    expect(container.querySelector('.c-type-ahead-hint')).not.toBeInTheDocument()
  })
  test('Test input events', async () => {
    const { container, handleFocus, handleChange, handleKeyUp } = await setup({hint: 'mouse', value: 'mo'});
    const valueInput = container.querySelector('.c-type-ahead-input')
    
    fireEvent.focus(valueInput)
    expect(handleFocus).toHaveBeenCalled()

    fireEvent.keyUp(valueInput, {
      target: {value: 'mouse'}
    })
    expect(handleKeyUp).toHaveBeenCalled()
    
    fireEvent.change(valueInput, {
      target: {value: 'mouse'}
    })
    expect(handleChange).toHaveBeenCalled()
  })
  test('Test tab key to autocomplete typehead hint', async () => {
    const { container, handleChange } = await setup({hint: 'mouse', value: 'mo'});
    const valueInput = container.querySelector('.c-type-ahead-input')
    fireEvent.keyDown(valueInput, {
      keyCode: KEY_CODES.TAB
    })
    expect(handleChange).toHaveBeenCalled()
  })
  test('Test tab key to move out of field when value equals hint', async () => {
    const { container, handleChange } = await setup({hint: 'mouse', value: 'mouse'});
    const valueInput = container.querySelector('.c-type-ahead-input')
    fireEvent.keyDown(valueInput, {
      keyCode: KEY_CODES.TAB
    })
    expect(handleChange).not.toHaveBeenCalled()
  })
})
