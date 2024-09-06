import { DEFAULT_INPUT_HEIGHTS } from '../constants'

/*
    When the builder already has a layout, either from being in edit mode
    or from having proceeded to step 2 before we need to add new items to the layout
    as groups and inputs get added in step 1. 
    
    Because the height of the group depends on the height of it's child inputs and each of those child inputs heights depends on data that is provided
    after their creation we need to track which groups have been modified and then update
    their layouts before the user proceeds to a different step in the builder 
*/

export default function updateTrackedLayouts(builderState) {
    const { trackedLayouts } = builderState
    const baseLayouts = trackedLayouts.map(id => builderState.layouts[id])
    const updatedLayouts = baseLayouts.reduce((acc, { childLayouts, layout }) => {
        const { newChildLayouts, totalGroupHeight } = childLayouts.reduce((coll, childLayout) => {
            const selectedInput = builderState.inputs[childLayout.i]
            const inputHeight = DEFAULT_INPUT_HEIGHTS[selectedInput.sets[0].type]
            return {
                ...coll,
                newChildLayouts: [...coll.newChildLayouts, { ...childLayout, h: inputHeight }],
                totalGroupHeight: coll.totalGroupHeight + inputHeight
            }
        }, { newChildLayouts: [], totalGroupHeight: 2 })

        if (!acc[layout.i]) acc[layout.i] = {}
        return {
            ...acc,
            [layout.i]: {
                childLayouts: newChildLayouts,
                layout: { ...layout, h: totalGroupHeight }
            }
        }
    }, {})
    return { ...builderState.layouts, ...updatedLayouts }
}