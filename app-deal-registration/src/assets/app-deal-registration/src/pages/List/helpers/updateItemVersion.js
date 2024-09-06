export default function updateItemVersion(item, items) {
	const highestVersion = items.reduce(
		(acc, { versionId }) => versionId > acc ? versionId : acc, 0
	)
	return { ...item, nextVersion: highestVersion + 1 }
}
