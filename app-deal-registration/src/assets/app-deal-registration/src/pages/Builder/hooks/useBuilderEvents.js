import { useEffect, useRef } from 'react'

import { useEvents } from '@context'

export default function useBuilderEvents() {
    const events = useEvents()
    const sidebarRef = useRef(null)
    const screenRef = useRef(null)
    
    const registerScreenRef = node => {
        screenRef.current = node
    }

    const registerSidebarRef = node => {
        sidebarRef.current = node
    }

    const scrollTo = node => {
        const height = node.clientHeight
        window.requestAnimationFrame(() => {
            const scrollHeight = node.scrollHeight
            if (scrollHeight > height) {
                node.scrollTop = (scrollHeight - height)
            }
        })
    }

    const onAddGroup = () => {
        scrollTo(sidebarRef.current)
    }

    const onAddInput = () => {
        scrollTo(screenRef.current)
    }

    useEffect(() => {
        events.on('builder:add-group', onAddGroup)
        events.on('builder:add-input', onAddInput)
        return () => {
            events.removeListener('builder:add-group', onAddGroup)
            events.removeListener('builder:add-input', onAddInput)
        }
    }, [])

    return { events, registerScreenRef, registerSidebarRef }
}