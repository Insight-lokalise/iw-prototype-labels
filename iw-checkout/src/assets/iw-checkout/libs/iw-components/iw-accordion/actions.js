                         import * as constants from './constants'

export function createAccordion(name) {
    return {
        type: constants.CREATE_SECTION_GROUP,
        payload: { name },
    }
}

export function setActiveIndex(name, sectionIndex) {
    if (typeof sectionIndex !== 'number') throw Error('Accordion activeIndex must be a number. (the index of the accordion item)')
    return {
        type: constants.SET_ACTIVE_SECTION,
        payload: { name, sectionIndex },
    }
}

export function saveIndex(name, sectionIndex) {
    return {
        type: constants.SAVE_SECTION,
        payload: { name, sectionIndex },
    }
}
