import React from 'react';
import { render } from '@testing-library/react';
import Header from './Header';

jest.mock('@insight/toolkit-utils/lib/labels', () => ({
  t: jest.fn(string => string)
}))

const setup = async () => {
  const wrapper = render(
    <Header />
  )
  return {
    ...wrapper
  }
}

describe('Header Component', () => {
  it('Should render Header Component', async () => {
    const {container} = await setup();
    expect(container.getElementsByClassName('c-save-for-later__panel').length).toBe(1);
  })
})
