import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Button, Loading } from '@insight/toolkit-react'
import { Select } from '../Elements'
import { getManufacturerOptions} from '../helpers'

export default class Manufacturer extends Component {

  componentDidMount() {
    if (!this.props.manufacturers.length > 0) {
      this.props.fetchManufacturers()
    }
  }

    handleSelect = ({ target: { name, value } }, fieldError) => {
		const selected = this.props.manufacturers.find(({ manufacturer }) => {
			return manufacturer === value
		})
		this.props.handleChange({ error: fieldError, name, value: selected })
	}

	componentDidUpdate(prevProps) {
		if (this.props.country !== prevProps.country) {
			this.props.fetchManufacturers()
		}
	}

	render() {
		const { country, error, isFetching, manufacturers, value } = this.props

		if (isFetching) {
			return (
				<div className="c-landing__section is-fetching">
					<Loading size="small" />
				</div>
			)
		}

		const options = getManufacturerOptions(manufacturers)
		return (
			<div className="c-landing__section">
				<Select
					disabled={!country || !options.length > 0}
					error={error}
					handleChange={this.handleSelect}
					label="Manufacturer"
					name="manufacturer"
					options={options}
					value={value && value.manufacturer}
				/>
				<Button color="link" href="https://servicedesk.insight.com" target="_blank">Create</Button>
			</div>
		)
	}
}
