// React Modules
import React, { useState } from 'react'
import cn from 'classnames'
import { Button, Field } from '@insight/toolkit-react'
import { t } from '@insight/toolkit-utils'
import { FilterRange } from './components/FilterRange'
import { CategoryFilter } from './components/CategoryFilter'
import { connectToLocale } from '@insight/toolkit-react'

const SEARCHABLE_FACET_KEYS_PREFIX = ['header_manufacturer_a00630', 'brand', 'topics'];

export const SearchFilter = ({
  selectedFilters,
  setFilter,
  setRange,
  setCategory,
  showFilters,
  toggleFilters,
  instockOnly,
  facets,
  setStockFilter,
  outOfStockOnly,
  context
}) => {
  const [expanded, setShowMore] = useState({})
  const [typeaheadOptions, setTypeaheadOptions] = useState({});
  const {isHybridXEnabled} = context
  const expand = (group) =>
    setShowMore({ ...expanded, [group]: !expanded[group] })

  const applyFilters = (e) => toggleFilters(e)

  const onTypeaheadSearch = (name, str, options) => {
    const updatedOptions = options.filter((option) =>
      option.val.toUpperCase().includes(str.toUpperCase())
    )
    setTypeaheadOptions({
      [name]: { searchTerm: str, options: [...updatedOptions] }
    })
  }

  const setOptions = (showMore, options) => {
    return showMore
      ? options.slice(0, 5)
      : options.length > 50
        ? options.slice(0, 50)
        : options
  }

  const renderFilterGroup = () => {
    if (!facets || !facets.length) return null
    return facets.map((group, index) => {
      if (group.buckets.length === 0) return null
      // do not render any facet group that have all facets with count 0
      if (group.buckets.filter(({ count }) => count > 0).length === 0)
        return null

      const isSearchableFacet = SEARCHABLE_FACET_KEYS_PREFIX.some((key)=>group?.key?.toLowerCase()?.includes?.(key));
      const typeaheadOption = typeaheadOptions?.[`${group.label}`];
      // filter empty facets / facets with zero count
      const filteredOptions = group.buckets.filter((o) => o?.count > 0)
      // whether to show manufacturer searched data
      const showTypeaheadOptions =
        !!typeaheadOption?.searchTerm && isSearchableFacet
      const tempOptions = showTypeaheadOptions
        ? typeaheadOption?.options
        : filteredOptions
      const showMore = tempOptions.length > 5 && !expanded[group.key]
      const showLess = tempOptions.length > 5 && expanded[group.key]
      const options = setOptions(showMore, tempOptions)
      const groupType = showTypeaheadOptions &&
          typeaheadOption?.options?.length === 0
          ? 'noOptionsAvailable'
          : group.type;
      // Change Price label to List price for E4 experience
      const groupLabel = group.label === 'Price' && isHybridXEnabled ? 'List price' : group.label
      return (
        <section key={index} className="c-search-filter__group o-grid">
          <div className="c-search-filter__group__label o-grid__item u-1/1">
            {t(groupLabel)}
          </div>
          {isSearchableFacet && (
            <div className="o-grid__item u-1/1">
              <label className="u-hide-visually" htmlFor={group.label}>{`Search by ${group.label}`}</label>
              <input
                name={group.key}
                id={group.label}
                className="c-search-filter__group__input"
                placeholder={`Search by ${group.label}`}
                value={typeaheadOption?.searchTerm || ""}
                onChange={(e) =>
                  onTypeaheadSearch(group.label, e.target.value, filteredOptions)
                }
              />
            </div>
          )}
          {renderGroupType(group.key, options, groupType, selectedFilters)}
          {showMore ? (
            <div className="o-grid__item u-1/1">
              <Button
                className="c-search-filter__group__show-more u-text-bold"
                icon="arrow-down"
                color="inline-link"
                onClick={() => expand(group.key)}
              >
                {t('Show more')}
              </Button>
            </div>
          ) : null}
          {showLess ? (
            <div className="o-grid__item u-1/1">
              <Button
                className="c-search-filter__group__show-less u-text-bold"
                icon="arrow-up"
                color="inline-link"
                onClick={() => expand(group.key)}
              >
                {t('Show less')}
              </Button>
            </div>
          ) : null}
        </section>
      )
    })
  }
  const renderGroupType = (groupName, options, groupType) => {
    switch (groupType) {
      case 'range':
      case 'price':
        return (
          <FilterRange
            groupType={groupType}
            groupName={groupName}
            setRange={setRange}
            options={options}
            selectedFilters={selectedFilters}
          />
        )
      case 'noOptionsAvailable':
        return <p className="c-search-filter__group__none">No results</p>
      default:
        return (
          <ul className="c-search-filter__group__container o-grid__item u-1/1 o-grid">
            {renderOptions(groupName, options, groupType)}
          </ul>
        )
    }
  }
  const renderOptions = (groupKey, options, groupType) => {
    if (!options || !options.length) return null
    switch (groupType) {
      case 'category':
        return (
          <CategoryFilter
            groupKey={groupKey}
            setCategory={setCategory}
            options={options}
          />
        )
      default:
        return options.map((option, index) => {
          const key = `${groupKey}:${option.val}`
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
                onChange={() => {
                  setFilter({ group: groupKey, ...option })
                  setTypeaheadOptions({})
                }}
              />
            </li>
          )
        })
    }
  }
  return (
    <section
      className={cn('c-search-filter', {
        'c-search-filter-show': showFilters,
      })}
    >
      <header className="o-grid">
        <div className="c-search-filter__close">
          <Button
            color="none"
            size="small"
            icon="close"
            onClick={toggleFilters}
            aria-label={t('Close')}
          />
        </div>
        <div className="o-grid__item u-1/1">
          {/* TODO: review apply filters implementation logic for mobile. Current action dismisses the filters panel and selecting an option acts the same as the desktop view */}
          <Button
            color="primary"
            className="c-search-filter__apply-filters c-button--block"
            onClick={applyFilters}
          >
            {t('Apply filters')}
          </Button>
        </div>
        {!outOfStockOnly && (
          <div className="c-search-filter__show-in-stock o-grid__item u-1/1">
            <Field
              name="in-stock-only"
              fieldComponent="Checkbox"
              checkboxLabel={t('Show in stock only')}
              checked={instockOnly}
              onChange={setStockFilter}
            />
          </div>
        )}
      </header>
      {renderFilterGroup()}
    </section>
  )
}

export default connectToLocale(SearchFilter)