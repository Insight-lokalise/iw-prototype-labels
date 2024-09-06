export default function addGroupLayout(passedData, layoutState) {
    const layoutKeys = Object.keys(layoutState)
    const lastGroupInLayout = layoutState[layoutKeys[layoutKeys.length - 1]]
    return {
        ...passedData,
        layout: {
            childLayouts: [{
                i: passedData.inputId,
                h: 1,
                w: 12,
                x: 0,
                y: 0
            }],
            layout: {
                i: passedData.groupId,
                h: 1,
                w: 3,
                x: 0,
                y: lastGroupInLayout.layout.y + 1
            }
        }
    }
}