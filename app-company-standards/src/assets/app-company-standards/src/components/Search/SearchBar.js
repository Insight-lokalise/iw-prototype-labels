import React, { useContext, useState } from 'react'
import PropTypes from 'prop-types'
import { Field, Icon, Button } from '@insight/toolkit-react'
import { t } from '@insight/toolkit-utils'
import { withRouter } from 'react-router-dom'

import ROUTES from '../Shared/constants'
import { SearchContext } from './SearchContext'

const searchBarId = 'cs-search-bar'

function SearchBar({ history }) {
  const [searchString, setSearchString] = useState('')
  const { search, wId } = useContext(SearchContext)
  const searchPath = { pathname: ROUTES.SEARCH, search: `?wId=${wId}`, from: 'SearchPage' }

  const onEnter = e => {
    if (e.key === 'Enter' && searchString.length > 2) {
      search(searchString)
      history.push(searchPath)
    }
  }

  const handleSearchClick = () => {
    if (searchString.length > 2) {
      search(searchString)
      history.push(searchPath, { from: 'SearchPage' })
    }
  }

  const clearSearch = () => {
    setSearchString('')
    search('')
  }

  return (
    <div className="o-grid o-grid--top o-grid--justify-between u-margin-bot-tiny">
      <label className="o-grid__item u-1/1 c-search-bar" htmlFor={searchBarId}>
        {t("Search Company Standards")}
      </label>
      <div className="o-grid__item c-search-input">
        <div className="o-grid o-grid--gutters-tiny o-grid--bottom u-margin-bot-tiny">
          <div className="o-grid__item c-cs-search-bar">
            <Field
              id={searchBarId}
              fieldComponent="Text"
              name="searchBar"
              onChange={e => {
                setSearchString(e.target.value);
              }}
              onKeyPress={onEnter}
              placeholder={t('Minimum of 3 characters required')}
              value={searchString}
              className='c-search-field'
            />
            {searchString.length > 0 ? (
            <div onClick={clearSearch}>
            <Icon icon="close" type='alert' className='search-bar__closeicon'/>
            </div>
            ) : null}
          </div>
          <div className="c-search__button o-grid__item--shrink">
            <Button
              isDisabled={searchString.length < 3}
              color="primary"
              onClick={handleSearchClick}
            >
               <Icon icon="search"/>
            </Button>
          </div>

        </div>
        <span className="u-font-size-small">
          {t('Search by category, product group, product set, product or tag (if enabled)')}
        </span>
      </div>
    </div>
  );
}

SearchBar.propTypes = {
  history: PropTypes.shape({
    push: PropTypes.func.isRequired
  }).isRequired
}

export default withRouter(SearchBar)
