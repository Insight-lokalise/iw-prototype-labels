import React, { useContext, useEffect, useState } from 'react'
import Button from '@insight/toolkit-react/lib/Button/Button'
import Field from '@insight/toolkit-react/lib/Form/Field/Field'

import {
  jumpToLinkedSite,
  switchLanguage,
  switchSite,
  REGIONS,
  COUNTRIES,
  LANGUAGES,
  t,
} from 'api'
import IAHeaderContext from '../../../context/IAHeaderContext'

export default function LocaleSelector() {
  const {
    headerInfo: {
      locale,
      isLoggedIn,
      userInformation: { availableSites, username },
    },
  } = useContext(IAHeaderContext)

  const [defaultLanguage, defaultCountry] = locale.toLowerCase().split('_')

  const [country, setCountry] = useState(defaultCountry)
  const [language, setLanguage] = useState(defaultLanguage)

  useEffect(() => {
    setCountry(defaultCountry)
    setLanguage(defaultLanguage)
  }, [locale])

  const languageOptions = COUNTRIES[country].languages.map((lang) => ({
    value: lang,
    text: LANGUAGES[lang],
  }))

  const countryOptions = REGIONS.map((region) => ({
    optgroup: {
      label: region.label,
      options: region.countries.map((cntry) => ({
        id: cntry,
        text: t(COUNTRIES[cntry].label),
        value: cntry,
      })),
    },
  }))

  function handleFormSubmit(e) {
    e.preventDefault()
    const { suffixes, name, siteId } = COUNTRIES[country]
    const suffix = suffixes[language]
    const origin = window.location.origin

    // Look for a linked site with the same URL as the site the user selected
    const linkedSite =
      availableSites &&
      availableSites
        .filter((site) => site.name === name || site.id === siteId)
        .shift()

    // If the user is only switching language, sticking with the same country.
    if (country === defaultCountry) {
      switchLanguage(country, language, isLoggedIn)

      // If the user selected a country at which they have an account, perform a
      // linked site jump, so that they are still logged in.
    } else if (linkedSite) {
      const nextLocale = `${language}_${country.toUpperCase()}`
      jumpToLinkedSite({
        siteName: linkedSite.name,
        locale: nextLocale,
        url: linkedSite.nav,
      })

      // Otherwise, off to the correct country site.
    } else {
      switchSite(country, language, origin)
    }
  }

  return (
    <form
      aria-label={t(
        'Form contains country select dropdown and language select dropdown'
      )}
      className="c-form c-form--small"
      onSubmit={handleFormSubmit}
    >
      <Field
        aria-label={t('Select a country')}
        className={'u-no-wrap js-gtm-location-menu__country-select'}
        fieldComponent={'Select'}
        data-testid="country-select"
        fullWidth
        handleChange={(e) => {
          const selectedCountry = e.target.value

          setCountry(selectedCountry)

          const { languages } = COUNTRIES[selectedCountry]

          if (!languages.includes(language)) {
            setLanguage(languages[0])
          }
        }}
        label={t('Choose country')}
        name="selectCountry"
        options={countryOptions}
        value={country}
      />
      <Field
        aria-label={t('Select a language')}
        className={'u-no-wrap  js-gtm-location-menu__language-select'}
        disabled={languageOptions.length <= 1}
        fieldComponent={'Select'}
        data-testid="language-select"
        fullWidth
        handleChange={(e) => {
          setLanguage(e.target.value)
        }}
        label={t('Choose language')}
        name="selectLanguage"
        options={languageOptions}
        value={language}
      />
      <Button
        aria-label={t('Reload page with new country and language settings')}
        color="primary"
        size="small"
        fullWidth
        type="submit"
      >
        {t('Go')}
      </Button>
    </form>
  )
}

LocaleSelector.propTypes = {}
