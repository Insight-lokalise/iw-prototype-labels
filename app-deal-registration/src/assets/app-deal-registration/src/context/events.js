import React, { createContext, useContext, useMemo } from 'react'
import EventEmitter from 'events'

const EventsContext = createContext(null)

export function EventsProvider(props) {
    const contextValue = useMemo(() => new EventEmitter(), [])
    return <EventsContext.Provider value={contextValue} {...props} />
}

export function useEvents() {
    const context = useContext(EventsContext)
    return context
}