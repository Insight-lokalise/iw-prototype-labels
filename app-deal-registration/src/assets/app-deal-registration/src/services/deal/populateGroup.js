import { uppercaseFirst } from 'lib';
import { NA_KEYS, EMEA_KEYS } from './constants';
import { FORM_FIELD_PREFIX_MAP } from 'constants';

const populateContactInfo = (value) => {
    const prefix = FORM_FIELD_PREFIX_MAP.contactPrefix;
    const [lastName, firstName, phone, email] = value.split(':')[1].split(',').map(item => item.trim());
    return {
        [`${prefix}Name`]: `${firstName}${lastName}` || '',
        [`${prefix}Phone`]: phone || '',
        [`${prefix}Email`]: email || ''
    };
}

const populateContactInfoFromObject = (value, groupDisplay) => {
    return Object.keys(value).reduce((acc, key) => {
        acc[`${groupDisplay}-${key}`] = value[key];
        return acc;
    }, {})
}

const populateOtherInfo = (value, groupDisplay, isEMEA) => {
    const splitValue = value.split(':')[1];
    const splitInfo = splitValue && splitValue.split(';');
    const OTHER_FIELD_KEYS = isEMEA ? EMEA_KEYS : NA_KEYS;
    return OTHER_FIELD_KEYS.reduce((acc, key, index) => {
        if (!splitInfo) return acc;
        acc[`${groupDisplay}-${groupDisplay}${key}`] = splitInfo[index];
        return acc;
    }, {})
}

const populateInfoFromObject = (value, groupDisplay) => {
    return Object.keys(value).reduce((acc, key) => {
        const formattedKey = uppercaseFirst(key);
        acc[`${groupDisplay}-${groupDisplay}${formattedKey}`] = value[key];
        return acc;
    }, {});
};

export default function populateGroup(value, groupDisplay, isEMEA) {
    if (typeof value === 'object') {
        return groupDisplay === 'contactInfo'
        ? populateContactInfoFromObject(value, groupDisplay)
        : populateInfoFromObject(value, groupDisplay);
    }
    return groupDisplay === 'contactInfo'
        ? populateContactInfo(value)
        : populateOtherInfo(value, groupDisplay, isEMEA);
}
