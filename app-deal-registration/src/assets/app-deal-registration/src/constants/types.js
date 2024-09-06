import { func, shape, string, number, bool }from 'prop-types'

export const DISPLAY_SHAPE = shape({
    addModal: func.isRequired,
    addToast: func.isRequired,
    dismissModal: func.isRequired,
    dismissToast: func.isRequired,
    
})
export const LOCATION_SHAPE = shape({
    hash: string.isRequired,
    pathname: string.isRequired,
    search: string.isRequired,
    state: shape({})
})

export const PURPOSE_SHAPE = shape({
    getPurpose: func.isRequired,
    updatePurpose: func.isRequired,
    updatePurposeKey: func.isRequired
})

