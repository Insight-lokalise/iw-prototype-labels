import React from 'react'
import PropTypes from 'prop-types'
import { t } from '@insight/toolkit-utils'
import { Icon } from '@insight/toolkit-react'
import ReactHtmlParser from 'react-html-parser'

import { DateDisplay } from '../Shared'

export default function Activity({ invalidParts, descriptions, username, timestamp }) {
  return (
    <div className="o-grid c-activity">
      <div className="o-grid__item o-grid__item--shrink">
        <Icon className="c-activity__user-icon" icon="person" />
      </div>
      <div className="o-grid__item">
        <div className='o-grid'>
          <div className="o-grid__item c-activity__username">{username}</div>
          <div className="o-grid__item o-grid__item--shrink c-activity-log__date">
            <DateDisplay timestamp={timestamp} />
          </div>
        </div>
        {descriptions.map((text,i) => (
          <div className="c-activity__message" key={i}>{ReactHtmlParser(text)}</div>
        ))}
        {invalidParts.length > 0 && (
          <div className="c-activity__invalid">
            {t('The following part numbers are invalid and were not copied:')}
            <br />
            {invalidParts.map(part => (
              <span key={part}>{part}</span>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

Activity.propTypes = {
  invalidParts: PropTypes.arrayOf(PropTypes.string),
  descriptions: PropTypes.arrayOf(PropTypes.string).isRequired,
  username: PropTypes.string.isRequired,
  timestamp: PropTypes.number.isRequired,
}

Activity.defaultProps = {
  invalidParts: [],
}