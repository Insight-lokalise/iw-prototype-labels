import React, { useState } from 'react'
import PropTypes from 'prop-types'
import { Button } from '@insight/toolkit-react'

import { generateConditionalGroup } from '@services/builder'
import Group from './Group'

export default function Conditionals({ initialConditionals = [], prefix, updateConditionals }) {
    const [removeEnabled, setRemoveEnabled] = useState(false)
    const [conditionalGroups, setConditionalGroups] = useState(initialConditionals)

    const toggleRemove = () => setRemoveEnabled(prev => !prev)
    const addGroup = () => {
        const newGroup = generateConditionalGroup()
        setConditionalGroups(prev => [...prev, newGroup])
        updateConditionals({ action: 'add-group', value: newGroup })
    }
    const removeGroup = ({ groupIndex, id }) => {
        const newGroups = conditionalGroups.filter(group => group.id !== id)
        updateConditionals({ action: 'remove-group', groupIndex })
        setConditionalGroups(prev => newGroups)
    }
    
    return (
        <div className="c-builder-field__conditionals">
            {conditionalGroups.map((group, index) => (
                <Group group={group} groupIndex={index} key={group.id} prefix={`${prefix}.${index}`} removeEnabled={removeEnabled} removeGroup={removeGroup} updateConditionals={updateConditionals} />
            ))}
            <Button color="link" onClick={addGroup}>Add Conditional Group</Button>
            <Button color="link" onClick={toggleRemove}>{removeEnabled ? 'Cancel Removing' : 'Remove Conditionals'}</Button>
        </div>
    )
}

Conditionals.propTypes = {
    initialConditionals: PropTypes.arrayOf(PropTypes.shape({})),
    prefix: PropTypes.string.isRequired,
    updateConditionals: PropTypes.func.isRequired
}
