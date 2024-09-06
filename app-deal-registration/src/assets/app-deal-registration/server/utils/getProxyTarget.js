module.exports = function getProxyTarget(target = 'local') {
	if(process.env.PROXY_TARGET) {
		return process.env.PROXY_TARGET
	}
	switch (target) {
		case 'prod': {
			return 'https://dealregdb-services.insight.com'
		}
		case 'emeaprod': {
			return 'https://emea-dealregdb-services.insight.com'
		}
		case 'uat': {
			return 'https://uat1-dealregdb-services.insight.com'
		}
		case 'qax': {
			return 'https://qax-dealregdb-services.insight.com'
		}
    case 'qae': {
      return 'https://qae-dealregdb-services.insight.com'
    }
		case 'dev':
		case 'local':
		default: {
			return 'https://dev-dealregdb-services.insight.com'
		}
	}
}
