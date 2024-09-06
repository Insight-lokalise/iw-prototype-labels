import React from 'react'
import PropTypes from 'prop-types'
import { updateDeal } from '@api'
import { Deal } from '@components'
import { createSubmissionArgs } from '@services/forms'

export default function Edit({ display, history, purpose }) {
    const { deal, form } = purpose.getPurpose()

    const onInvalid = () => {
        display.addToast('edit-deal-failure')
    }

    const onSuccess = async values => {
        const args = createSubmissionArgs(deal, values)
        const response = await updateDeal(args)
        if (response) {
            display.addToast('edit-deal-success')
            history.push('/admin')
        }
    }

    return (
        <div className="c-page c-edit">
            <Deal
                isEdit={true}
                onInvalid={onInvalid}
                onSuccess={onSuccess}
                passedFields={form}
                passedValues={deal}
            />
        </div>
    )
}

Edit.propTypes = {
    display: PropTypes.shape({}),
    history: PropTypes.shape({}),
    purpose: PropTypes.shape({})
}