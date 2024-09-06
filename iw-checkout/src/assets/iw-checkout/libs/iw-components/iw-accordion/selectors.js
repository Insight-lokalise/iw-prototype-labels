import get from 'lodash-es/get'

export function selector_activeIndex(state, accordionName) {
    return get(state, ['accordions', accordionName, 'activeIndex'], null)
}

export function selector_savedIndexes(state, accordionName) {
    return get(state, ['accordions', accordionName, 'savedIndexes'], [])
}
