import React from 'react'
import PropTypes from 'prop-types'
import { Accordion, Button } from '@insight/toolkit-react'

import { useBuilderContext } from '../../context'
import FieldWrapper from './FieldWrapper'

export default function FieldsSelected({ groupId, fieldIds, inputErrors }) {
    const { dispatcher } = useBuilderContext()
    const addInput = () => dispatcher.addInput(groupId)

    if (!fieldIds.length > 0) {
        return (
            <div>
                <p>Looks like this group doesn't have any fields.</p>
                <p>Click <Button color="link" onClick={addInput}>here</Button> to add one</p>
            </div>
        )
    }

    return (
        <div className="c-builder-fields--selected">
            <Accordion allowMultiple initiallyExpanded={inputErrors}>
                {({ getItemProps }) => {
                    return fieldIds.map(id => (
                        <FieldWrapper getItemProps={getItemProps} id={id} key={id} />
                    ))
                }}
            </Accordion>
            <Button color="link" onClick={addInput}>Add Input</Button>
        </div>
    )
}

FieldsSelected.propTypes = {
    groupId: PropTypes.string.isRequired,
    fieldIds: PropTypes.arrayOf(PropTypes.string).isRequired
}
