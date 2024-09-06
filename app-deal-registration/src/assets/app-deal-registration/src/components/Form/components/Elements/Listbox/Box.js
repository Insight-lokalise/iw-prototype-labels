import React, { Component } from 'react'
import PropTypes from 'prop-types'
import cn from 'classnames'
import { keyCodes } from '@insight/toolkit-utils/lib/types'
import { generateUniqueId } from '@insight/toolkit-utils'

import Action from './Action'
import List from './List'

const defaultFilter = (option, value) => {
	if (value === '') {
		return true
	}

	return new RegExp(value, 'i').test(option.label)
}

export default class ListBox extends Component {
	static getDerivedStateFromProps(nextProps, prevState) {
		if (nextProps.filter != null) {
			return { filter: nextProps.filter }
		}
		return null
	}

	id = this.props.id || generateUniqueId()
	state = {
		filter: this.props.filter
			? this.props.filter
			: { available: '', selected: '' }
	}

	onChange(selected) {
		const { onChange, options, simpleValue } = this.props
		if (simpleValue) {
			onChange(selected)
		} else {
			const complexSelected = []
			options.forEach(option => {
				if (option.value) {
					if (selected.includex(option.value)) {
						complexSelected.push(option)
					}
				} else {
					const subSelected = []
					option.options.forEach(subOption => {
						if (selected.includes(subOption.value)) {
							subSelected.push(subOption)
						}
					})

					if (subSelected.length > 0) {
						complexSelected.push({
							label: option.label,
							options: subSelected
						})
					}
				}
			})

			onChange(complexSelected)
		}
	}

	onClick = ({ direction, isMoveAll }) => {
		const { options } = this.props
		const select = direction === 'right' ? this.available : this.selected

		let selected = []
		if (isMoveAll) {
			selected = direction === 'right' ? this.makeOptionsSelected(options) : []
		} else {
			selected = this.toggleSelected(this.getSelectedOptions(select))
		}

		this.onChange(selected)
	}

	onDoubleClick = e => {
		const { value } = e.currentTarget
		const selected = this.toggleSelected([value])
		this.onChange(selected)
	}

	onKeyUp = e => {
		const { currentTarget, keyCode } = e
		if (keyCode === keyCodes.ENTER || keyCodes === keyCodes.SPACE) {
			const selected = this.toggleSelected(
				Array.from(currentTarget.options)
					.filter(({ selected }) => selected)
					.map(({ value }) => value)
			)
			this.onChange(selected)
		}
	}

	onFilterChange = e => {
		const { onFilterChange } = this.props
		const { filter } = state
		const newFilter = {
			...filter,
			[e.target.dataset.key]: e.target.value
		}

		if (onFilterChange) {
			onFilterChange(newFilter)
		} else {
			this.setState({ filter: newFilter })
		}
	}

	getFlatOptions(options) {
		const { simpleValue } = this.props
		if (simpleValue) {
			return Array.isArray(options) ? options : [options]
		}

		const flattened = []
		options.forEach(option => {
			if (option.value) {
				flattened.push(option.value)
			} else {
				option.options.forEach(subOption => {
					flattened.push(subOption.value)
				})
			}
		})

		return flattened
	}

	getLabelMap(options) {
		return options.reduce((acc, curr) => {
			if (curr.options !== undefined) {
				acc = { ...acc, ...this.getLabelMap(curr.options)}
				return acc
			}
			acc[curr.value] = curr.label 
		})
	}

	getSelectedOptions(element) {
		return Array.from(element.options)
			.filter(({ selected }) => selected)
			.map(({ value }) => value)
	}

	makeOptionsSelected(options) {
		const { selected: previousSelected } = this.props
		let newSelected = []

		this.filterAvailable(options).forEach(option => {
			if (option.options !== undefined) {
				newSelected = [...newSelected, ...this.makeOptionsSelected(option.options)]
			} else {
				newSelected.push(option.value)
			}
		})

		return [
			...this.getFlatOptions(previousSelected),
			...newSelected
		]
	}

	toggleSelected(selectedItems) {
		const { selected } = this.props
		const oldSelected = this.getFlatOptions(selected).slice(0)

		selectedItems.forEach(value => {
			const index = oldSelected.indexOf(value)
			if (index >= 0) {
				oldSelected.splice(index, 1)
			} else {
				oldSelected.push(value)
			}
		})

		return oldSelected
	}

