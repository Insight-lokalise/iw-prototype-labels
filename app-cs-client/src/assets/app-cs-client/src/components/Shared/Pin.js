import React from 'react'
import PropTypes from 'prop-types'
import cn from 'classnames'
import { useDispatch, useSelector } from 'react-redux'

import { Icon } from '@insight/toolkit-react'

import { selector_isPinned, selector_isPinsEnabled, togglePin } from "../../duck"

export default function Pin({ id, className }) {
  const isPinned = useSelector(state => selector_isPinned(state, id))
  const isPinsEnabled = useSelector(state => selector_isPinsEnabled(state))
  const dispatch = useDispatch()
  const pinClass = isPinned ? 'c-cs-pin--pinned' : 'c-cs-pin--unPinned'
  return isPinsEnabled ? (
    <div className={cn("o-grid__item o-grid__item--shrink u-margin-right-small", className)}>
      <Icon className={pinClass} onClick={() => dispatch(togglePin(id))} icon="pin" />
    </div>
  ) : null
}

Pin.propTypes = {
  id: PropTypes.string.isRequired,
  className: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.objectOf(PropTypes.bool)
  ]),
}

Pin.defaultProps = {
  className: '',
}
