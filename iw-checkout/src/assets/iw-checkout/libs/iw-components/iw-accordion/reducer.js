import * as constants from './constants'

export function accordions(state = {}, { type, payload }) {
    // console.log('reducing sectionGroup:', state, { type, payload })
    switch (type) {
        case constants.CREATE_SECTION_GROUP: {
            return {
                ...state,
                [payload.name]: {
                    activeIndex: 0,
                    savedIndexes: [],
                }
            }
        }
        case constants.SET_ACTIVE_SECTION: {
            return {
                ...state,
                [payload.name]: {
                    ...state[payload.name],
                    activeIndex: payload.sectionIndex,
                }
            }
        }
        case constants.SAVE_SECTION: {
            return {
                ...state,
                [payload.name]: {
                    ...state[payload.name],
                    savedIndexes: state[payload.name].savedIndexes.concat([payload.sectionIndex]),
                }
            }
        }
        case constants.REMOVE_SECTION: {
            return {
                ...state,
                [payload.name]: undefined,
            }
        }
        default: return state
    }
}
