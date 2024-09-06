const { idp, sp, ROLE_TYPE } = require('../services/saml')
const { unless } = require('../utils')

module.exports = unless(['/access', '/assert', '/metadata.xml'], (req, res, next) => {
	const originalUrl = req.originalUrl

	console.log('session name before login_request', req.session.name_id)

	if (req.session && !req.session.name_id) {
		console.log('session name in conditional before request', req.session.name_id)
		sp.create_login_request_url(idp, { relay_state: originalUrl }, (err, login_url, request_id) => {
			if (err != null) {
				return res.send(500)
			}
			res.redirect(login_url)
		})
	} else {
		next()
	}
})
