import React, { memo, useEffect, useState } from 'react'
import { getCountries } from '@api'
import { isRequired } from '@lib'
import { Select } from '../Elements'

const Country = memo(({ error, handleChange, value }) => {
	const [countries, setCountries] = useState([])

	useEffect(() => {
		const fetchCountries = async () => {
			const response = await getCountries()
			const Countries = response.map(country => ({
				text: country.salesOrg,
				value: country,
			}))
			setCountries(Countries)
		}

		fetchCountries()
	}, [value])

	const onChange = ({ target: { name, value } }, fieldError) => {
		const selected = countries.find(({ text }) => text === value)
		handleChange({ error: fieldError, name, value: selected.value })
	}

	return (
		<div className="c-landing__section">
			<Select
				error={error}
				handleChange={onChange}
				label="Choose a salesOrg"
				name="country"
				options={countries}
				validate={isRequired}
				value={value && value.salesOrg}
			/>
		</div>
	)
})

export default Country
