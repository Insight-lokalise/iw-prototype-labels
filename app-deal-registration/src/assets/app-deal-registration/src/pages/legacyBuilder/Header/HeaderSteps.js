import React from 'react'

import { Steps } from 'components'

const createTemplateTitles = isEdit => ([
	{ title: `${isEdit ? 'Edit' : 'Build' } your Template` },
	{ title: 'Finalize your Template '}
])
const createFormTitles = isEdit => ([
	{ title: `${isEdit ? 'Edit' : 'Build'} your Form` },
	{ title: 'Layout your Form' },
	{ title: 'Finalize your Form '}
])

const createStepTitles = ({ isEdit, isTemplate }) => {
	return isTemplate ? createTemplateTitles(isEdit) : createFormTitles(isEdit)
}

export default function HeaderSteps({
	activeStep,
	isDisabled,
	isEdit,
	isTemplate,
	onClick
}) {
	const titles = createStepTitles({ isEdit, isTemplate })
	const steps = titles.map((step, index) => {
		const correctIndex = index + 1
		const handleClick = e => {
			onClick(correctIndex)
		}

		return {
			...step,
			disabled: (correctIndex > activeStep && isDisabled),
			isComplete: !!(correctIndex < activeStep),
			isSelected: correctIndex === activeStep,
			onClick: handleClick
		}
	})

	return <Steps steps={steps} />
}
