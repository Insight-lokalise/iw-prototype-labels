export default function addInputLayout(passedData, builderState) {
    const { groupId, inputId } = passedData
    const layoutData = builderState.layouts[groupId]
    const { layout, childLayouts } = layoutData || {}
    const lastChildLayout = childLayouts && childLayouts[childLayouts.length - 1]
    return {
        ...passedData,
        ...(layout && childLayouts && {
            layout: {
                layout,
                childLayouts: [...childLayouts, {
                    h: 1,
                    i: inputId,
                    w: 12,
                    x: 0,
                    y: lastChildLayout.y + 1
                }]
            }
        })
        
    }
}
