export const FONT_SIZES = [
    'tiny',
    'small',
    'medium',
    'large',
    'huge'
]

export const FONT_TYPES = ['allumi', 'klinic']
export const FONT_WEIGHTS = ['bold', 'italic', 'normal']

export const FONT_COLORS = [
    '#3e332d',
    '#ae0a46',
    '#af0e2e',
    '#a80b6d',
    '#9f177a',
    '#5f5753',
    '#95cf33',
    '#007996',
]

export const FONT_HEX_TO_NAME_MAP = {
    '#3e332d': 'text',
    '#ae0a46': 'red-fuchsia',
    '#af0e2e': 'red',
    '#a80b6d': 'fuchsia',
    '#9f177a': 'deep-pink',
    '#5f5753': 'gray',
    '#95cf33': 'blue',
    '#007996': 'turquoise'
}

export const FONT_NAME_TO_HEX_MAP = Object
    .keys(FONT_HEX_TO_NAME_MAP)
    .reduce((acc, key) => {
        acc[FONT_HEX_TO_NAME_MAP[key]] = key
        return acc
    }, {})
