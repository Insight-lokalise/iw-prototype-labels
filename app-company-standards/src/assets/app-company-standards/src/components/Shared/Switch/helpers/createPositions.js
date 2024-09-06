export function createPositions({
    checked,
    handleDiameter,
    height,
    width
}) {
    const currentDiameter = handleDiameter || height - 2
    const checkedPosition = Math.max(
        width - height,
        width - (height + currentDiameter) / 2
    )
    const uncheckedPosition = Math.max(
        0,
        (height - currentDiameter) / 2
    )
    const currentPosition = checked ? checkedPosition : uncheckedPosition
    const positions = { checked: checkedPosition, unchecked: uncheckedPosition }
    return { currentPosition, positions }
}