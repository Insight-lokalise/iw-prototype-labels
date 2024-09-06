export default function getUniversalEmail(items, value, idx) {
	console.log(idx)
	let returned = []
	if (idx == items.length) {
		returned = [...items, value]
	} else if (idx < items.length && items.length > 0) {
		returned = items.map((item, index) => index === idx ? value : item)
	} else {
		returned = [value]
	}

	console.log(returned)
	return returned
}
