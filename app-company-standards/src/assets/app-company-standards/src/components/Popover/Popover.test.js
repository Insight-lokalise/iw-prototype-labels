import React from 'react';
import { render } from '@testing-library/react'
import Popover from './Popover';
import {Provider} from "react-redux";
import { createStore, applyMiddleware } from 'redux';

jest.mock('@insight/toolkit-utils/lib/labels', () => ({
  t: jest.fn(string => string)
}))

const store = createStore(() => [], {}, applyMiddleware());

const setup = async () => {
  const wrapper = render(
    <Provider store={store}>
      <Popover
      />
    </Provider>)
  return {
    ...wrapper
  }
}

describe('Popover', () => {
  it('Should render the Popover Component', async () => {
    const { container } = await setup();
    expect(container.getElementsByClassName('c-popover').length).toBe(1)
  })
})
