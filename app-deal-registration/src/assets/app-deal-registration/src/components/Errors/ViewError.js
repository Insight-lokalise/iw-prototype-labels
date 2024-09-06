import React from 'react'
import PropTypes from 'prop-types'
import { Button } from '@insight/toolkit-react'

// A generic error component which will fill the space of any container it is placed in.
export default function ViewError({
    children,
    heading = 'We could all use a refresh',
    refresh,
    subheading = 'Refresh this page to try again'
}) {
    return (
        <div className="c-view-error">
            <h3 className="c-view-error__heading">{heading}</h3>
            <p className="c-view-error__subheading">{subheading}</p>
            {refresh && (
                <Button color="primary" onClick={() => window.location.reload(true)}>
                    Refresh the page
                </Button>
            )}
            {children}
        </div>
    )
}

ViewError.propTypes= {
    children: PropTypes.node,
    heading: PropTypes.node,
    refresh: PropTypes.bool,
    subheading: PropTypes.node
}