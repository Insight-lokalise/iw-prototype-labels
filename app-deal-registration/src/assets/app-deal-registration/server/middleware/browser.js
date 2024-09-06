const uaParser = require('ua-parser-js')
const parser = new uaParser()

module.exports = (req, res, next) => {
	const ua = req.headers['user-agent']
	const browserName = parser
		.setUA(ua)
		.getBrowser()
		.name
	res.locals.browser = browserName
	next()
}
