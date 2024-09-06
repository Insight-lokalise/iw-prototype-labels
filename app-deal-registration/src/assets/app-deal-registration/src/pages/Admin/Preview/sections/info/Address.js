import React from 'react'
import PropTypes from 'prop-types'

export default function Address({ soldToAddress, soldToCity, soldToState, soldToZip }) {
	return `${soldToAddress} ${soldToCity} ${soldToState} ${soldToZip}`
}
