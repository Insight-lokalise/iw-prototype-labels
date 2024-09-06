import { parseConditionalValues } from '../helpers'

export default function transformSets(sets, values) {
    for (let i = 0; i < sets.length; i++) {
        const set = sets[i]
        const isConditionalSatisfied = parseConditionalValues(set, values)
        if (isConditionalSatisfied) {
            return set
        }
    }
    return 'no-matching-set'
}