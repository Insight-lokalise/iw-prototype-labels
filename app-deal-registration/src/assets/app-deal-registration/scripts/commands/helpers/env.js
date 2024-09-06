const isCI = process.env.CI && (
	typeof process.env.CI !== 'string' ||
	process.env.CI.toLowerCase() !== 'false'
)

function getDomainFromTarget(target) {
	switch (target) {
		case 'dev':
			return 'https://dev-dealregdb.insight.com'
    case 'qax':
      return 'https://qax-dealregdb.insight.com'
    case 'qae':
      return 'https://qae-dealregdb.insight.com'
    case 'qa':
      return 'https://qa-dealregdb.insight.com'
		case 'uat':
			return 'https://uat1-dealregdb.insight.com'
		case 'prod':
			return 'https://dealregdb.insight.com'
    case 'emeaprod':
			return 'https://emea-dealregdb.insight.com'
		default:
			return 'localhost:8082'
	}
}

function getEnvConfig(target) {
	return {
		'CERTIFICATE_PATH': '/u/nodejs/certs/dealreg/cert-file.pem',
		'DEBUG': false,
		'DOMAIN': getDomainFromTarget(target),
		'ENABLE_CSP': false,
		'ENABLE_NONCE': false,
		'HOST': 'localhost',
		'IDP_CERT_PATH': '/u/nodejs/certs/dealreg/adfs.pem',
		'IDP_CERT_SIGN_PATH': '/u/nodejs/certs/dealreg/adfs-sign.pem',
		'PORT': 8082,
		'PRIVATE_KEY_PATH': '/u/nodejs/certs/dealreg/key-file.pem',
		'VERBOSE': false	
	}
}

module.exports = {
	isCI,
	getEnvConfig
}
