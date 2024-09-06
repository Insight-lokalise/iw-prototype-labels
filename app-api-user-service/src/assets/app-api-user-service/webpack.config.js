module.exports = (config) => {
  // TODO: Include this as part of the webpack build for prototype
  config.output.library = 'AppApiUserService'
  config.externals = {
    '@insight/app-core': {
      'registerModule': 'AppCore.default.registerModule',
      'triggerExternalAction': 'AppCore.default.triggerExternnalAction'
    }
  }
  return config
}
