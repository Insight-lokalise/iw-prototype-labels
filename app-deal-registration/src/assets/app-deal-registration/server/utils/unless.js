module.exports = function unless(routes, middleware) {
	return (req, res, next) => {
		if (routes.indexOf(req.path) > -1) {
			return next()
		}
		return middleware(req, res, next)
	}
}
