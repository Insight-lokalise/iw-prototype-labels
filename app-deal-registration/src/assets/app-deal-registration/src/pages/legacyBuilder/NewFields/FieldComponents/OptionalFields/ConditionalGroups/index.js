import React, { Component } from 'react'
import PropTypes from 'prop-types'
import cuid from 'cuid'
import { Button, Icon } from '@insight/toolkit-react'
import { Accordion } from 'components'
import { DEFAULT_CONDITIONAL_STATE } from '../../../constants'

import Conditionals from './Conditionals'

export default function ConditionalGroups({
	checkForInputErrors,
	conditionalGroups,
	hideConditionals,
	updateConditionals
}) {
	const addConditional = groupId => () => {
		const groups = {
			...conditionalGroups,
			[groupId]: conditionalGroups[groupId].concat(DEFAULT_CONDITIONAL_STATE)
		}
		updateConditionals(groups)
	}

	const addConditionalGroup = () => {
		const len = Object.keys(conditionalGroups).length
		const groups = { ...conditionalGroups, [cuid()]: [DEFAULT_CONDITIONAL_STATE] }
		console.log(groups)
		updateConditionals(groups)
	}

	const removeConditional = (groupId, itemId) => {
		const newGroup = conditionalGroups[groupId].filter((item, index) => index !== itemId)
		if (!newGroup.length > 0) {
			removeConditionalGroup(groupId)()
			return
		}
		const groups = {
			...conditionalGroups,
			[groupId]: newGroup
		}
		updateConditionals(groups)
	}

	const removeConditionalGroup = groupId => () => {
		const groups = Object.keys(conditionalGroups).reduce((acc, key) => {
			if (groupId === key) return acc
			acc[key] = conditionalGroups[key]
			return acc
		}, {})
		if (!Object.keys(groups).length > 0) {
			hideConditionals()
			const newGroups = {[groupId]: [DEFAULT_CONDITIONAL_STATE]}
			updateConditionals(newGroups)
		} else {
			updateConditionals(groups)
		}
	}

	const updateConditional = (groupId, itemId) => ({ target: { name, value }}, error) => {
		const groups = {
			...conditionalGroups,
			[groupId]: conditionalGroups[groupId].map((item, index) => {
				return index === itemId ? { ...item, [name]: value } : item
			})
		}
		updateConditionals(groups, error, `conditionalGroups-${groupId}-${itemId}-${name}`)
	}

	return (
		<div className="c-builder-field-group__conditionals">
			<div className="c-builder-field-group__conditionals-header">
				<h3>Conditionals</h3>
				<div className="c-builder-field-group__conditionals-text">
					<p>
						Conditionals provide a way to make an input field change it's visibility dyanmically based on other values
						in the form. Each Conditional inside of a group has a <strong>when</strong> and an <strong>is</strong> field
					</p>
					<p>
						These fields will help you select the parts of the form you care about
						<ul>
							<li><strong>When</strong> - Is the unique inputID of the field you want to react to</li>
							<li><strong>Is</strong> - Is the value that field should have to make this one visibile</li>
						</ul>
					</p>
					<p>
						Each conditional within a group needs to be true if that field should be visible, but only <strong>one</strong>
						group needs to be true. This means you can construct complex and and or conditionals by using groups
					</p>
				</div>
			</div>
			{Object.keys(conditionalGroups).map((key, index) => (
				<Accordion
					buttonClassName="c-builder-fields__accordion-button"
					buttonContent={(<p>Conditional Group</p>)}
					className="c-builder-fields__accordion"
					extraAction={(
						<Button
							className="c-builder-fields__accordion-remove"
							onClick={removeConditionalGroup(key)}
						>
							<Icon icon="trashcan" type="error" />
						</Button>
					)}
					initialIsOpen
					key={key}
				>
					<Conditionals
						addConditional={addConditional}
						checkForInputErrors={checkForInputErrors}
						conditionalGroup={conditionalGroups[key]}
						index={key}
						removeConditional={removeConditional}
						updateConditional={updateConditional}
					/>
				</Accordion>
			))}
			<div className="c-builder-field-group__conditionals-options">
				<Button color="link" onClick={addConditionalGroup}>
					Add another group of conditionals
				</Button>
			</div>
		</div>
	)
}
