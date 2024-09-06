const { idp, sp, ROLE_TYPE } = require('../services/saml')

module.exports = function authRoutes(app) {
	app.get('/user', (req, res) => {
		const { currentUser } = req.session
		res.json(currentUser)
	})
	
	app.get('/login', (req, res) => {
		sp.create_login_request_url(idp, {}, (err, login_url, request_id) => {
			if (err != null) {
				return res.send(500)
			}
			res.redirect(login_url)
		})
	})

	app.get('/metadata.xml', (req, res) => {
		res.type('application/xml')
		res.send(sp.create_metadata())
	})

	app.post('/assert', (req, res) => {
		const options = { request_body: req.body }
		const { RelayState } = req.body

		console.log('session name id before assert', req.session.name_id)

		sp.post_assert(idp, options, (err, saml_response) => {

      console.log('saml response and error from IDP', saml_response, err)

			if (err != null) {
				return res.send(500)
			}

			const { name_id, ppid, role, session_index } = saml_response.user

			if (name_id === '' || name_id === null) {
				res.redirect('/access')
			}

			const redirectTo = RelayState || '/'

			console.log('name id in assert', name_id)
			req.session.currentUser = { employeeID: ppid, name: name_id, role}
			req.session.name_id = name_id
			req.session.session_index = session_index
			res.redirect(redirectTo)
		})
	})

	app.post('/logout', (req, res) => {
		const options = {
			name_id: req.session.name_id,
			session_index: req.session.session_index
		}
		req.session.destroy(error => {
			sp.create_logout_request_url(idp, options, (err, logout_url) => {
				if (err != null) {
					return res.send(500)
				}
				res.redirect(logout_url)
			})
		})
	})
}
