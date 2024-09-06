import React from 'react'
import PropTypes from 'prop-types'

import useDragState from './useDragState'
import { generateClasses, preventDefault, generateStyles, validateBackgroundProps } from './helpers'

export default function Switch({
    activeColor,
    checked,
    className,
    disabled,
    handleChange,
    handleDiameter,
    height = 40,
    id,
    inactiveColor,
    label = '',
    modifyBackground = false,
    name,
    width = 40,
    ...rest
}) {
    const { currentDiameter, currentPosition, dragState: { isDragging, showOutline }, handlers, positions } = useDragState({
        checked,
        disabled,
        handleChange,
        handleDiameter,
        height,
        id,
        name,
        width
    })

    const classes = generateClasses({ checked, className, disabled, isDragging, showOutline })
    const styles = generateStyles({
        activeColor,
        currentPosition,
        handleDiameter: currentDiameter,
        height,
        inactiveColor,
        modifyBackground,
        positions,
        width
    })

    const labelElement = label && (
        <label className={classes.label} htmlFor={id}>{label}</label>
    )

    return (
        <div className={classes.base} style={styles.base}>
            <div
                className={classes.background}
                onMouseDown={preventDefault}
                style={styles.background}
                {...handlers.background}
            />
            <div
                className={classes.handle}
                onClick={preventDefault}
                style={styles.handle}
                {...handlers.handle}
            />
            <input
                className="c-switch__input"
                disabled={disabled}
                id={id}
                name={name}
                type="checkbox"
                style={input}
                {...rest}
                {...handlers.input}
            />
            {labelElement}
        </div>
    )
}

Switch.propTypes = {
    activeColor: validateBackgroundProps, 
    checked: PropTypes.bool.isRequired,
    className: PropTypes.string,
    disabled: PropTypes.bool,
    handleChange: PropTypes.func.isRequired,
    handleDiameter: PropTypes.number,
    height: PropTypes.number,
    id: PropTypes.string.isRequired,
    inactiveColor: validateBackgroundProps,
    label: PropTypes.node,
    modifyBackground: PropTypes.bool,
    name: PropTypes.string.isRequired,
    width: PropTypes.number.isRequired
}