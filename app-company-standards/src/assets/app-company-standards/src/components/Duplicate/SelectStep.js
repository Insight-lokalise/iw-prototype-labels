import React from 'react'
import PropTypes from 'prop-types'
import { Field } from '@insight/toolkit-react'
import { t } from '@insight/toolkit-utils'

export default function SelectStep({ currentWebGroup, toggleUseCurrentWebGroup, useCurrentWebGroup }) {
  return (
    <div className="o-grid">
      <h2 className="o-grid__item u-1/1">{t(`Duplicate to`)}</h2>
      <div className="o-grid__item u-1/1 u-margin-bot">
        <div className="o-grid">
          <Field
            className="o-grid__item o-grid__item--shrink u-margin-right"
            checked={useCurrentWebGroup}
            fieldComponent={'Radio'}
            handleChange={() => {
              toggleUseCurrentWebGroup(true)
            }}
            id={'useCurrentWebGroup'}
            label={`${t('current web group')} (${currentWebGroup})`}
            name={'useCurrentWebGroup'}
          />
          <Field
            className="o-grid__item o-grid__item--shrink"
            checked={!useCurrentWebGroup}
            fieldComponent={'Radio'}
            handleChange={() => {
              toggleUseCurrentWebGroup(false)
            }}
            id={'useDifferentWebGroup'}
            label={t('different web group')}
            name={'useCurrentWebGroup'}
          />
        </div>
      </div>
    </div>
  )
}

SelectStep.propTypes = {
  currentWebGroup: PropTypes.number.isRequired,
  toggleUseCurrentWebGroup: PropTypes.func.isRequired,
  useCurrentWebGroup: PropTypes.bool.isRequired,
}
