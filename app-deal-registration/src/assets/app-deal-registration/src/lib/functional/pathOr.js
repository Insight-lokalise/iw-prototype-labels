import { curry } from '@insight/toolkit-utils'
import defaultTo from './defaultTo'
import path from './path'


const pathOr = curry((defaultValue, inputPath, obj) => {
	return defaultTo(
		defaultValue,
		path(inputPath, obj)
	)
})

export default pathOr

