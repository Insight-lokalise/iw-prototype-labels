import React, { useState, useEffect } from 'react'
import { Field } from '@components'
import { isRequired } from '@lib'
import { COUNTRY_TYPE_OPTIONS } from '../../constants'
import { getCountries } from '@api'

export default function CountryTypes({ errors, handleChange, salesAreaId }) {
	const [salesOrgs, setSalesOrgs] = useState(COUNTRY_TYPE_OPTIONS)

	useEffect(() => {
		const fetchSalesOrgs = async () => {
			const countries = await getCountries()
			const salesOrgValues = countries.map(country => ({
				optionValue: country.salesAreaId,
				text: country.salesOrg,
			}))
			setSalesOrgs(salesOrgValues)
		}
		fetchSalesOrgs()
	}, [])

	return (
		<div className='c-admin-search__select'>
			<Field
				handleChange={handleChange}
				hasNoInitialSelection
				label='Sales org'
				name='salesAreaId'
				options={salesOrgs}
				type='Select'
				validators={[isRequired]}
			/>
		</div>
	)
}
