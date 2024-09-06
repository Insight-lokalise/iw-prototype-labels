import React from 'react';
import { render } from '@testing-library/react';
import B2BReviewHeader from './B2BReviewHeader';

jest.mock('@insight/toolkit-utils/lib/labels', () => ({
  t: jest.fn(string => string)
}))

const setup = async () => {
  const wrapper = render(
    <B2BReviewHeader />
  )
  return {
    ...wrapper
  }
}

describe('B2BReviewHeader Component', () => {
  it('Should render the B2BReviewHeader component', async () => {
    const {container} = await setup();
    expect(container.getElementsByClassName('shopping-cart__messages').length).toBe(1);
  })
})
