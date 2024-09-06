import { reducer as formReducer } from 'redux-form'

import { CLEAR_FORM_SECTION } from '../constants'

// TODO fix this functionality / make dynamic for dif form names

// export default formReducer.plugin({
//     LineLevelForm: (state, action) => {   // <----- 'LineLevelForm' is name of form given to reduxForm()
//         switch (action.type) {
//             case CLEAR_FORM_SECTION: {
//                 let newState = { ...state }

//                 newState.values[action.payload.parentFormName][action.payload.sectionName] = undefined
//                 newState.fields[action.payload.parentFormName][action.payload.sectionName] = undefined

//                 return newState
//             }
//             default:
//                 return state
//         }
//     },
// })

// export default formReducer.plugin(
//     (state, action) => {
//         console.log('action.type', action.type)
//         console.log('action.payload', action.payload)
//         switch (action.type) {
//             case CLEAR_FORM_SECTION: {
//                 const newState = { ...state }
//                 console.log('CLEAR_FORM_SECTION', newState)
//                 console.log('action.payload', action.payload)
//                 // newState[action.payload.parentFormName].values[action.payload.sectionName] = undefined
//                 // newState[action.payload.parentFormName].fields[action.payload.sectionName] = undefined
//                 return newState
//             }
//             default:
//                 return state
//         }
//     }
// )


export default formReducer.plugin((state, { meta, type, payload: { parentFormName, sectionName } }) => {
    switch (type) {
        case CLEAR_FORM_SECTION: {
            const newState = { ...state }
            newState[parentFormName].values[sectionName] = undefined
            return newState
        }
        default:
            return state
    }
})


// export default formReducer.plugin((state, action) => {
//     return {
//         [action.payload.parentFormName]: (state, action) => {
//             switch (action.type) {
//                 case CLEAR_FORM_SECTION: {
//                     const newState = { ...state }
//                     newState[action.payload.parentFormName].values = undefined
//                     return newState
//                 }
//                 default:
//                     return state
//             }
//         }
//     }
// })


// export default formReducer.plugin((state, { meta, type, payload: { parentFormName, sectionName } }) => {
//     switch (type) {
//         case CLEAR_FORM_SECTION: {
//             return {
//                 ...state,
//                 [parentFormName]: {
//                     ...state[parentFormName],
//                     values: undefined,
//                 }
//              }
//         }
//         default:
//             return state
//     }
// })
