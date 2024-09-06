import toPath from './toPath'

export default function getDeep(state, passedKey) {
    const path = toPath(passedKey)
    let current = state

    for (let i = 0; i < path.length; i++) {
        const key = path[i]
        // isNil helper
        if (
            current === undefined ||
            current === null ||
            typeof current !== 'object' ||
            (Array.isArray(current) && isNaN(key))
        ) {
            return undefined
        }

        current = current[key]
    }
    return current
}