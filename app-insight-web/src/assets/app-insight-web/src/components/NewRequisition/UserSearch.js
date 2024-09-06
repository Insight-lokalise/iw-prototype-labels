import React from 'react'
import cn from 'classnames'
import Button from '@insight/toolkit-react/lib/Button/Button'
import PropTypes from 'prop-types'
import { getRecIdData } from 'api'
import { t } from '@insight/toolkit-utils'

export default function UserSearch({ client, searchTerm, updateSearchTerm, updateData, updateError}) { 
  const getData = () => {
    getRecIdData(client, searchTerm).then(data => {
      updateData(data)
    }).catch(error => {
      updateError(error)
    })
  }
  const handleChange = e => updateSearchTerm((e.target.value)?.toLowerCase())
  const handleKeyPress = e => {
    if (e.which === 13 && searchTerm.length > 2) {
      getData()
    }
  }
  return (
    <div className="c-form__element u-margin-bot-small">
      <p className="c-form__label">Search users</p>
      <div className={"c-form__control o-grid"}>
        <div className="o-grid__item u-1/2">
          <div className="o-grid o-grid--justify-right">
            <input 
              value={searchTerm} 
              onChange={handleChange} 
              onKeyDown={handleKeyPress} 
              maxLength={50} 
              className="c-input  c-input--force-height" 
              id="search" 
              type="search" 
              placeholder={t('Minimum of 3 characters required')}
            />
          </div>
        </div>
        <div className="o-grid__item u-1/6">
          <Button fullWidth className="u-margin-left" isDisabled={searchTerm.length < 3}  onClick={getData} color="primary">Search</Button>
        </div>
      </div>
    </div>
  )
}

UserSearch.propTypes = {
  client: PropTypes.string.isRequired,
  searchTerm: PropTypes.string,
  updateSearchTerm: PropTypes.func.isRequired,
  updateData: PropTypes.func.isRequired,
  updateError: PropTypes.func.isRequired,
}

UserSearch.defaultProps = {
  searchTerm: null,
}



