import get from "lodash-es/get";


export const selector_dep = state => get(state, ['DEP'], {})
export const selector_enrollmentInfo = state => selector_dep(state).enrollmentInfo