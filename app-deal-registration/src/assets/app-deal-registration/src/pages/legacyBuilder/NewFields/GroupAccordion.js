import React from 'react'
import PropTypes from 'prop-types'
import { Button } from '@insight/toolkit-react'
import { Accordion } from 'components'

export default function GroupAccordion({
	buttonContent,
	children,
	extraAction,
	id,
	key
}) {
	return (
		<Accordion
			buttonClassName="c-builder-fields__accordion-button"
			buttonContent={buttonContent}
			className="c-builder-fields__accordion"
			extraAction={extraAction || null}
			id={id}
			key={key}
		>
			{children}
		</Accordion>
	)
}
