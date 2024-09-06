import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Button } from '@insight/toolkit-react'
import { addProgram } from 'api'
import { isRequired } from 'lib'
import { Create, Select } from '../Elements'
import { createProgramArgs, getProgramOptions, programExists } from '../helpers'
import { createToast } from '../toasts'

export default class Program extends Component {
	state = {
		error: false,
		isCreating: false,
		name: '',
		showCreate: this.props.manufacturer && !this.props.manufacturer.programs.length > 0
	}

	handleChange = ({ target: { value } }) => {
		this.setState({ name: value })
	}

	handleCreate = async () => {
		this.setState({ isCreating: true })
		const args = createProgramArgs(this.state, this.props)
		const response = await addProgram(args)
		if (response && !response.status) {
			this.props.updatePrograms(this.state.name, this.props.manufacturer)
			this.setState({ isCreating: false, name: '', showCreate: false })
			return
		}

		this.props.emitter.emit('add-toast', createToast('create-program-failure'))
		this.setState({ isCreating: false })
	}

	handleSelect = ({ target: { name, value } }, fieldError) => {
		this.props.handleChange({ error: fieldError, name, value })
	}

	toggleCreate = () => {
		this.setState(({ showCreate }) => ({
			showCreate: !showCreate
		}))
	}

	validate = value => {
		const errors = [isRequired(value), programExists(value, this.props.manufacturer.programs)].filter(Boolean)
		const hasErrors = errors.length > 0
		this.setState({ error: hasErrors })
		return hasErrors && errors[0]
	}

	render() {
		const { country, error, isFetching, manufacturer, value } = this.props
		const { isCreating, name, showCreate } = this.state

		if (isFetching) {
			return null
		}

		const options = getProgramOptions(manufacturer && manufacturer.programs)
		return (
			<div className="c-landing__section">
				<Select
					disabled={!manufacturer || !options.length > 0}
					error={error}
					handleChange={this.handleSelect}
					name="program"
					options={options}
					label="Program"
					value={value}
				/>
				<Button color="link" onClick={this.toggleCreate}>Create</Button>
				{showCreate && (
					<Create
						disabled={!name || !manufacturer}
						handleChange={this.handleChange}
						handleCreate={this.handleCreate}
						label="Create new program"
						validate={this.validate}
						value={name}
					/>
				)}
			</div>
		)
	}
}
