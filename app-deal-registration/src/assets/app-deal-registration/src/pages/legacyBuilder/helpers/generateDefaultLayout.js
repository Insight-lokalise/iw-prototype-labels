const defaultInputHeights = {
	Checkbox: 1,
	Date: 2,
	Dropdown: 1,
	ListBox: 3,
	Number: 1,
	Radio: 2,
	Text: 1,
	TextArea: 3
}

export default function generateCustomLayout(groups, inputs, offsetH = 0) {
	const groupKeys = Object.keys(groups)
	const inputKeys = Object.keys(inputs)

	let lastGroupX = 0
	let heightOffset = offsetH
	let maxHInGroup = 0

	return groupKeys.reduce((acc, groupKey, groupIndex) => {
		const group = groups[groupKey]
		const groupMarker = groupIndex + 1
		const groupLayout = {
			w: 4,
			i: groupKey
		}

		if (lastGroupX === 5) {
			groupLayout.x = 9
		} else if (lastGroupX === 9) {
			groupLayout.x = 0
		} else if (lastGroupX === 0 && groupMarker !== 1) {
			groupLayout.x = 5
		} else {
			groupLayout.x = 0
		}

		lastGroupX = groupLayout.x

		let groupH = 0

		const groupInputs = inputKeys.reduce((coll, inputKey) => {
			if (inputKey.split('-')[0] === groupKey) {
				const input = inputs[inputKey]
				groupH += defaultInputHeights[input.type]
				coll.push(input)
			}
			return coll
		}, [])


		groupLayout.h = groupH + 2
		if (groupLayout.h > maxHInGroup) {
			maxHInGroup = groupLayout.h
		}

		if (groupMarker <= 3) {
			groupLayout.y = 0
		} else if (groupMarker > 3 && groupMarker % 3 === 0) {
			groupLayout.y = heightOffset || maxHInGroup + 1
			heightOffset += maxHInGroup + 1
			maxHInGroup = 0
		} else {
			groupLayout.y = heightOffset
		}

		let totalChildY = 0

		const childLayouts = groupInputs.reduce((layouts, groupInput, inputIndex) => {
			const layout = { x: 0, w: 12, i: groupInput.id }
			const height = defaultInputHeights[groupInput.type]
			layout.h = height

			layout.y = inputIndex === 0 ? 0 : totalChildY + 1
			totalChildY += height
			layouts.push(layout)
			return layouts
		}, [])

		acc[groupKey] = {
			layout: groupLayout,
			childLayouts
		}
		return acc
	}, {})
}
