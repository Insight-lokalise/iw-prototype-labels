module.exports = (config) => {
  
  // This app requires React and ReactDOM, along with some shared API libs.
  config.externals = {
    'app-api-user-service': 'AppApiUserService.default',
  }

  return config
}
