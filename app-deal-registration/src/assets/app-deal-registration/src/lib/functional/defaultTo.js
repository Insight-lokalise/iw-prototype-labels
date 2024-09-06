export default function deafultTo(defaultVal, item) {
	if (arguments.length === 1) {
		return itemPlaceholder => deafultTo(defaultVal, itemPlaceholder)
	}

	return item == null || item !== item
		? defaultVal
		: item
}
