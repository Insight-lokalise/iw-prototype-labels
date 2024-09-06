// Post logs to server and store them in a mem-cache to be periodically cleared
// and appended to a client log file
//
// TODO: Investigate streaming this, since the data is naturally lazy
// because of RiC
export default function postLogs(activity) {
	return fetch('/postLogs', {
		body: JSON.stringify(activity).toString(),
		method: 'POST'
	})
}