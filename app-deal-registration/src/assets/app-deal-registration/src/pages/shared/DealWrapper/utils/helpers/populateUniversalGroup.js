import createErrorBuffer from './createErrorBuffer';
import { FORM_FIELD_PREFIX_MAP } from 'constants';

const OTHER_FIELD_KEYS = ['Name', 'Address', 'City', 'State', 'Zip'];

const populateContactInfo = (value, hasContact) => {
	const prefix = FORM_FIELD_PREFIX_MAP.contactPrefix;
	if (hasContact) {
		return {
			[`${prefix}Email`]: value.email || '',
			[`${prefix}Phone`]: value.phone || ''
		}
	}

    const [lastName, firstName, phone, email] = value.split(':')[1].split(',').map(item => item.trim());
    return {
        [`${prefix}Name`]: `${firstName}${lastName}` || '',
        [`${prefix}Phone`]: phone || '',
        [`${prefix}Email`]: email || ''
    };
}

const populateOtherInfo = (value, groupDisplay) => {
	const splitInfo = value.split(':')[1].split(';')
	return OTHER_FIELD_KEYS.reduce((acc, key, idx) => {
		const path = `${groupDisplay}-${groupDisplay}${key}`
		return { ...acc, [path]: splitInfo[idx] }
	}, {})
}

export default function populateUniversalGroup(value, groupDisplay, hasContact = false) {
	const populatedValues = groupDisplay === 'contactInfo'
		? populateContactInfo(value, hasContact)
		: populateOtherInfo(value, groupDisplay)
	const errorBuffer = createErrorBuffer(populatedValues)
	return { errorBuffer, populatedValues }
}
