import React, { Fragment } from 'react'
import PropTypes from 'prop-types'
import { Button, Modal } from '@insight/toolkit-react'

export default function ReloadModal({ onClose, reload }) {
    const handleClick = () => {
        reload()
        onClose()
    }

    return (
        <Modal isOpen onClose={onClose}>
            <Modal.Header>
                <h3>Reload previous data</h3>
            </Modal.Header>
            <Modal.Body>
                <p>It looks like you have some previously saved work for this form. Would you like to reload it?</p>
                <Button color="primary" onClick={handleClick}>Reload</Button>
            </Modal.Body>
        </Modal>
    )
}