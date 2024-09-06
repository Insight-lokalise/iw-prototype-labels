import React from 'react'
import {render, fireEvent} from '@testing-library/react'
import TaxExemption from './TaxExemption'
import { t } from '@insight/toolkit-utils/lib/labels'
jest.mock('@insight/toolkit-utils/lib/labels', ()=>{return {
  t: jest.fn(string => string)
}})

describe('<TaxExemption>', () => {
  it('should render TaxExemption', () => {
    const setOverrideTax = jest.fn()
    const {container, getByText} = render(
      <TaxExemption
        hasTaxOverride={true}
        setOverrideTax={setOverrideTax}
        overrideTax={true}
        isReadOnly={false}
      />
    )
    expect(container.querySelector("#applyTaxCertificate")).toBeInTheDocument();
    expect(getByText("Tax Exemption")).toBeInTheDocument();
    expect(container.querySelector("#applyTaxCertificate")).not.toBeDisabled();
    expect(getByText("Check here to apply any applicable tax exemption certificate on file with Insight's Tax Department for my account")).toBeInTheDocument();

  })

  it('should render read only TaxExemption', () => {
    const setOverrideTax = jest.fn()
    const {container, getByText} = render(
      <TaxExemption
        hasTaxOverride={true}
        setOverrideTax={setOverrideTax}
        overrideTax={true}
        isReadOnly={true}
      />
    )
    expect(container.querySelector(".form__label--readonly")).toBeInTheDocument();
    expect(getByText("Tax Exemption")).toBeInTheDocument();
    expect(container.querySelector("#applyTaxCertificate")).toBeDisabled();
    expect(getByText("Check here to apply any applicable tax exemption certificate on file with Insight's Tax Department for my account")).toBeInTheDocument();

  })

  it('should change tax selection on click', () => {
    const setOverrideTax = jest.fn()
    const {container} = render(
      <TaxExemption
        hasTaxOverride={true}
        setOverrideTax={setOverrideTax}
        overrideTax={true}
        isReadOnly={false}
      />
    )
    const input = container.querySelector("#applyTaxCertificate")
    fireEvent.click(input)
    expect(setOverrideTax).toBeCalledTimes(1)

  })

  it('should not change tax selection on click as it is read only', () => {
    const setOverrideTax = jest.fn()
    const {container} = render(
      <TaxExemption
        hasTaxOverride={true}
        setOverrideTax={setOverrideTax}
        overrideTax={true}
        isReadOnly={true}
      />
    )
    const input = container.querySelector("#applyTaxCertificate")
    fireEvent.click(input)
    expect(setOverrideTax).toBeCalledTimes(0)

  })
})
