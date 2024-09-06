import { dissoc } from '@lib'
import { INITIAL_BUILDER_STATE, INITIAL_STYLE_STATE } from './constants'
import {
    ADD_GROUP,
    ADD_INPUT,
    ADD_SET,
    INIT_BUILDER,
    SELECT_GROUP,
    REMOVE_GROUP,
    REMOVE_INPUT,
    REMOVE_SET,
    UPDATE_FIELDS,
    UPDATE_GROUP,
    UPDATE_LAYOUTS,
    UPDATE_STYLES,
} from './types'


export default function builderReducer(state = INITIAL_BUILDER_STATE, { payload, type }) {
    switch (type) {
        case ADD_GROUP: {
            const { group, groupId, input, inputId } = payload
            const modifiedState = {
                ...state,
                groupIds: state.groupIds.concat(groupId),
                groups: { ...state.groups, [groupId]: group },
                inputs: { ...state.inputs, [inputId]: input },
                styles: {
                    ...state.styles,
                    [groupId]: INITIAL_STYLE_STATE,
                    [inputId]: INITIAL_STYLE_STATE
                }
            }
            if (payload.layout) {
                return { 
                    ...modifiedState,
                    layouts: { ...modifiedState.layouts, [groupId]: payload.layout },
                    trackedLayouts: [...modifiedState.trackedLayouts, groupId]
                }
            }
            return modifiedState
        }
        case ADD_INPUT: {
            const { groupId, input, inputId } = payload
            const modifiedState = {
                ...state,
                groups: { ...state.groups, [groupId]: {
                    ...state.groups[groupId],
                    inputIds: state.groups[groupId].inputIds.concat(inputId)
                }},
                inputs: { ...state.inputs, [inputId]: input },
                selectedGroup: {
                    ...state.selectedGroup,
                    inputIds: state.selectedGroup.inputIds.concat(inputId)
                },
                styles: { ...state.styles, [inputId]: INITIAL_STYLE_STATE }
            }
            if (payload.layout) {
                return {
                    ...modifiedState,
                    layouts: { ...modifiedState.layouts, [groupId]: payload.layout },
                    trackedLayouts: [...modifiedState.trackedLayouts, groupId]
                }
            }
            return modifiedState
        }
        case ADD_SET: {
            const { inputId } = payload
            return {
                ...state,
                inputs: { ...state.inputs, [inputId]: {
                    ...state.inputs[inputId],
                    sets: state.inputs[inputId].sets.concat(payload)
                }}
            }
        }
        case INIT_BUILDER: {
            return { 
                ...INITIAL_BUILDER_STATE,
                ...payload, 
                selectedGroup: null
            }
        }
        case SELECT_GROUP: {
            const { id, inputs } = payload
            return {
                ...state,
                inputs: { ...state.inputs, ...inputs },
                selectedGroup: state.groups[id]
            }
        }
        case REMOVE_GROUP: {
            const { inputIds } = state.groups[payload]
            const newInputs = Object.keys(state.inputs).reduce((acc, key) => {
                if (inputIds.includes(key)) {
                    return acc
                }
                acc[key] = state.inputs[key]
                return acc
            }, {})
            const updatedTrackedLayouts = state.trackedLayouts.filter(item => item !== payload);
            return {
                ...state,
                groupIds: state.groupIds.filter(id => id !== payload),
                groups: dissoc(payload, state.groups),
                inputs: newInputs,
                layouts: dissoc(payload, state.layouts),
                trackedLayouts: updatedTrackedLayouts,
                selectedGroup: state.selectedGroup.id === payload ? null : state.selectedGroup
            }
        }
        case REMOVE_INPUT: {
            const [groupId] = payload.split('-')
            return {
                ...state,
                groups: { ...state.groups, [groupId]: {
                    ...state.groups[groupId],
                    inputIds: state.groups[groupId].inputIds.filter(id => id !== payload)
                }},
                inputs: dissoc(payload, state.inputs),
                selectedGroup: { ...state.selectedGroup, inputIds: state.selectedGroup.inputIds.filter(id => id !== payload)}
            }
        }
        case REMOVE_SET: {
            const { inputId, setId } = payload
            const selectedInput = state.inputs[inputId]
            return {
                ...state,
                inputs: {
                    ...state.inputs,
                    [inputId]: {
                        ...selectedInput,
                        sets: selectedInput.sets.filter(({ id }) => id !== setId)
                    }
                }
            }
        }
        case UPDATE_FIELDS: {
            const { inputErrors, inputs } = payload
            return {
                ...state,
                inputErrors,
                inputs: { ...state.inputs, ...inputs }
            }
        }
        case UPDATE_GROUP: {
            const { id, name, value } = payload
            return {
                ...state,
                groups: { ...state.groups, [id]: {
                    ...state.groups[id],
                    [name]: value
                }},
                selectedGroup: { ...state.selectedGroup, [name]: value }
            }
        }
        case UPDATE_LAYOUTS: {
            return {
                ...state,
                layouts: { ...payload }
            }
        }
        case UPDATE_STYLES: {
            const { id, name, value } = payload
            return { ...state, styles: {
                ...state.styles,
                [id]: { ...state.styles[id], [name]: value }
            }}
        }

        default: {
            return state
        }
    }
}