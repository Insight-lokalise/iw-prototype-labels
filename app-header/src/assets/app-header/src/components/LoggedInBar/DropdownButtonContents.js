import React from 'react'
import PropTypes from 'prop-types'
import Icon from '@insight/toolkit-react/lib/Icon/Icon'

export default function DropdownButtonContents(props) {
  return (
    <div className="o-grid  o-grid--center">
      <Icon className="o-grid__item  o-grid__item--shrink" icon={props.icon} />
      <div className="o-grid__item  o-grid__item--shrink">{props.text}</div>
    </div>
  )
}

DropdownButtonContents.propTypes = {
  icon: PropTypes.string.isRequired,
  text: PropTypes.string.isRequired,
}
