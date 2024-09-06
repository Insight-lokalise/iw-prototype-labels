import React from 'react'
import PropTypes from 'prop-types'
import { Icon, Loading, Panel } from '@insight/toolkit-react'
import { t } from '@insight/toolkit-utils'

export default function NoSaves({ hasCarts, hasFailed, hasOrders, isLoading }) {
  const willDisplay = !hasCarts || !hasOrders || hasFailed || isLoading
  const text = hasFailed ? (
    'There was a problem loading your saved carts.'
  ) : (
    `No ${!hasCarts ? 'saved carts' : ''}${(!hasCarts && !hasOrders) ? ' or ' : ''}${!hasOrders ? 'order templates' : ''} exist.`
  )
  const icon = hasFailed ? 'alert' : 'information-circled'
  const type = hasFailed ? 'error' : 'info'
  if (willDisplay) return (
    <Panel className="c-save-for-later__panel">
      <Panel.Body>
        { isLoading ? (
          <div className="u-text-center">
            <Loading size="large" />
          </div>
        ) : (
          <div className='c-no-saves'>
            <Icon className='c-no-saves__icon' icon={icon} type={type} />
            <strong>{t(text)}</strong>
          </div>
        )}
      </Panel.Body>
    </Panel>
  )
  return null
}

NoSaves.propTypes = {
  hasCarts: PropTypes.bool,
  hasFailed: PropTypes.bool,
  hasOrders: PropTypes.bool,
  isLoading: PropTypes.bool,
}

NoSaves.defaultProps = {
  hasCarts: true,
  hasFailed: false,
  hasOrders: true,
  isLoading: true
}
