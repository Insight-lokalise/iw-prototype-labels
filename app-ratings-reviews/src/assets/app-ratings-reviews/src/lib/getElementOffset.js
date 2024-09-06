export default function getElementOffset(el) {
	const rect = el.getBoundingClientRect()
	const scrollLeft = window.pageXOffset
	const scrollTop = window.pageYOffset
	return {
		left: rect.left + scrollLeft,
		top: rect.top + scrollTop
	}
}
