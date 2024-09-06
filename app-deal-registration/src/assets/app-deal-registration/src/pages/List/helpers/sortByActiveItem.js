export default function sortByActiveItem(items) {
	const response = items.sort((a, b) => {
		return b.isActive - a.isActive
	})
	return response
}
