const path = require('path')
const http = require('http')

const createApp = require('./server/server')

module.exports = function startServer(options) {
	const app = createApp(options)
	const server = http.createServer(app)
	server.listen(process.env.PORT, () => {
        console.log(`Server is running at ${process.env.HOST} on port ${process.env.PORT} with domain as ${process.env.DOMAIN}`)
    })
}
