import { parseConditionalValues } from '../helpers'

const createFieldConditionals = (groups, values) => {
    const result = groups.map(({ conditionals }) => conditionals.every(
        conditional => parseConditionalValues(conditional, values)
    ))
    return result.indexOf(true) !== -1
}

export default function transformFieldConditionals(groups, values) {
    return createFieldConditionals(groups, values)
}
