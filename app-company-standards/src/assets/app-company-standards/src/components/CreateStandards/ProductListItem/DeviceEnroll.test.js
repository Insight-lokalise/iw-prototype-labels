import React from 'react';
import { render } from '@testing-library/react'
import DeviceEnroll from './DeviceEnroll';

jest.mock('@insight/toolkit-utils/lib/labels', () => ({
  t: jest.fn(string => string)
}))


const setup = async () => {
const defaultProps = {
  product: {enrollment: true},
  updateProduct: jest.fn(),
  className: '',
  hasEnrollment: true,
  isUSSalesOrg: true
}
const wrapper = render(
  <DeviceEnroll  {...defaultProps} />
)
  return {
    ...wrapper
  }
}

describe('Force Device Enroll section', () => {
  it('Should render the Force Device Enroll section', async () => {
    const { getByText } = await setup();
    expect(getByText('Force Device Enroll')).toBeInTheDocument();
  })
})

