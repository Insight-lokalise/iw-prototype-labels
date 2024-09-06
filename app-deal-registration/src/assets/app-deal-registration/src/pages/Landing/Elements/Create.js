import React, { memo } from 'react'
import PropTypes from 'prop-types'
import { Button } from '@insight/toolkit-react'
import { DebouncedInput } from 'components'

const Create = memo(({
	disabled,
	error,
	handleChange,
	handleCreate,
	isCreating,
	label,
	validate,
	value
}) => (
	<div className="c-landing__create">
		<DebouncedInput
			debounce={false}
			fieldComponent="Text"
			hasError={error}
			handleChange={handleChange}
			label={label}
			validate={validate}
			value={value}
		/>
		<Button 
			color="link" 
			disabled={disabled} 
			isLoading={isCreating}
			onClick={handleCreate}
		>
			Submit
		</Button>
	</div>
))

export default Create
