import React from 'react'
import { render } from 'test-utils'

import PasswordSettings from './PasswordSettings'

jest.mock('@insight/toolkit-utils/lib/labels', () => {
  return {
    t: jest.fn((string) => string),
  }
})

jest.mock(
  'app-api-user-service',
  () => {
    return {}
  },
  { virtual: true }
)

describe('PasswordSettings', () => {
  it('renders Password Settings section', async () => {
    const { getByText } = render(<PasswordSettings />)
    expect(getByText('Password settings')).toBeInTheDocument()
    expect(getByText('Change password')).toBeInTheDocument()
  })

  it('renders Ping change password url', async () => {
    const { container } = render(<PasswordSettings />)
    const changePasswordLink = container.querySelector('.c-change-password')
    expect(changePasswordLink.href).toEqual(
      'https://dev-id.insight.com/as/authorize?client_id=6d3d3ff0-ce9c-41ab-887d-5827e9e551b7&response_type=code&scope=openid&redirect_uri=https://dev-id.insight.com&locale=en-US'
    )
  })
})
