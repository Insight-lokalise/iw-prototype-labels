const session = require('express-session')

const ACTIVE_DURATION = 5 * 60 * 1000
const DURATION = 30 * 60 * 1000

module.exports = session({
	activeDuration: ACTIVE_DURATION,
	cookieName: 'session',
	duration: DURATION,
	ephemeral: true,
	httpOnly: true,
	resave: false,
	saveUninitialized: true,
	secret: process.env.SESSION_SECRET || 'dev session secret',
	secure: true
})

