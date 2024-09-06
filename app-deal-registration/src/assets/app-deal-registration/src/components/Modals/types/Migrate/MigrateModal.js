import React from 'react'
import PropTypes from 'prop-types'
import cn from 'classnames'
import { Button, Loading, Modal } from '@insight/toolkit-react'

import { Field } from '@components'

const MIGRATION_TYPES = ['existing', 'new']
const POSSIBLE_LOCATIONS = ['dev', 'prod', 'uat']

import useModalState from './useModalState'

export default function MigrateModal({
    currentLocation,
    formData,
    handleMigrate,
    onClose,
    ...rest
}) {
    const filteredLocations = POSSIBLE_LOCATIONS.filter(loc => !currentLocation.includes(loc))
    const [state, dispatch] = useModalState()

    function handleChange({ target: { name, value } }) {
        const dispatchType = name === 'environment'
            ? 'SET_SELECTED'
            : 'SET_MIGRATION_TYPE'
        dispatch({ payload: value, type: dispatchType })
    }

    function handleReset() {
        dispatch({ type: 'RESET' })
    }

    async function onSubmit(e) {
        dispatch({ type: 'SET_LOADING' })

        try {
            const response = await handleMigrate({
                env: state.currentlySelected,
                formData
            })
            if (response && response.status == '200') {
                dispatch({ payload: response, type: 'SET_RESPONSE' })
            } else {
                dispatch({ payload: `We couldn't migrate this form. Try again if it doesn't work please submit a ticket`, type: 'SET_ERROR' })
            }
        } catch (err) {
            dispatch({ payload: err, type: 'SET_ERROR' })
        }
    }

    function getModalContent() {
        if (state.isLoading) {
            return <Loading />
        }
        if (state.error) {
            return (
                <div className="c-migrate-modal__error">
                    <p>{state.error}</p>
                    <Button
                        color="primary"
                        onClick={handleReset}
                    >
                        Retry
                    </Button>
                </div>
            )
            return <p classsName="c-migrate-modal__error">{state.error}</p>
        }
        return (
            <div className="c-migrate-modal__form">
                <p>Please select the environment and type of migration you'd like to perform</p>
                <div className="o-grid">
                    <Field
                        className="o-grid__item"
                        fieldComponent="Select"
                        handleChange={handleChange}
                        hasNoInitialSelection
                        label="Environment"
                        name="environment"
                        options={filteredLocations}
                        placeholder="Select environment"
                    />
                    <Field
                        className="o-grid__item"
                        fieldComponent="Select"
                        handleChange={handleChange}
                        hasNoInitialSelection
                        label="Migration type"
                        name="migrationType"
                        options={MIGRATION_TYPES}
                        placeholder="Select migration type"
                    />
                </div>
            </div>
        )
    }

    const bodyClasses = cn('c-migrate-modal__body', {
        'has-error': state.error,
        'is-loading': state.isLoading
    })

    return (
        <Modal className="c-migrate-modal" onClose={onClose} isOpen {...rest}>
            <Modal.Header>
                <h3>Migrate this form to a different environment</h3>
            </Modal.Header>
            <Modal.Body className={bodyClasses}>
                {getModalContent()}
            </Modal.Body>
            <Modal.Footer>
                <Button
                    color="secondary"
                    disabled={state.isLoading}
                    onClick={onClose}
                >
                    Nevermind
                </Button>
                <Button
                    color="primary"
                    disabled={state.isLoading || state.response || !state.currentlySelected}
                    onClick={onSubmit}
                >
                    Migrate
                </Button>
            </Modal.Footer>
        </Modal>
    )
}

MigrateModal.propTypes = {
    currentLocation: PropTypes.string,
    formData: PropTypes.shape({}).isRequired,
    handleMigrate: PropTypes.func.isRequired,
    onClose: PropTypes.func.isRequired
}