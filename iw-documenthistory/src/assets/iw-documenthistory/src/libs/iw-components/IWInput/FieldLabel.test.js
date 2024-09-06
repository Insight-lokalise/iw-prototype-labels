import React from 'react'
import { render } from '@testing-library/react'

import FieldLabel from './FieldLabel'
import { t} from '@insight/toolkit-utils/lib/labels'

jest.mock('@insight/toolkit-utils/lib/labels', ()=>{
  return {
    t: jest.fn(string => string)
  }
})

describe('FieldLabel', () => {
  it('renders correctly', () => {
    const {asFragment} = render(
        <FieldLabel
          label="Testing"
          name="testing"
          type="checkbox"
          required
          showHelpIcon
          tooltip="test tooltip"
          regexFormat="regex!"
        />
      )
    expect(asFragment()).toMatchSnapshot()
  })
})
