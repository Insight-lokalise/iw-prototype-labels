import toPath from './toPath'

const setInRecursor = (
    current,
    index,
    path,
    value,
    destroyArrays
) => {
    if (index >= path.length) {
        // end of recursion
        return value
    }

    const key = path[index]
    // Determine key type
    if (isNaN(key)) {
        if (current === undefined || current === null) {
            const result = setInRecursor(
                undefined,
                index + 1,
                path,
                value,
                destroyArrays
            )

            // delete or create an object
            return result === undefined ? undefined : { [key]: result }
        }

        if (Array.isArray(current)) {
            throw new Error(`Cannot set a non-numeric property on an array`)
        }

        // current exists, so make a copy of all its values and add/update teh new one
        const result = setInRecursor(
            current[key],
            index + 1,
            path,
            value,
            destroyArrays
        )

        if (result === undefined) {
            const numKeys = Object.keys(current).length
            if (current[key] === undefined && numKeys === 0) {
                return undefined
            }

            if (current[key] !== undefined && numKeys <= 1) {
                if (!isNaN(path[index - 1]) && !destroyArrays) {
                    return {}
                }
                return undefined
            }

            const { [key]: _removed, ...final } = current
            return final
        }

        return { ...current, [key]: result }
    }

    // Array set
    const numericKey = Number(key)
    if (current === undefined || current === null) {
        const result = setInRecursor(
            undefined,
            index + 1,
            path,
            value,
            destroyArrays
        )

        if (result === undefined) {
            return undefined
        }

        const array = []
        array[numericKey] = result
        return array
    }

    if (!Array.isArray(current)) {
        throw new Error('Cannot set a numeric property on an object')
    }

    const existingValue = current[numericKey]
    const result = setInRecursor(
        existingValue,
        index + 1,
        path,
        value,
        destroyArrays
    )

    const array = [...current]
    if (destroyArrays && result === undefined) {
        array.splice(numericKey, 1)
        if (array.length === 0) {
            return undefined
        }
    } else {
        array[numericKey] = result
    }

    return array
}

export default function setDeep(
    state,
    key,
    value,
    destroyArrays = false
) {
    return setInRecursor(
        state,
        0,
        toPath(key),
        value,
        destroyArrays
    )
}