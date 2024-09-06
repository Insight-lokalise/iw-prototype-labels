import React from 'react'
import PropTypes from 'prop-types'
import { Deal } from '@components'
import { noop } from '@lib'

export default function Preview({ purpose }) {
    const { form } = purpose.getPurpose()
    return (
        <div className="c-page c-preview">
            <Deal
                disableSubmit
                onInvalid={noop}
                onSuccess={noop}
                passedFields={form}
                passedValues={false}
            />
        </div>
    )
}

Preview.propTypes = {
    purpose: PropTypes.shape({})
}