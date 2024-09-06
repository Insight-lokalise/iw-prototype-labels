import { useMemo } from 'react'
import { addSet, removeGroup, handleGroupAdd, handleInputAdd, removeInput, removeSet, selectGroup, updateFieldState, updateGroup, updateLayouts, updateStyles } from '@state/builder'
import { generateGroupData, generateInputData, generateSetData } from '../helpers'

// Would be really cool if I could use this to pass a "getState" somehow
export default function useDispatcher({ dispatch, events, fields, isTrackingLayouts }) {

    const dispatcher = useMemo(() => ({
        addGroup: isUniversal => {
            dispatch(handleGroupAdd(generateGroupData(isUniversal), isTrackingLayouts))
            events.emit('builder:add-group')
        },
        addInput: groupId => {
            dispatch(handleInputAdd(generateInputData(groupId), isTrackingLayouts))
            events.emit('builder:add-input')
        },
        addSet: inputId => {
            dispatch(addSet(generateSetData(inputId)))
        },
        removeGroup: groupId => {
            dispatch(removeGroup(groupId))
        },
        removeInput: inputId => {
            dispatch(removeInput(inputId))
        },
        removeSet: payload => {
            dispatch(removeSet(payload))
        },
        selectGroup: id => {
            // We also need to make a call to get all of the data from the current field. Validate it and udpate it before proceeding
            // to the next step.
            const inputs = fields.getFieldValues()
            dispatch(selectGroup({ id, inputs }))
        },
        updateFieldState: payload => {
            dispatch(updateFieldState(payload, isTrackingLayouts))
        },
        updateGroup: payload => {
            dispatch(updateGroup(payload))
        },
        updateLayouts: payload => {
            dispatch(updateLayouts(payload))
        },
        updateStyles: payload => {
            dispatch(updateStyles(payload))
        }
    }), [isTrackingLayouts])

    return dispatcher
}