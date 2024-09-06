import React, { useState } from 'react'
import PropTypes from 'prop-types'
import cn from 'classnames'
import { Button, Field, Icon } from '@insight/toolkit-react'
import { t } from '@insight/toolkit-utils'

import { fetchWebGroup, fetchCategories } from '../../api'

export default function FindWebGroup({ handleFind, message, messageType }) {
  const [webGroupNumber, setWebGroupNumber] = useState()
  const [isLoading, setIsLoading] = useState(false)
  const hideMessage = !message

  async function handleSearch() {
    setIsLoading(true)
    try {
      const foundWebGroup = await fetchWebGroup({ wId: webGroupNumber })
      const foundWebgroupCategories = await fetchCategories({ wId: webGroupNumber });
      handleFind(foundWebGroup, foundWebgroupCategories)
      setWebGroupNumber('')
    } catch (err) {
      handleFind({ badId: webGroupNumber })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="o-grid u-margin-bot">
      <div className="o-grid__item u-1/1">
        <div className="o-grid">
          <div className="o-grid__item">
            <Field
              className={'u-margin-bot-none'}
              fieldComponent={'Text'}
              handleChange={e => {
                setWebGroupNumber(e.target.value)
              }}
              label={t('Web group number')}
              name={'Web group number'}
              required
              validate={() => {}}
              validateOnBlur
              value={webGroupNumber}
            />
          </div>
          <div className="o-grid__item o-grid__item--bottom">
            <Button color="link" onClick={handleSearch} isLoading={isLoading}>
              {t('Find')}
            </Button>
          </div>
        </div>
      </div>
      <div className={cn('o-grid__item u-1/1', { 'u-invisible': hideMessage })}>
        <small aria-live="polite" className="c-form__error">
         <Icon icon="alert" type="error" className="c-form__error-icon" />
          {message}
        </small>
      </div>
    </div>
  )
}

FindWebGroup.propTypes = {
  handleFind: PropTypes.func.isRequired,
  message: PropTypes.oneOfType([PropTypes.string, PropTypes.element]).isRequired,
  messageType: PropTypes.string,
}

FindWebGroup.defaultProps = {
  messageType: 'ERROR',
}
