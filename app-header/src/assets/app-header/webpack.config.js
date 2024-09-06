module.exports = (config) => {
  
  // This app requires React and ReactDOM, along with some shared API libs.
  config.externals = {
    'react': 'AppCore.default.React',
    'react-dom': 'AppCore.default.ReactDOM',
    
    'app-api-menu-filtering': 'AppApiMenuFiltering.default',
    'app-api-user-service': 'AppApiUserService.default',
  }

  config.output.library = 'AppHeader'

  return config
}
