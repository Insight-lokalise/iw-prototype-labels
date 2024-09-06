import React from 'react'
import PropTypes from 'prop-types'
import { t } from '@insight/toolkit-utils'
import cn from 'classnames'

import InfoList from './InfoList'

export default function LineItem({ columns, list, title }) {
  const classes = cn({
    "o-box  c-order-template__block": columns > 1,
    "o-grid__item  u-1/1  u-1/2@tablet  u-1/3@desktop  c-order-template__block-item": columns === 1
  })
  return (
    <div className={classes}>
      <h3 className="c-order-template__heading">{t(title)}</h3>
      <InfoList columns={columns} list={list} />
    </div>
  )
}

LineItem.propTypes = {
  columns: PropTypes.number,
  list: PropTypes.arrayOf(PropTypes.shape({
    header: PropTypes.string,
    text: PropTypes.oneOfType([ PropTypes.string, PropTypes.number, PropTypes.arrayOf(PropTypes.oneOfType([ PropTypes.string, PropTypes.number ])) ]),
  })).isRequired,
  title: PropTypes.string.isRequired
}

LineItem.defaultProps = {
  columns: 1,
}
