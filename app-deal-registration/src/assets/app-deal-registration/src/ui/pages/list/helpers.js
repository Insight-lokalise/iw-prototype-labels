import React from 'react'

import { DATE_FORMAT } from '@constants'
import { formatDate } from '@lib'

export const formatListText = (text, modified) => (
    <div className="c-list-item__text">
        <p>{modified ? 'Last Modified' : 'Created'}</p>
        <p className="c-list-item__date">{formatDate(text, DATE_FORMAT)}</p>
    </div>
)

export const sortByActive = entries => entries.sort((a, b) => {
    return b.isActive - a.isActive
})

export const addActiveItem = (items, versionId) => {
    const updatedItems = items.map(item => ({
        ...item,
        isActive: item.versionId === versionId
    }))
    return sortByActive(updatedItems)
}