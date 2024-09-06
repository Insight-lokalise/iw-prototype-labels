import sortByActiveItem from './sortByActiveItem'

export default function addActiveItem(items, versionId) {
	return sortByActiveItem(items.map(
		item => ({ ...item, isActive: item.versionId === versionId })
	))
}
