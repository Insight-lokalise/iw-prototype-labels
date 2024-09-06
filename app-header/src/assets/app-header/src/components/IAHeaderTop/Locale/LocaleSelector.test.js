import React from 'react'
import { render } from 'test-utils'
import { fireEvent } from '@testing-library/react'
import { COUNTRIES } from '../../../api/common/locales'
import LocaleSelector from './LocaleSelector'

const naCountries = ['ca', 'us'];
const emeaCountries = ['at', 'be', 'dk', 'fr', 'de', 'ie', 'it', 'nl', 'no', 'es', 'se', 'ch', 'gb']

describe('Locale Selector in Header', () => {
  let location;
  const mockLocation = new URL('https://pre-qa.insight.com');

  beforeEach(() => {
    location = window.location;
    delete window.location;
    window.location = mockLocation;
  });

  afterEach(() => {
    window.location = location;
  });

  test('Should render Locale Selector', ()=>{
    const { getByRole } = render(<LocaleSelector />);

    expect(getByRole('form')).toHaveClass('c-form c-form--small')
  })

  test('Should read window location origin', () => {
    expect(window.location.origin).toBe('https://pre-qa.insight.com');
  })


  naCountries.forEach((country) => {
    test('should stay on same env if na', () => {
      const { getByTestId, getByText } = render(<LocaleSelector />);
      const { suffixes } = COUNTRIES[country]
      const suffix = suffixes['en']

      const countrySelect = getByTestId('country-select');
      const languageSelect = getByTestId('language-select')
      const submitBtn = getByText('Go')

      fireEvent.change(countrySelect, { target: { value: country } })
      fireEvent.change(languageSelect, { target: { value: 'en' }})
      fireEvent.submit(submitBtn)

      if(country !== 'us') {
        expect(window.location).toBe(`//${country}-pre-qa.insight.com/${suffix}`)
      }
    })
  })

  emeaCountries.forEach((country) => {
    test('should switch to qae if selected an emea country', () => {
      const { getByTestId, getByText } = render(<LocaleSelector />);
      const { suffixes } = COUNTRIES[country]
      const suffix = suffixes['en']

      const countrySelect = getByTestId('country-select');
      const languageSelect = getByTestId('language-select')
      const submitBtn = getByText('Go')

      fireEvent.change(countrySelect, { target: { value: country } })
      fireEvent.change(languageSelect, { target: { value: 'en' }})
      fireEvent.click(submitBtn)

      if(country === 'gb') {
        expect(window.location).toBe(`//uk-qae.insight.com/${suffix}`)
      } else {
        expect(window.location).toBe(`//${country}-qae.insight.com/${suffix}`)
      }
    })
  })
})
