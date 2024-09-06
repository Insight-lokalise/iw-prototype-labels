import React from 'react'
import PropTypes from 'prop-types'
import cn from 'classnames'
import { t } from '@insight/toolkit-utils'

import LineLevelTable from './LineLevelTable'

export default function LineLevel({ className, lineLevelInfo }) {
  return (
    <div className={cn("c-line-level-info", className)}>
      <table className="c-structured-list  c-structured-list--stacked  c-line-level-info__table">
        <caption className="c-structured-list__caption  c-line-level-info__caption">{t('Line level information')}</caption>
        { lineLevelInfo.sellRequirements && (
          <LineLevelTable info={lineLevelInfo.sellRequirements} title='License information' />
        )}
        { lineLevelInfo.smarttrackers && (
          <LineLevelTable info={lineLevelInfo.smarttrackers} title='SmartTrackers' />
        )}
        { lineLevelInfo.contractFields && (
          <LineLevelTable info={lineLevelInfo.contractFields} title='Contract specific information' />
        )}
      </table>
    </div>
  )
}

LineLevel.propTypes = {
  className: PropTypes.string,
  lineLevelInfo: PropTypes.objectOf(PropTypes.array)
}

LineLevel.defaultProps = {
  className: '',
  lineLevelInfo: {}
}
