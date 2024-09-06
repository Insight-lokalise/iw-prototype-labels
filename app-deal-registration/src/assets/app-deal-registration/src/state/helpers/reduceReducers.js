// Reduce-reducers works in a similar manner to combine reducers
// Rather than combining slices of state it combines all slices into a flat tree.

export default function reduceReducers(...args) {
	const initialState = args[args.length - 1] && args.pop()
	const reducers = args

	return (prevState, value, ...args) => {
		const prevStateIsUndefined = typeof prevState === 'undefined'
		const valueIsUndefined = typeof value === 'undefined'

		if (initialState && prevStateIsUndefined && valueIsUndefined) {
			return initialState
		}

		return reducers.reduce((newState, reducer) => {
			return reducer(newState, value, ...args)
		}, prevStateIsUndefined && !valueIsUndefined && initialState ? initialState : prevState)
	}
}
