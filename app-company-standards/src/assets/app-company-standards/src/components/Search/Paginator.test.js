import React from 'react';
import { render } from '@testing-library/react'
import Paginator from './Paginator';
import {Provider} from "react-redux";
import { createStore, applyMiddleware } from 'redux';

jest.mock('@insight/toolkit-utils/lib/labels', () => ({
  t: jest.fn(string => string)
}))

const store = createStore(() => [], {}, applyMiddleware());

const setup = async () => {
  const wrapper = render(
    <Provider store={store}>
      <Paginator changePage={2} currentPage={1} maxPage={100} minPage={10}
      />
    </Provider>)
  return {
    ...wrapper
  }
}

describe('Paginator', () => {
  it('Should render the Paginator Component', async () => {
    const { container } = await setup();
    expect(container.getElementsByClassName('c-activity-log__paginator').length).toBe(1)
  })
})
