function createBackgroundColor({ activeColor, currentPosition, inactiveColor, modifyBackground, positions }) {
    const relativePosition = (currentPosition - positions.unchecked) / (positions.checked - positions.unchecked)
    if (relativePosition === 0) {
        return inactiveColor
    }
    if (relativePosition === 1) {
        return activeColor
    }

    if (!modifyBackground) {
        return null
    }

    let newColor = '#'
    for (let i = 1; i < 6; i+= 2) {
        const inactive = parseInt(inactiveColor.substr(i, 2), 16)
        const active = parseInt(activeColor.substr(i, 2), 16)
        const weightedValue = Math.round(
            (1 - relativePosition) * inactive + relativePosition * active
        )
        let intermediateState = weightedValue.toString(16)
        if (intermediateState.length === 1) {
            intermediateState = `0${intermediateState}`
        }
        newColor += intermediateState
    }
    return newColor
}

function convertShortHandColor(color) {
    if (color.length === 7) {
        return color
    }
    let sixDigitColor = '#'
    for (let i = 1; i < 4; i++) {
        sixDigitColor += color[i] + color[i]
    }
    return sixDigitColor
}

function getBackgroundColor({ activeColor, currentPosition, inactiveColor, positions }) {
    const inactive = convertShortHandColor(inactiveColor)
    const active = convertShortHandColor(activeColor)
    return createBackgroundColor({
        activeColor: active,
        currentPosition,
        inactiveColor: inactive,
        positions
    })
}

export default function generateStyles({
    activeColor,
    currentPosition,
    handleDiameter,
    height,
    inactiveColor,
    modifyBackground,
    positions,
    width
}) {
    // pass modifyBackground true no matter what because the handle needs it, but only apply it to the background
    // if modifyBackground is truly enabled
    const backgroundColor = getBackgroundColor({ activeColor, currentPosition, inactiveColor, modifyBackground: true, positions })
    const getBackgroundStyles = () => {
        const styles = { 
            height,
            width,
            margin: Math.max(0, (handleDiameter - height) / 2),
            borderRadius: height / 2
        }
        if (modifyBackground) {
            styles.background = backgroundColor
        }
        return styles
    }

    return {
        base: {
            borderRadius: height / 2
        },
        background: getBackgroundStyles(),
        handle: {
            height: handleDiameter,
            width: handleDiameter,
            top: Math.max(0, (height - handleDiameter) / 2),
            background: backgroundColor,
            transform: `translateX(${currentPosition}px)`
        }
    }
}