import React, { useEffect, useRef, useState } from 'react'
import PropTypes from 'prop-types'
import { useSelector } from 'react-redux'
import { CSSTransition, TransitionGroup } from 'react-transition-group'

import { useBuilderContext } from '../../context'
import Group from './Group'
import GroupDeleteModal from './GroupDeleteModal'
import { SIDEBAR_MENU_OPTIONS } from '@constants'

export default function Groups({ groupFilter }) {
    const [ modalId, setModalId ] = useState(false)
    const sidebarRef = useRef(null)
    const groupIds = useSelector(state => {
        if (groupFilter === 'all') {
            return state.builder.groupIds
        }
        return state.builder.groupIds.filter(id => {
            const group = state.builder.groups[id]
            const sastisfies = (groupFilter === SIDEBAR_MENU_OPTIONS.custom ? !group.isUniversal : group.isUniversal)
            if (sastisfies) {
                return id
            }
        })
    })
    
    const { dispatcher, registerSidebarRef } = useBuilderContext()
    
    useEffect(() => {
        registerSidebarRef(sidebarRef.current)
    }, [])

    const closeModal = () => { setModalId(false) }
    return (
        <div className="c-sidebar__groups" ref={sidebarRef}>
            {!!modalId &&
                <GroupDeleteModal
                    closeModal={closeModal}
                    id={modalId}
                    dispatcher={dispatcher}
                />
            }
            <TransitionGroup className="c-sidebar__groups-list">
                {groupIds.map(id => (
                    <CSSTransition classNames="move" key={id} timeout={500}>
                        <Group dispatcher={dispatcher} id={id} key={id} showModal={() => setModalId(id)} />
                    </CSSTransition>
                ))}
            </TransitionGroup>
        </div>
    )
}

Groups.propTypes = {
    groupFilter: PropTypes.string.isRequired
}