import { DEFAULT_INPUT_HEIGHTS } from '../constants'

export default function generateDefaultLayout(groups, inputs, offsetHeight = 0) {
    let lastGroupXCoordionate = 0
    let currentOffset = offsetHeight
    let maxHeightInGroup = 0

    const getGroupX = groupIndex => {
        if (lastGroupXCoordionate === 4) {
            return 8
        }
        if (lastGroupXCoordionate === 8) {
            return 0
        } 
        if (lastGroupXCoordionate === 0 && groupIndex !== 0) {
            return 4
        }
        return 0
    }

    const getGroupY = groupColumn => {
        if (groupColumn <= 3) {
            return 0
        } else if (groupColumn > 3 && groupColumn % 3 === 0) {
            maxHeightInGroup += 1
            currentOffset = maxHeightInGroup
            const y = currentOffset || maxHeightInGroup
            maxHeightInGroup = 0
            return y
        } else {
            return currentOffset
        }
    }

    const getGroupInputs = group => {
        console.log(group)
        let groupHeight = 2
        const groupInputs = group.inputIds.map(id => {
            const set = inputs[id].sets[0]
            if (!set.when) {
                groupHeight += DEFAULT_INPUT_HEIGHTS[set.type]
                // Make sure the layout takes the inputs id rather than
                // the id that is generated for the set
                return { ...set, id }
            }
        }).filter(Boolean)
        return { groupHeight, groupInputs }
    }

    const getChildLayouts = groupInputs => {
        let totalHeightOfChildren = 0
        return groupInputs.reduce((acc, input, inputIndex) => {
            const layout = {
                i: input.id,
                h: DEFAULT_INPUT_HEIGHTS[input.type],
                w: 12,
                x: 0,
                y: inputIndex === 0 ? 0 : totalHeightOfChildren + 1
            }
            totalHeightOfChildren += DEFAULT_INPUT_HEIGHTS[input.type]
            acc.push(layout)
            return acc
        }, [])
    }

    return groups.reduce((acc, group, groupIndex) => {
        console.log(group)
        const groupColumn = groupIndex + 1
        const groupX = getGroupX(groupIndex)
        lastGroupXCoordionate = groupX
        const { groupHeight, groupInputs } = getGroupInputs(group)

        if (groupHeight > maxHeightInGroup) {
            maxHeightInGroup = groupHeight
        }

        const groupY = getGroupY(groupColumn)
        const childLayouts = getChildLayouts(groupInputs)

        acc[group.id] = {
            childLayouts,
            layout: {
                i: group.id,
                h: groupHeight,
                w: 4,
                x: groupX,
                y: groupY
            }
        }
        return acc
    }, {})
}