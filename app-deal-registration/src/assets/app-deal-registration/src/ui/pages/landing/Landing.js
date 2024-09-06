import React, { useRef, useState } from 'react'
import PropTypes from 'prop-types'
import { Button } from '@insight/toolkit-react'

import { Form } from '@components'
import { Basic, Business } from './sections'


export default function Landing({ history, purpose }) {
    const [country, setCountry] = useState('')
    const [showAll, setShowAll] = useState(false)
    const [objective, setObjective] = useState('')

    const handleChange = ({ target: { name, value }}) => {
        const setter = name === 'purpose' ? setObjective : setCountry
        setter(prev => value)
        if ((country && name === 'purpose' && value) || (purpose && name !== 'purpose' && value)) {
            setShowAll(prev => true)
        }
    }

    const handleSubmit = async (values, isValid) => {
        if (!isValid) return
        const path = values.purpose === 'submission' ? '/submission' : '/list'
        const state = values.purpose === 'templates' ? { templates: true } : { fromLanding: true }
        purpose.updatePurpose(values)
        history.push(path, state)
    }

    return (
        <div className="c-landing">
            <Form handleSubmit={handleSubmit}>
                {({ onSubmit }) => (
                    <div className="c-landing__content">
                        <Basic handleChange={handleChange} />
                        {showAll && <Business country={country} />}
                        <Button color="primary" onClick={onSubmit}>Submit</Button>
                    </div>
                )}
            </Form>
        </div>
    )
}

Landing.propTypes = {
    history: PropTypes.shape({}),
    purpose: PropTypes.shape({})
}