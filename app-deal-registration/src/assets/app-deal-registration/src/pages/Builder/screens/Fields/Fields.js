import React from 'react'
import PropTypes from 'prop-types'
import { useSelector } from 'react-redux'
import { Accordion } from '@insight/toolkit-react'

import FieldsGroup from './FieldsGroup'
import FieldsSelected from './FieldsSelected'

export default function Fields() {
    const { inputErrors, selectedGroup } = useSelector(state => ({
        inputErrors: state.builder.inputErrors,
        selectedGroup: state.builder.selectedGroup
    }))
    if (!selectedGroup) {
        return (
            <div className="c-builder-fields is-empty">
                <div className="c-builder-fields__message">
                    <p>You have not selected a group. Please select one from the sidebar</p>
                </div>
            </div>
        )
    }

    const { header, id, inputIds, name } = selectedGroup

    return (
        <div className="c-builder-fields">
            <FieldsGroup header={header} id={id} name={name} />
            <FieldsSelected groupId={id} fieldIds={inputIds} inputErrors={inputErrors} />
        </div>
    )
}