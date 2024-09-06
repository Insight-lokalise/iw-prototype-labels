import { addInputLayout } from '@services/builder'
import { addInput } from '../actions'

export default function handleInputAdd(passedData, isTrackingLayout) {
    return (dispatch, getState) => {
        const data = isTrackingLayout
            ? addInputLayout(passedData, getState().builder)
            : passedData
        dispatch(addInput(data))
    }
}