import React from 'react'
import PropTypes from 'prop-types'
import { t } from '@insight/toolkit-utils'

import LineLevelRow from './LineLevelRow'

export default function LineLevelTable({ info, title }) {
  return (
    <tbody className="c-structured-list__items  c-line-level-info__tbody">
      <tr>
        <th colSpan="2" scope="colgroup" className="c-line-level-info__heading">{t(title)}</th>
      </tr>
      { info.map(entry => (
        <LineLevelRow key={entry.name} text={entry.value} title={entry.name} />
      ))}
    </tbody>
  )
}

LineLevelTable.propTypes = {
  info: PropTypes.arrayOf(PropTypes.shape({
    name: PropTypes.string,
    value: PropTypes.string
  })).isRequired,
  title: PropTypes.string.isRequired
}
