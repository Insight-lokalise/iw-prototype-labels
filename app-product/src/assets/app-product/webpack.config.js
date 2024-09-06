module.exports = (config) => {
  
  config.externals = {
    'react': 'AppCore.default.React',
    'react-dom': 'AppCore.default.ReactDOM',
  }

  return config
}
