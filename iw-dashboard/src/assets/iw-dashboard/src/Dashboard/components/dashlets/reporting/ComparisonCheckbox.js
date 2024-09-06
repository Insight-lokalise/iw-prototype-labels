import React from 'react'
import PropTypes from 'prop-types'
import { t } from '@insight/toolkit-utils/lib/labels'

export default function ComparisonCheckbox({ isCompared, toggleIsCompared, disableComparison }) {
  return (
    !disableComparison && (
      <label className="dashlet__label">
        <input type="checkbox" checked={isCompared} onChange={toggleIsCompared} />
        {t('Compare with previous period')}
      </label>
    )
  )
}

ComparisonCheckbox.propTypes = {
  isCompared: PropTypes.bool.isRequired,
  toggleIsCompared: PropTypes.func.isRequired,
  disableComparison: PropTypes.bool,
}
