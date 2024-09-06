import { isRequired } from '@lib'

const PURPOSE_TYPES = ['submission', 'forms', 'templates']

export const PURPOSE_OPTIONS = PURPOSE_TYPES.map(type => ({
    id: type,
    label: type === 'submission' ? 'Deal submission' : `Create/edit ${type}`,
    value: type
}))

export const BASE_VALIDATORS = [isRequired]

export const SERVICE_DESK_LINK = 'https://servicedesk.insight.com'