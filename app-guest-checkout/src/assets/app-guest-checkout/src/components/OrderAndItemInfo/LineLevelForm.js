import React, { useEffect, useState } from 'react'
import PropTypes from 'prop-types'
import { displayNameMap } from '@constants'
import { t } from '@insight/toolkit-utils/lib/labels'
import { Label } from "@insight/toolkit-react/lib/Form/Components/Decorators"
import { Field } from "@insight/toolkit-react"
import { rewrite } from '../../lib/Helpers'
import { getCountries } from '../../api'

export default function LineLevelForm({ countryOfUsage, hasCountryOfUsage, id, sellRequirement, sellRequirementId }){
  const lowerCaseEmailFieldName = 'contact email'
  const defaultCountry= [{value: '' , text: 'Select country', 'data-testid':'select-country'}]
  const [countriesList, setCountriesList] = useState([])
  const [selectedCountry, setSelectedCountry] = useState(countryOfUsage)

  useEffect(()=> {
    getCountries().then((data)=>{
      const mappedCountries = data.map((country) => ({
        value: country.countryCode,
        text: country.country
      }))
      setCountriesList(defaultCountry.concat(mappedCountries))
    })
  },[])

  const renderSellRequirements = (item, i) => {
    const { name, required, editable, value } = item
    let dispayValue = ''
    if( name === "CONTACT_NAME"){
      dispayValue = value?.split(";")[0].trim() + value?.split(";")[1] || ''
    }

    const displayName = displayNameMap[name] ? displayNameMap[name] : rewrite(name)
    const sharedProps = {
      label: displayName,
      name: `${name}__${id}`,
      required,
      readOnly: !editable,
      value: !!dispayValue? dispayValue: value
    }

    const usedProps =
      sellRequirementId === 'A3' && displayName === 'Authorization'
        ? Object.assign({}, sharedProps, { label: t('PA #'),  showHelpIcon: true })
        : sharedProps

    return (
      <div key={i} className="o-grid__item u-1/1 u-1/3@desktop u-margin-bot">
        <Field
          fieldComponent='Text'
          type={displayName.toLowerCase() === lowerCaseEmailFieldName ? 'email': 'text'}
          {...usedProps}
          aria-required="true"
          minLength={1}
          maxLength={40}
          showErrorIcon={required}
        />
      </div>
    )
  }
  return(
       <div className='o-grid o-grid--gutters-small'>
          {hasCountryOfUsage &&
            <div className='o-grid__item u-1/1 u-1/3@desktop u-margin-bot'>
              <Label id={'countryOfUsage'} required htmlFor={'countryOfUsage'}>
                {t('Country of usage')}:
              </Label>
              <Field
                id={'countryUsage'}
                fieldComponent={'Select'}
                name={`countryUsage__${id}`}
                className={'c-resource-item__usageCountry'}
                options={countriesList}
                handleChange={e => {
                  setSelectedCountry(e.target.value)
                }}
                value={selectedCountry}
                required
              />
            </div>
          }
          {sellRequirement.map((item, i) => renderSellRequirements(item, i))}
        </div>
  )
}

LineLevelForm.propTypes = {
  countryOfUsage: PropTypes.string,
  hasCountryOfUsage: PropTypes.bool.isRequired,
  id: PropTypes.number,
  sellRequirement: PropTypes.arrayOf(PropTypes.object),
  sellRequirementId: PropTypes.string
}

LineLevelForm.defaultProps = {
  countryOfUsage: null,
  id: 0,
  sellRequirement: [],
  sellRequirementId: ''
}
