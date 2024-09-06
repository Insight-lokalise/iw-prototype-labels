import React from 'react';
import { render } from '@testing-library/react';
import Activity from "./Activity";
import {Provider} from "react-redux";
import { createStore, applyMiddleware } from 'redux';

jest.mock('@insight/toolkit-utils/lib/labels', () => ({
  t: jest.fn(string => string)
}))

const desc = [
  'ac', 'af'
]
const store = createStore(() => [], {}, applyMiddleware());

const setup = async () => {
  const wrapper = render(
    <Provider store={store}><Activity descriptions={desc} username='John doe' timestamp='08:30:00'/>
    </Provider>)
 return {
      ...wrapper
 }
}

describe('Activity Component', () => {
  it('Should render the Activity component', async () => {
    const {container} = await setup();
    expect(container.getElementsByClassName('c-activity').length).toBe(1);
  })
})
