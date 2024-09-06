import React, { useCallback } from 'react'
import PropTypes from 'prop-types'
import cn from 'classnames'
import { useSelector } from 'react-redux'
import { Button } from '@insight/toolkit-react'

export default function Group({ dispatcher, id, showModal }) {
    const group = useSelector(state => state.builder.groups[id])
    const selectedGroup = useSelector(state => state.builder.selectedGroup)
    
    const selectGroup = () => dispatcher.selectGroup(id)
    
    const classes = cn('c-sidebar__group', {
        'is-selected': selectedGroup && selectedGroup.id === id
    })

    if (!group) {
        return null
    }
    
    const inputsLength = group.inputIds.length

    return (
        <div className={classes} onClick={selectGroup}>
            <Button className="c-sidebar__group-remove" color="link" icon="trashcan" onClick={showModal} />
            <h4 className="c-sidebar__group-name">{group.name || 'nameless group'}</h4>
            <span className="c-sidebar__group-inputs">{inputsLength} input{inputsLength > 1 ? 's' : ''}</span>
        </div>
    )
}

Group.propTypes = {
    id: PropTypes.string.isRequired
}