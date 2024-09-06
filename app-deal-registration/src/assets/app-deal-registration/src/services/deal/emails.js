import { email as emailValidator } from '@services/form/validators'

const DEFAULT_EMAIL_STATE = {
	display: 'notificationEmails',
	label: 'Notification Email',
    name: 'notificationEmails-notificationEmails',
    type: 'Text',
    validators: [value => emailValidator()(value)]
}

export function addEmailItem(inputsCount) {
    return {
        ...DEFAULT_EMAIL_STATE,
        name: `${DEFAULT_EMAIL_STATE.name}[${inputsCount}]`
    }
}

export function createEmailsFromValues(values = []) {
    if (values.length > 0) {
        return values.map((value, index) => ({
            ...DEFAULT_EMAIL_STATE,
            name: `${DEFAULT_EMAIL_STATE.name}[${index}]`
        }))
    }
    return [{ ...DEFAULT_EMAIL_STATE, name: `${DEFAULT_EMAIL_STATE.name}[0]`}]
}

