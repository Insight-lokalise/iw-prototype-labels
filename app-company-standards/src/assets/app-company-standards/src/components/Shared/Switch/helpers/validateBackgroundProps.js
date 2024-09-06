export default function validateBackgroundProps(props, propName, componentName) {
    const prop = props[propName]
    if (propName === 'activeColor' || propName === 'inactiveColor') {
        if (props['modifyBackground'] && !prop) {
            return new Error(`When passing modifyBackground to ${componentName} you need to pass ${propName} as well`)
        }

        if (
            (prop && typeof prop !== 'string') ||
            props[0] !== '#' ||
            (prop.length !== 4 && prop.length !== 7)
        ) {
            return new Error(`Invalid prop ${propName} supplied to ${componentName}. ${propName} should be a 3 or 6 digit hex-color`)
        }
    }
    return null
}