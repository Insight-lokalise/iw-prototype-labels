import React, { useEffect, useState } from 'react'
import PropTypes from 'prop-types'
import cn from 'classnames'
import { Button, Loading } from '@insight/toolkit-react'

import { activateForm, activateTemplate, getActiveTemplates, getForms } from '@api' 
import { addActiveItem, sortByActive } from './helpers'
import ListItem from './ListItem'

export default function List({ display, history, location, purpose }) {
    const isTemplate = !!(location.state && location.state.templates)
    const [isFetching, setFetching] = useState(true)
    const [items, setItems] = useState([])

    useEffect(() => {
        const fetcher = async () => {
            const response = await (isTemplate ? getActiveTemplates : getForms)(purpose.getPurpose())
            if (response && !response.error) {
                const items = isTemplate ? response : sortByActive(response)
                setItems(items)
            } else {
                // err
            }
        }
        fetcher()
    }, [])

    const activateItem = async item => {
        const api = isTemplate ? activateTemplate : activateForm
        const response = await api(item)
        if (response && !response.error) {
            // display.addToast()
            setItems(prev => addActiveItem(prev, item.versionId))
        } else {
            // display bad toast
        }
    }
    const editItem = item => {
        purpose.updatePurpose({ form: item })
        history.push('/builder', { edit: true, templates: isTemplates })
    }

    const previewItem = item => {
        purpose.updatePurpose({ form: item })
        history.push('/preview')
    }

    const goToBuilder = () => {
        history.push('/builder', { edit: false, templates: isTemplates })
    }

    const getContent = () => {
        if (isFetching && !items.length > 0) {
            return <Loading size="small" />
        }
        if (!isFetching && !items.length > 0) {
            return ([
                <p key="no-item-1">There are no items here</p>,
                <Button color="primary" key="no-item-2" onClick={goToBuilder}>Go create some</Button>
            ])
        }
        return items.map(item => (
            <ListItem
                activateItem={activateItem}
                editItem={editItem}
                key={item.versionId}
                isTemplate={isTemplate}
                item={item}
                previewItem={previewItem}
            />
        ))
    }

    const classes = cn('c-list', {
        'is-empty': !items.length > 0,
        'is-fetching': isFetching
    })

    return <div className={classes}>{getContent()}</div>
}