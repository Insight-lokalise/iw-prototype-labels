import { postLogs } from 'api'

function createLogger() {
	const events = []

	let isIdleCallbackScheduled = false

	function addEvent(obj) {
		events.push(obj)
		schedulePendingEvents()
	}

	function schedulePendingEvents() {
		if (isIdleCallbackScheduled) {
			return
		}
		isIdleCallbackScheduled = true

		if ('requestIdleCallback' in window) {
			window.requestIdleCallback(processPendingEvents, { timeout: 3000 })
		} else {
			processPendingEvents()
		}
	}

	function processPendingEvents(deadline) {
		isIdleCallbackScheduled = false

		if (typeof deadline === 'undefined') {
			deadline = { timeRemaining: () => Number.MAX_VALUE }
		}

		while (deadline.timeRemaining() > 0 && events.length > 0) {
			const evt = events.pop()
			postLogs(evt)
		}

		if (events.length > 0) {
			schedulePendingEvents()
		}
	}

	return { addEvent }
}

const Logger = createLogger()
export default Logger