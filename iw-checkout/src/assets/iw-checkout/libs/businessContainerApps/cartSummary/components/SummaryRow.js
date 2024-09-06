import React from 'react'
import PropTypes from 'prop-types'
import cn from 'classnames'

export default function SummaryRow(props) {
    return (
        <div className={cn('row is-collapse-child', props.className)}>
            <div className="columns cart-summary__label">
                {props.title}
            </div>
            <div className="columns shrink cart-summary__value">
                {props.priceElement}
            </div>
        </div>
    )
}

SummaryRow.propTypes = {
    title: PropTypes.oneOfType([PropTypes.string, PropTypes.element]).isRequired,
    priceElement: PropTypes.element.isRequired,
}
