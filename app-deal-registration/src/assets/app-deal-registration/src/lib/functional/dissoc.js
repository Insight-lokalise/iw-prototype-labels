import { curry } from '@insight/toolkit-utils'
import { isNil } from '../equality'

const dissoc = curry((prop, obj) => {
	if (isNil(obj)) {
		return {}
	}

	return Object.keys(obj).reduce((acc, key) => {
		if (key === prop) {
			return acc
		}
		return (acc[key] = obj[key], acc)
	}, {})
})

export default dissoc
