import React from 'react'
import PropTypes from 'prop-types'
import cn from 'classnames'
import { t } from '@insight/toolkit-utils'

import LineLevelTable from './LineLevelTable'

export default function DEPItem({ enrollChildId, showDEPInfo, bundleId }) {

  const DEPInfo = showDEPInfo(enrollChildId, bundleId)
  let info = []

  if(DEPInfo) {    
    info.push({
      name: t('Insight Part #'),
      value: DEPInfo.materialId
    })
    info.push({
      name: t('DEP Organization ID #'),
      value: DEPInfo.enrolledId
    })
  }

  return (
    <div>
      <table className="c-structured-list  c-structured-list--stacked  c-line-level-info__table">      
        <LineLevelTable info={info} title='Device Enrollment Program' />
      </table>      
    </div>
  )
}

DEPItem.propTypes = {    
  enrollChildId: PropTypes.number.isRequired,
  showDEPInfo: PropTypes.func.isRequired,
  bundleId: PropTypes.number,
}

DEPItem.defaultProps = {
  bundleId: 0,
}
