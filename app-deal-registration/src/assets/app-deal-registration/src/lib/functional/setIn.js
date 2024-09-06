import { curry } from '@insight/toolkit-utils'

const setPath = ([key, ...next], value, obj) => {
	if (next.length === 0) {
		return { ...obj, [key]: value }
	}
	return { ...obj, [key]: setPath(next, value, obj[key])}
}

const setIn = curry((path, value, obj) => {
	return setPath(path.split('.'), value, obj)
})

export default setIn
