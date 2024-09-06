import React from 'react';
import { render } from '@testing-library/react';
import CharacterCounter from "./CharacterCounter";

jest.mock('@insight/toolkit-utils/lib/labels', () => ({
  t: jest.fn(string => string)
}))


const setup = async () => {
  const wrapper = render(
    <CharacterCounter currentLength={4} maxLength={100}/>
    )
  return {
    ...wrapper
  }
}

describe('CharacterCounter Component', () => {
  it('Should render the CharacterCounter component', async () => {
    const {getByTestId} = await setup();
    expect(getByTestId('character-counter')).toBeInTheDocument();
})
})

