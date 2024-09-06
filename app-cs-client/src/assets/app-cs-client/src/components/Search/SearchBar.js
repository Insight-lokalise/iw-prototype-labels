import React, { useContext, useState } from 'react'
import PropTypes from 'prop-types'
import { Field, Button, Icon } from '@insight/toolkit-react'
import { Link, withRouter } from 'react-router-dom'
import { t } from '@insight/toolkit-utils'

import { SearchContext } from './SearchContext'

const searchBarId = 'cs-search-bar'

function SearchBar({ history }) {
  const [searchString, setSearchString] = useState('')
  const { search } = useContext(SearchContext)
  const searchPath = '/companyStandards/search'

  const onEnter = e => {
    if (e.key === 'Enter' && searchString.length > 2) {
      search(searchString)
      history.push(searchPath)
    }
  }

  const handleSearchClick = () => {
    if (searchString.length > 2) {
      search(searchString)
      history.push(searchPath)
    }
  }

  const clearSearch = () => {
    setSearchString('')
    search('')
  }

  return (
    <div className="o-grid">
      <label className="o-grid__item u-1/1 c-search-bar" htmlFor={searchBarId}>
        {t('Search Company Standards')}
      </label>
      <div className="o-grid__item c-search-input">
        <div className="o-grid o-grid--gutters-tiny o-grid--bottom">
          <div className="o-grid__item o-grid c-cs-search-bar">
            <Field
              id={searchBarId}
              fieldComponent="Text"
              name="searchBar"
              onChange={e => { setSearchString(e.target.value) }}
              onKeyPress={onEnter}
              value={searchString}
              placeholder={t('Minimum of 3 characters required')}
              className="c-cs-client__search-bar"
            />
            { searchString.length > 0 ? (
            <div onClick={clearSearch}>
            <Icon icon="close" type='alert' className='search-bar__closeicon'/>
            </div>
            ) : null}
          </div>
          <div className="c-search__button">
            <Button isDisabled={searchString.length < 3} onClick={handleSearchClick} color="primary" type="submit" className='c-search-bar__button'>
            <Icon icon="search"/>
            </Button>
          </div>
        </div>
        <span className="c-cs-client__search-tip">{t("Search by category, product group, product set, product or tag (if enabled)")}</span>
      </div>
    </div>
  )
}

SearchBar.propTypes = {
  history: PropTypes.shape({
    push: PropTypes.func.isRequired
  }).isRequired
}

export default withRouter(SearchBar)
