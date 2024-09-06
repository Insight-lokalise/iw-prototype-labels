import cuid from 'cuid'

import { INITIAL_CONDITIONAL_STATE, INITIAL_VALIDATOR_STATE } from '../constants'

export function generateConditional() {
    return { ...INITIAL_CONDITIONAL_STATE, id: cuid() }
}

export function generateConditionalGroup() {
    return {
        conditionals: [generateConditional()],
        id: cuid()
    }
}

export function generateValidator() {
    return { ...INITIAL_VALIDATOR_STATE, id: cuid() }
}