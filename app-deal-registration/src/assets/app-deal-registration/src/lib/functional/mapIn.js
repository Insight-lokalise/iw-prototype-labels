import { curry } from '@insight/toolkit-utils'
import { isNil } from '../equality'

const mapIn = curry((fn, obj) => {
	if (isNil(obj)) {
		return {}
	}

	return Object.keys(obj).reduce((acc, key) => ({
		...acc,
		[key]: fn(obj[key], key)
	}), {})
})

export default mapIn
