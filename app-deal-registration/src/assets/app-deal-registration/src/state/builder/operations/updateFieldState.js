import { generateDefaultLayout, updateTrackedLayouts } from '@services/builder'
import { updateFields, updateLayouts } from '../actions'

export default function updateFieldState({ errorKeys = [], inputs, isEdit }, isTrackingLayout) {
    return (dispatch, getState) => {
        const builderState = getState().builder
        const { groupIds, groups, inputs: inputsFromState } = builderState
    
        const uniqueErrorKeys = new Set([...errorKeys])
        const currentInputNames = new Set([...Object.keys(inputsFromState).map(key => inputsFromState[key].name)])
        
        for (const inputKey of Object.keys(inputs)) {
            if (uniqueErrorKeys.has(inputKey)) {
                continue
            }
            if (currentInputNames.has(inputs[inputKey].name)) {
                uniqueErrorKeys.add(inputKey)
            }
        }

        const passedErrors = Array.from(uniqueErrorKeys)
        dispatch(updateFields({ inputErrors: passedErrors, inputs }))

        // Ensure we are getting the current version of the state
        const updatedBuilderState = getState().builder

        if (isEdit || isTrackingLayout) {
            return dispatch(updateLayouts(updateTrackedLayouts(updatedBuilderState)))
        }

        // Don't create any default layouts fields that are universal.
        // Groups don't change during this operation, so we don't needd to
        // use the new state here. 
        const formatted = groupIds.reduce((acc, id) => {
            const group  = groups[id]
            if (!group.isUniversal) {
                acc.push(group)
            }
            return acc
        }, [])

        return dispatch(updateLayouts(generateDefaultLayout(formatted, updatedBuilderState.inputs)))
    }
}