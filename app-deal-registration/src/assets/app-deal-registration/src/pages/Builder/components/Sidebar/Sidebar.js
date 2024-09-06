import React, { useState } from 'react'
import cn from 'classnames'

import { useBuilderContext } from '../../context'
import Header from './Header'
import Groups from './Groups'

export default function Sidebar() {
    const { activeStep, groupFilter, setGroupFilter } = useBuilderContext()
    if (activeStep > 1) {
        return null
    }

    const [isExpanded, setExpanded] = useState(true)

    const toggleExpanded = () => {
        setExpanded(prev => !prev)
    }

    const classes = cn('c-sidebar', {
        'is-expanded': isExpanded
    })
    
    return (
        <div className={classes}>
            <Header
                groupFilter={groupFilter} 
                isExpanded={isExpanded} 
                setGroupFilter={setGroupFilter}
                toggleExpanded={toggleExpanded} 
            />
            <Groups groupFilter={groupFilter} />
        </div>
    )
}