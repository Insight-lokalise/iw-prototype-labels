import PropTypes from 'prop-types'
import React from 'react'

/**
 * This is a hard coded version of the stepper component. As you can see it doesn't have the flexibility
 * that the javascript implementation does in
 * @param {[type]} props [description]
 */
export function IWStepper(props) {
    /**
     * Because props.children can have falsy elements and because we use the
     * index of the displayed elements as the step number to display, we must
     * determine the active/disabled status of elements before filtering falsy
     * children and then assign the index to display after filtering.
     */
    const children = React.Children
        .map(props.children, (child, idx) => child && React.cloneElement(child, {
            isActive: props.activeIndex === idx,
            isDisabled: props.activeIndex < idx,
        }))
        .filter(child => !!child)
        .map((child, idx) => React.cloneElement(child, {
            ownIndex: idx,
        }))

    return (
        <div id="Stepper-Cart" className="iw-stepper iw-stepper__content">
            {children}
        </div>
    )
}

IWStepper.propTypes = {
    activeIndex: PropTypes.number,
}
