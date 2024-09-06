import React from 'react'
import PropTypes from 'prop-types'
import cn from 'classnames'

/**
 * component that can be used to show or hide with css based on a boolean
 * note: children will still render so don't use to avoid rendering
 *  this component should only be used when you want a component to render but not be visible
 */
export function IWShowHide(props) {
    return (
               <div className={'cart__table-block--item '+ cn({ 'hide': !props.showIf})} >
            {props.children}
        </div>
    )
}


IWShowHide.propTypes = {
    showIf: PropTypes.bool.isRequired,
}
