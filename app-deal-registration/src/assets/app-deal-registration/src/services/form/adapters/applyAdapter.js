import { IS_DEV } from '@lib'
import custom from './custom/custom'
import universal from './universal/universal'

const adapterMap = { custom, universal }

export default function applyAdapter(field, context, adapterType) {
    if (adapterMap[adapterType]) {
        return adapterMap[adapterType](field, context)
    }

    if (IS_DEV) {
        throw new Error(`
            FormService: applyAdapter() - Received an invalid adapter type.
            Expected one of the following ${Object.keys(adapterMap)}, but received ${adapterType}
        `)
    }
}