import customAdapter from './custom'
import universalAdapter from './universal'

export default function applyAdapter(input, type = 'custom') {
	const copy = { ...input }
	const unassignedAdapter = type === 'custom' ? customAdapter : universalAdapter
	const adapter = unassignedAdapter(copy)
	return context => adapter(context)
} 
