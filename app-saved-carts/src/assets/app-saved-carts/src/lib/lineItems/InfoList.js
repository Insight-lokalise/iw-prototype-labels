import React from 'react'
import PropTypes from 'prop-types'
import cn from 'classnames'
import { t } from '@insight/toolkit-utils'

export default function InfoList({ columns, list }) {
  const classes = cn('c-description__list', {
    'o-grid  o-grid--gutters-large': columns > 1
  })
  return (
    <div className={classes}>
      {list.map((entry, index) => Section({ ...entry, index, columns}))}
    </div>
  )
}

InfoList.propTypes = {
  columns: PropTypes.number,
  list: PropTypes.arrayOf(PropTypes.shape({
    header: PropTypes.string,
    text: PropTypes.oneOfType([ PropTypes.string, PropTypes.number, PropTypes.arrayOf(PropTypes.oneOfType([ PropTypes.string, PropTypes.number ])) ]),
  })).isRequired
}

InfoList.defaultProps = {
  columns: 1
}

function Section({ header, index, text, columns }) {
  const classes = cn( 'c-description__list-item', {
    'o-grid__item  u-1/1': columns > 1,
    'u-1/2@tablet  u-1/2@tablet-landscape  u-1/2@desktop': columns === 2,
    'u-1/2@tablet  u-1/3@tablet-landscape  u-1/3@desktop': columns === 3,
    'u-1/2@tablet  u-1/3@tablet-landscape  u-1/4@desktop': columns === 4,
  })
  return text ? (
    <div className={classes} key={`${header}${index}`}>
      <span className="c-description-list__term">{`${t(header)}`}</span>
      <span className="c-description-list__desc">
        {
          typeof text === 'string' ? (
            t(text)
          ) : (
            text.map(line => [t(line), <br key={text} />])
          )
        }
      </span>
    </div>
  ) : null
}

Section.propTypes = {
  columns: PropTypes.number.isRequired,
  header: PropTypes.string.isRequired,
  index: PropTypes.number.isRequired,
  text: PropTypes.oneOfType([ PropTypes.string, PropTypes.number, PropTypes.arrayOf(PropTypes.oneOfType([ PropTypes.string, PropTypes.number ])) ]),
}

Section.defaultProps = {
  text: undefined
}
