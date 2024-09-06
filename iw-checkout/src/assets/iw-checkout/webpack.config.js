module.exports = (config) => {
    const customConfig = {
        name: 'iw-checkout',
        target: 'web',
        entry: ['./app/app.js'],
        externals: {
            'react': 'AppCore.default.React',
            'react-dom': 'AppCore.default.ReactDOM',
            'app-api-user-service': 'AppApiUserService.default',
        },
    }

    return  Object.assign({},config,customConfig)
};
