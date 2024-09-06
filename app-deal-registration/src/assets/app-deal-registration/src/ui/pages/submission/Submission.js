import React, { useEffect, useMemo, useRef, useState } from 'react'
import PropTypes from 'prop-types'
import { Loading } from '@insight/toolkit-react'
import { getActiveForm, getActiveFormById, updateDeal } from '@api'
import { Deal } from '@components'
import { sleep } from '@lib'
import { createSubmissionArgs, formatSubmissionsUrl } from '@services/form'

const REDIRECT_LINK = 'https://inside.insight.com/northamerica/depts_and_resources/departments/profitability/deal_registration_bidprogram'

export default function Submission({ display, location, purpose }) {
    const purposeState = purpose.getPurpose()
    const [form, setForm] = useState(purposeState.form)
    const [isLoading, setLoading] = useState(true)
    const [submitMessageType, setSubmitMessageType] = useState('')
    const entryContext = useRef(formatSubmissionsUrl(location, purposeState))

    useEffect(() => {
        const fetcher = async () => {
            if (!form) {
                const { entrypoint, path } = entryContext.current
                const api = (entrypoint === 'clientlink' || entrypoint === 'dealreg') ? getActiveForm : getActiveFormById
                const response = await api(path)
                
                if (response) {
                    setForm(prev => response)
                } else {
                    display.addToast('no-deals-found')
                }
            }

            setLoading(false)
        }

        fetcher()
    }, [])

    const onInvalid = () => display.addToast('submit-deal-failure')
    const onSuccess = async values => {
        const args = createSubmissionArgs(form, values, entryContext.current)
        const response = await updateDeal(args)
        if (response) {
            display.addToast('submit-deal-success')
        }

        if (entryContext.current.entrypoint === 'insideinsight') {
            await sleep(2000)
            window.location = REDIRECT_LINK
        } else {
            setSubmitMessageType(entryContext.current.entrypoint)
        }
    }

    const content = useMemo(() => {
        if (isLoading) {
            return <Loading size="small" />
        }
        return (
            <Deal
                entryContext={entryContext}
                onInvalid={onInvalid}
                onSucess={onSuccess}
                passedFields={form}
                passedValues={false}
            />
        )
    }, [isLoading])

    return <div className="c-page c-submission">{content}</div>
}

Submission.propTypes = {
    display: PropTypes.shape({}),
    location: PropTypes.shape({}),
    purpose: PropTypes.shape({})
}