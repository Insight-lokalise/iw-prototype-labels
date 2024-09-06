import React, { createElement, Component } from 'react'
import PropTypes from 'prop-types'

export default function withContext(PassedComponent, Consumer, contextKey) {
	return class WithContext extends Component {
		render() {
			return createElement(Consumer, {
				children: context => createElement(PassedComponent, {
					[`${contextKey}`]: context,
					...this.props
				})
			})
		}
	}
}
