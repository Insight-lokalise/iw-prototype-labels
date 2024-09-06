import { IS_DEV } from 'lib'
import { Logger } from 'services'

export default function errorMiddleware(store) {
	return next => action => {
		if (action.type === 'THROW_ERROR') {
			console.error('Caught an exception!', action.err)
			if (!IS_DEV) {
				Logger.addEvent({
					err: action.err,
					meta: {
						action,
						state: store.getState()
					},
					type: 'Redux'
				})
			}
		}

		try {
			return next(action)
		} catch (err) {
			console.error('Caught an exception', err)
			if (!IS_DEV) {
				Logger.addEvent({
					err,
					meta: {
						action,
						state: store.getState()
					},
					type: 'Redux'
				})
			}
			throw err
		}
	}
}