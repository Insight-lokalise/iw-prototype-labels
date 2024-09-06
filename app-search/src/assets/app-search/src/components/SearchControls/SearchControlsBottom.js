// React Modules
import React, { useContext } from 'react'
import { Button } from '@insight/toolkit-react'
import { t } from '@insight/toolkit-utils'
import { SearchContext } from '../../context/SearchContext'
import { CONTENTMAP } from '../../constants'
import { noOp } from '../../shared/utils'

export const SearchControlsBottom = ({
  clearFilters,
  setFilter,
  setRange,
  setStockFilter = noOp,
}) => {
  const { tabType, contentData, originalFilters: origFilters } = useContext(SearchContext);
  const originalFilters = tabType === CONTENTMAP.solutionsAndServices.id ? contentData?.[tabType]?.originalFilters : origFilters;

  const handleFilter = ({ key, label, type, val }) => {
    switch (type) {
      case 'rangeFacet':
        setRange({ group: key, ...{ key, label, type, val } })
        break
      case 'selectedFacet':
        setFilter({ group: key, ...{ key, label, type, val } })
        break
      case 'instockOnly':
        setStockFilter()
        break
    }
  }

  const renderFilters = () => {
    if (!originalFilters || !originalFilters.size) {
      return null
    }

    return Array.from(originalFilters).map(([key, filter]) => (
      <div key={key} className="c-search-controls__bottom__filter u-text-bold">
        <div>{filter.label || filter.val}</div>
        <Button
          className="c-search-controls__bottom__filter__close"
          color="none"
          onClick={() => handleFilter(filter)}
          aria-label={t('Clear')}
          icon="close"
        />
      </div>
    ))
  }
  if (!originalFilters || !originalFilters.size) {
    return null
  }
  return (
    <>
      <section className="c-search-controls__bottom">
        <div className="c-search-controls__bottom__filters">
          <div className="u-text-bold c-search-controls__bottom__filter-title">
            {t('Filters:')}
          </div>
          {renderFilters()}
          {originalFilters && originalFilters.size > 1 ? (
            <Button
              className="c-search-controls__bottom__clear-all"
              color="inline-link"
              onClick={() => clearFilters()}
            >
              {t('Clear all')}
            </Button>
          ) : null}
        </div>
      </section>
    </>
  )
}
