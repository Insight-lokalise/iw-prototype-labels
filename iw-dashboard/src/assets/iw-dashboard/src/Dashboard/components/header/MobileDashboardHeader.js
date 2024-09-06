import React from 'react'
import PropTypes from 'prop-types'

import { IWSelect } from '../../../iw-components'

export default function MobileDashboardHeader({ changeDashlet, options, selection }) {
  return <IWSelect options={options} value={selection} onChange={changeDashlet} className="dashlet__select" />
}

MobileDashboardHeader.propTypes = {
  changeDashlet: PropTypes.func.isRequired,
  options: PropTypes.arrayOf(
    PropTypes.shape({
      label: PropTypes.string.isRequired,
      value: PropTypes.string.isRequired,
    })
  ).isRequired,
  selection: PropTypes.shape({
    label: PropTypes.string.isRequired,
    value: PropTypes.string.isRequired,
  }),
}

MobileDashboardHeader.defaultProps = {
  selection: undefined,
}
