import errorMiddleware from 'react-dev-utils/errorOverlayMiddleware'
import paths from '../../paths'

export default () => ({
	contentBase: paths.src,
	hot: true,
	host: '0.0.0.0',
	index: 'index.html',
	inline: true,
	disableHostCheck: true,
	historyApiFallback: true,
	proxy: {
		'/dealreg': 'localhost:8082',
		'/static': 'http://localhost:8082'
	}
})
