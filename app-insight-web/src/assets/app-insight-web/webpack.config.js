const path = require('path');

/*
* this will take a loader name and returns loader config from webpack
* */
const makeLoaderFinder = loaderName => rule => {
  const loaderRegex = new RegExp(`[/\\\\]${loaderName}[/\\\\]`)
  const foundInLoaderString = typeof rule.loader === 'string' && loaderRegex.test(rule.loader)
  const inUseArray = Array.isArray(rule.use) && rule.use.find(
    loader => (
      typeof loader.loader === 'string' &&
      loader.loader.match(loaderRegex) ||
      (typeof loader === 'string' && loader.match(loaderRegex))
    )
  )
  return inUseArray || foundInLoaderString
}

/*
* Assure query-string get transpiled to ES5, this will extend config from babel-loader in buildkit
* */

module.exports = function modifyConfig(passedConfig, { dev }) {
  const babelLoaderFinder = makeLoaderFinder('babel-loader')
  const babelLoader = passedConfig.module.rules.find(babelLoaderFinder)
  const modifiedBabelLoader = { ...babelLoader, exclude: [
    ]}
  passedConfig.module.rules = passedConfig.module.rules.filter(rule => !babelLoaderFinder(rule))
  passedConfig.module.rules.unshift(modifiedBabelLoader)

  passedConfig.externals = {
    'react': 'AppCore.default.React',
    'react-dom': 'AppCore.default.ReactDOM',
    'app-api-user-service': 'AppApiUserService.default',
  }

  return passedConfig
}
