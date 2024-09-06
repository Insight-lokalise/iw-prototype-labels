import cn from 'classnames'
import React from 'react'
/**
* A wrapper for an <button> tag.
*
*  @param {Object} props Any normal property you would apply to an <button>.
*/
export function IWButton({ className, ...rest }) {
    return (
        <button className={cn('button', className) } {...rest}>
            { rest.children }
        </button>
    );
}
