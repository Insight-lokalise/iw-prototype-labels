import React from 'react'
import PropTypes from 'prop-types'
import cn from 'classnames'
import { Link } from 'react-router-dom'

export function IWStep(props) {
    const { ownIndex, isActive, isDisabled, to = '' } = props
    const stepNum = ownIndex + 1

    return (
        <div className={cn('iw-step', { 'iw-step--disabled': isDisabled, 'iw-step--current': isActive })}>
            <Link className="iw-step__link" to={to} onClick={e => isDisabled ? e.preventDefault() : props.onClick ? props.onClick(e) : true}>
                <div className="iw-step__indicator">
                    <span className="iw-step__info">
                        {stepNum}
                    </span>
                </div>
                <div className="iw-step__label hide-for-small-only">
                    {props.children}
                </div>
            </Link>
        </div>
    )
}

IWStep.propTypes = {
    to: PropTypes.string.isRequired,
    onClick: PropTypes.func,
    ownIndex: PropTypes.number, // injected by IWStepper
    isActive: PropTypes.bool, // injected by IWStepper
    isDisabled: PropTypes.bool, // injected by IWStepper
}
