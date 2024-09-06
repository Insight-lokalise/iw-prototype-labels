import React from 'react'
import PropTypes from 'prop-types'
import cn from 'classnames'

import batteryEmpty from './assets/batteryEmpty.svg'
import batteryLow from './assets/batteryLow.svg'
import batteryHigh from './assets/batteryHigh.svg'
import batteryFull from './assets/batteryFull.svg'
import deliveryTruck from './assets/deliveryTruck.svg'

const typeToIconMap = {
	batteryEmpty,
	batteryLow,
	batteryHigh,
	batteryFull,
    deliveryTruck
}

const ICON_TYPES = Object.keys(typeToIconMap)

export default function Icon({ className, type, ...rest }) {
	const classes = cn('c-icon', className)
	const Component = typeToIconMap[type] 
	return <Component className={classes} {...rest} />
}

Icon.propTypes = {
	className: PropTypes.string,
	type: PropTypes.oneOf(ICON_TYPES)
}

Icon.defaultProps = {
	className: ''
}