	filterOptions(options, filterer, filterInput) {
		const { canFilter, filterCallback } = this.props
		const filtered = []

		options.forEach(option => {
			if (option.options !== undefined) {
				const children = this.filterOptions(option.options, filterer, filterInput)
				if (children.length > 0) {
					filtered.push({
						label: option.label,
						options: children
					})
				}
			} else if (filterer(option)) {
				if (canFilter && !filterCallback(option, filterInput)) {
					return
				}
				filtered.push(option)
			}
		})

		return filtered
	}

	filterAvailable(options) {
		const { available, selected } = this.props
		const { available: availableFilter } = this.state.filter

		if (available !== undefined) {
			return this.filterOptions(options, option => (
				this.getFlatOptions(available).indexOf(option.value) >= 0 &&
				this.getFlatOptions(selected).indexOf(option.value) < 0
			), availableFilter)
		}

		return this.filterOptions(
			options,
			option => this.getFlatOptions(selected).indexOf(option.value) < 0,
			availableFilter
		)
	}

	filterSelected(options) {
		const { preserveSelectOrder, selected } = this.props
		const { filter: { selected: selectedFilter } } = this.state

		if (preserveSelectOrder) {
			return this.filterSelectedByOrder(options)
		}

		return this.filterOptions(
			options,
			option => this.getFlatOptions(selected).indexOf(option.value) >= 0,
			selectedFilter
		)
	}

	filterSelectedByOrder(options) {
		const { canFilter, filterCallback, selected } = this.props
		const { filter: { selected: selectedFilter } } = this.state
		const labelMap = this.getLabelMap(options)

		const selectedOptions = this.getFlatOptions(selected).map(value => ({
			label: labelMap[value],
			value
		}))

		if (canFilter) {
			return selectedOptions.filter(selectedOption => filterCallback(selectedOption, selectedFilter))
		}

		return selectedOptions
	}

	renderOptions(options) {
		return options.map(option => {
			const key = `${option.value}-${option.label}`
			if (option.options !== undefined) {
				return (
					<optgroup key={key} label={option.label}>
						{this.renderOptions(option.options)}
					</optgroup>
				)
			}

			return (
				<option key={key} value={option.value}>
					{option.label}
				</option>
			)
		})
	}

	renderList(controlKey, displayName, options, ref) {
		const {
			canFilter,
			disabled,
			filterPlaceholder
		} = this.props
		const { filter } = this.state

		return (
			<List
				canFilter={canFilter}
				controlKey={controlKey}
				disabled={disabled}
				displayName={displayName}
				filterPlaceholder={filterPlaceholder}
				filterValue={filter[controlKey]}
				id={this.id}
				inputRef={node => {
					this[controlKey] = node
					if (ref) {
						ref(node)
					}
				}}
				onDoubleClick={this.onDoubleClick}
				onFilterChange={this.onFilterChange}
				onKeyUp={this.onKeyUp}
			>
				{options}
			</List>
		)
	}

	render() {
		const {
			availableLabel,
			availableRef,
			canFilter,
			disabled,
			name,
			options,
			selected,
			selectedLabel,
			selectedRef
		} = this.props

		const availableOptions = this.renderOptions(this.filterAvailable(options))
		const selectedOptions = this.renderOptions(this.filterSelected(options))

		const actionsRight = (
			<div className="c-listbox__actions-right">
				<Action direction="right" disabled={disabled} isMoveAll onClick={this.onClick} />
				<Action direction="right" disabled={disabled} onClick={this.onClick} />
			</div>
		)

		const actionsLeft = (
			<div className="c-listbox__actions-left">
				<Action direction="left" disabled={disabled} onClick={this.onClick} />
				<Action direction="left" disabled={disabled} isMoveAll onClick={this.onClick} />
			</div>
		)


		const classes = cn('c-listbox', {
			'has-filter': canFilter
		})

		const value = this.getFlatOptions(selected).join(',')

		return (
			<div className={classes}>
				{this.renderList('available', availableLabel, availableOptions, availableRef)}
				<div className="c-listbox__actions">
					{actionsRight}
					{actionsLeft}
				</div>
				{this.renderList('selected', selectedLabel, selectedOptions, selectedRef)}
				<input disabled={disabled} name={name} type="hidden" value={value} />
			</div>
		)
	}
}

ListBox.defaultProps = {
	simpleValue: true
}