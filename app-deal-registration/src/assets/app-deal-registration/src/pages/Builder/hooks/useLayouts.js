import React, { useRef } from 'react'

export default function useLayouts() {
    const layoutsRegistry = useRef(null)

    const registerLayout = layout => {
        layoutsRegistry.current = layout
    }

    const getLayouts = () => layoutsRegistry.current

    const handleLayoutChange = layout => {
        if (!layoutsRegistry.current) return
        layout.forEach(entry => {
            layoutsRegistry.current = {
                ...layoutsRegistry.current,
                [entry.i]: { ...layoutsRegistry.current[entry.i], layout: entry }
            }
        })
    }

    const handleChildLayoutChange = (groupId, layout) => {
        if (!layoutsRegistry.current) return
        layoutsRegistry.current = {
            ...layoutsRegistry.current,
            [groupId]: {
                ...layoutsRegistry.current[groupId],
                childLayouts: layout
            }
        }
    }

    return {
        getLayouts,
        registerLayout,
        handleLayoutChange,
        handleChildLayoutChange
    }
}