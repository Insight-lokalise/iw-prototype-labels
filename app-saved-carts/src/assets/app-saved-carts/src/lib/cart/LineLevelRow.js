import React from 'react'
import PropTypes from 'prop-types'
import { t } from '@insight/toolkit-utils'

export default function LineLevelRow({ text, title }) {
  return text ? (
    <tr className="c-structured-list__item">
      <th className="c-structured-list__term" scope="row">{`${t(title)}:`}</th>
      <td className="c-structured-list__description">{t(text)}</td>
    </tr>
  ) : null
}

LineLevelRow.propTypes = {
  text: PropTypes.string,
  title: PropTypes.string.isRequired,
}

LineLevelRow.defaultProps = {
  text: undefined,
}
