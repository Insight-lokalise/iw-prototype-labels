import React, { useState } from 'react'
import PropTypes from 'prop-types'
import cn from 'classnames'
import { Button } from '@insight/toolkit-react'

import { Status } from '@components'
import { formatListText } from './helpers'

export default function ListItem({
    activateItem,
    editItem,
    isTemplate,
    item,
    previewItem
}) {
    const [isActivating, setActivating] = useState(false)

    const id = isTemplate ? item.templateId : item.formId
    const { createDate, isActive, modifiedDate, versionId } = item

    const handleActivate = async () => {
        setActivating(prev => true)
        await activateItem(item)
        setActivating(prev => false)
    }

    const handleEdit = () => editItem(item)
    const handlePreview = () => previewItem(item)
    
    return (
        <div className="c-list-item">
            <div className="c-list-item__header">
                <p>Version: {versionId}</p>
                <p>Id: {id}</p>
                <Status isActive={isActive} />
            </div>
            <div className="c-list-item__text">
                {formatListText(createDate, false)}
                {modifiedDate && formatListText(modifiedDate, true)}
            </div>
            <div className="c-list-item__actions">
                <Button color="primary" onClick={handlePreview}>Preview</Button>
                <Button color="secondary" onClick={handleEdit}>Edit</Button>
                {!isActive && (
                    <Button color="secondary" isLoading={isActivating} onClick={handleActivate}>Activate</Button>
                )}
            </div>
        </div>
    )
}