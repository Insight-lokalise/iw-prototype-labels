import { uppercaseFirst } from 'lib';
import { FORM_FIELD_PREFIX_MAP } from 'constants';

const ACCOUNT_KEYS = ['name', 'street', 'city', 'state', 'zip', 'country']

export default function populateAccountValues(accountAddress) {
	return ACCOUNT_KEYS.reduce((acc, key) => {
		const prefix = FORM_FIELD_PREFIX_MAP.accountPrefix;
		const name = key !== 'street' ? uppercaseFirst(key) : 'Address'
		return { ...acc, [`${prefix}${name}`]: accountAddress[key] }
	}, {})
}

