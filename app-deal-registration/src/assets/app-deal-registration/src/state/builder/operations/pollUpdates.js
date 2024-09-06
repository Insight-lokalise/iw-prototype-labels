const getStateForStep = ({ activeStep, builder, data }) => {
    switch (activeStep) {
        case 1: return { ...builder, inputs: { ...builder.inputs, ...data.inputs }}
        case 2: return { ...builder, layouts: data }
        default: return builder
    }
}

export default function pollUpdates({ activeStep, data, formName }) {
    return (dispatch, getState) => {
        const { builder } = getState()
        const state = getStateForStep({ activeStep, builder, data })
        // Move to indexedDB
        window.localStorage.setItem(formName, JSON.stringify(state))
    }
}