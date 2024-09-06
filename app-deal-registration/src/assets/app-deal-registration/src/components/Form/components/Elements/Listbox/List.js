import React, { Component } from 'react'
import PropTypes from 'prop-types'
import cn from 'classnames'

export default class List extends Component {
	state = {
		value: []
	}

	onChange = e => {
		const value = Array.from(e.target.options)
			.filter(option => option.selected)
			.map(option => option.value)

		this.setState({ value })
	}

	renderFilter() {
		const {
			canFilter,
			controlKey,
			disabled,
			displayName,
			filterPlaceholder,
			filterValue,
			id,
			onFilterChange
		} = this.props

		if (!canFilter) {
			return null
		}

		return (
			<div className="c-listbox__filter-container">
				<label className="c-listbox__label" htmlFor={`${id}-filter-${controlKey}`}>
					Filter {` ${displayName}`}
				</label>
				<input
					className="c-listbox__filter"
					data-key={controlKey}
					disabled={disabled}
					id={`${id}-filter-${controlKey}`}
					onChange={onFilterChange}
					placeholder={filterPlaceholder}
					type="text"
					value={filterValue}
				/>
			</div>
		)
	}

	renderSelect() {
		const {
			children,
			controlKey,
			disabled,
			displayName,
			id,
			inputRef,
			onDoubleClick,
			onKeyUp
		} = this.props

		const { value } = this.state

		return (
			<div className="c-listbox__select-container">
				<label className="c-listbox__label" htmlFor={`${id}-${controlKey}`}>
					{displayName}
				</label>
				<select
					className="c-listbox__select"
					disabled={disabled}
					id={`${id}-${controlKey}`}
					multiple
					onChange={this.onChange}
					onDoubleClick={onDoubleClick}
					onKeyUp={onKeyUp}
					ref={inputRef}
					value={value}
				>
					{children}
				</select>
			</div>
		)
	}

	render() {
		const { actions, controlKey } = this.props

		return (
			<div className={`c-listbox__list c-listbox__list-${controlKey}`}>
				{this.renderFilter()}
				{actions}
				{this.renderSelect()}
			</div>
		)
	}
}
