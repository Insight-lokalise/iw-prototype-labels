export default (isLegacy, isServer) => {
	const name = isServer ? 'server' : 'client'
	if (!isServer && isLegacy) {
		return `${name}-legacy`
	}
	return name
}
