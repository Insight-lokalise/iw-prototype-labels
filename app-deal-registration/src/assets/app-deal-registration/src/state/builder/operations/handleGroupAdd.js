import { addGroupLayout } from "@services/builder";
import { addGroup } from "../actions";

export default function handleGroupAdd(passedData, isTrackingLayout) {
    return (dispatch, getState) => {
        const data = isTrackingLayout
            ? addGroupLayout(passedData, getState().builder.layouts)
            : passedData
        dispatch(addGroup(data))
    }
}