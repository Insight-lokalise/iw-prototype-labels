const path = require('path')
const dotenv = require('dotenv')
const startServer = require('../../start')
const { copyEnvFiles } = require('./helpers/files')

module.exports = async function start(options) {
  try {
    copyEnvFiles(options).then(() => {
      dotenv.config({
        path: path.resolve(process.cwd(), `.env.server`)
      })
      startServer(options)
    })
  } catch (err) {
    console.error(err)
    throw err
  }
}
