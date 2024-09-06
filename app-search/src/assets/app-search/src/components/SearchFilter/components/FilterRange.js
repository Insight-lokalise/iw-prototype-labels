// React Modules
import React, { useState, memo, useContext } from 'react'
import { Button, Field, currencySymbol } from '@insight/toolkit-react'
import { t } from '@insight/toolkit-utils'
import { SearchContext } from '../../../context/SearchContext'

const WrappedFilterRange = ({ groupType, groupName, setRange, options, selectedFilters }) => {
  const [min, setMin] = useState(null)
  const [max, setMax] = useState(null)
  const { currency } = useContext(SearchContext);
 
  const getQueryOption = ({ min, max }) => {
    const symbol = currencySymbol(currency);
    if (min && max) {
      // Set max to min if max is less than min
      const calcMax = min > max ? min : max
      return {
        group: groupName,
        label: `${min} - ${calcMax}`,
        val: `${symbol}${min} to ${symbol}${calcMax}!!${min}_incl_${calcMax}`,
      }
    }

    if (min) {
      return {
        group: groupName,
        label: `${min} and more`,
        val: `> ${symbol}${min}!!over_${min}`,
      }
    }

    if (max) {
      return {
        group: groupName,
        label: `${max} and less`,
        val: `< ${symbol}${max}!!under_${max}`,
      }
    }

    // None selected
    return null
  }
  const hasOptions = options && options.length > 0
  const submit = () => {
    const query = getQueryOption({ min: Number(min), max: Number(max) })

    if (!query) return null

    setRange(query, true)
    return null
  }

  const onOptionChange = (option) => {
    let clearGroup = false
    if (min != null || max != null) {
      // need to clear range input boxes
      clearGroup = true
      setMin(null)
      setMax(null)
    }
    setRange(option, clearGroup)
  }

  return (
    <div className="o-grid__item u-1/1">
      { ["price","range"].includes(groupType) &&
        <form className="c-filter-range c-form o-grid">
          <div className="o-grid__item">
            <Field
              id="min"
              fieldComponent="Text"
              aria-label={t('Minimum')}
              name="min"
              placeholder="Min"
              min={0}
              maxLength={10}
              value={min === null ? "" : min}
              onChange={(e) => setMin(e.target.value.replace(/\D/g, ''))}
            />
          </div>
          <span className='o-grid__item o-grid__item--shrink u-text-bold'>{t('to')}</span>
          <div className="o-grid__item">
            <Field
              id="max"
              fieldComponent="Text"
              aria-label={t('Maximum')}
              name="max"
              placeholder="Max"
              min={0}
              maxLength={10}
              value={max === null ? "" : max}
              onChange={(e) => setMax(e.target.value.replace(/\D/g, ''))}
            />
          </div>
          <div className="o-grid__item">
            <Button color="primary" onClick={submit} size="small">
              {t('Go')}
            </Button>
          </div>
        </form>
      }
      {hasOptions &&
        <ul className="c-search-filter__group__container o-grid__item u-1/1 o-grid">
          {options.map((option, index) => {
            const key = `${groupName}:${option.val}`
            return (
              <li key={index} className="o-grid__item u-1/1">
                <Field
                  name={key}
                  fieldComponent="Checkbox"
                  checkboxLabel={
                    option.count
                      ? `${option.label || option.val} (${option.count})`
                      : `${option.label || option.val}`
                  }
                  checked={selectedFilters?.has(key) ? true : false}
                  onChange={() => onOptionChange({ group: groupName, ...option })}
                />
              </li>
            )
          })
          }
        </ul>
      }
    </div>

  )
}

export const FilterRange = memo(WrappedFilterRange)
