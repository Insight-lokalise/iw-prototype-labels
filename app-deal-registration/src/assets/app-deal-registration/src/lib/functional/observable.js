import { isPromise } from '@insight/toolkit-utils'

export class Observable {
	constructor() {
		this.observers = []
	}

	subscribe(fn) {
		this.observers.push(fn)
	}

	unsubscribe(fn) {
		if (fn) {
			this.observers = this.observers.filter(item => {
				if (item !== fn) {
					return item
				}
				return null
			})
		} else {
			this.observers = []
		}
	}

	next(observer, context) {
		const scope = context || window
		this.observers.forEach(item => {
			item.call(scope, observer)
		})
	}
}

export function fromPromise(promise, cb) {
	const observable = new Observable()
	promise.then(value => {
		const mappedValue = value => (cb ? cb(value) : value)
		observable.next(mappedValue(value))
	}, err => {
		observable.next(err)
	}).then(null, err => {
		throw err
	})
	return observable
}

export function toObservable(obj) {
	const observable = isPromise(obj) ? fromPromise(obj) : obj
	return observable
}
