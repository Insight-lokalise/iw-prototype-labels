import React from 'react'
import {render} from '@testing-library/react'

import StaticFormField from "./StaticFormField";

describe('Static Form Field', () => {

  it('renders static form fields label, value', async () => {
    const { getByTestId, getByText } = render(
      <StaticFormField
      data-testid='static-field'
      label='label'
      value='value'/>
      )
    expect(getByTestId("static-field")).toBeInTheDocument()
    expect(getByText("label")).toBeInTheDocument()
    expect(getByText("value")).toBeInTheDocument()
  })

  it('renders static form fields label, chidlren', async () => {
    const { getByTestId, getByText } = render(
      <StaticFormField
        data-testid='static-field'
        label='label'>
        <div data-testid='children'></div>
      </StaticFormField>
    )
    expect(getByTestId("static-field")).toBeInTheDocument()
    expect(getByTestId("children")).toBeInTheDocument()
    expect(getByText("label")).toBeInTheDocument()
    expect(getByTestId("static-field")).not.toHaveTextContent("value")
  })
})
