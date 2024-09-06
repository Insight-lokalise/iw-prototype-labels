import React, { useEffect } from 'react'
import { useSelector } from 'react-redux'
import RGL, { WidthProvider } from 'react-grid-layout'

import { layoutsSelector } from '@state/builder'
import { useBuilderContext } from '../../context'
import LayoutGroup from './LayoutGroup'

const Grid = WidthProvider(RGL)

export default function Layout() {
    const { groupLayouts, layouts: passedLayouts } = useSelector(layoutsSelector)
    const { layouts } = useBuilderContext()

    useEffect(() => {
        layouts.registerLayout({ ...passedLayouts })
    }, [])

    const onLayoutChange = layout => {
        layouts.handleLayoutChange(layout)
    }

    const onChildLayoutChange = (groupId, layout) => layouts.handleChildLayoutChange(groupId, layout)

    return (
        <div className="c-builder-layout">
            <Grid
                cols={12}
                draggableCancel=".no-drag"
                isDraggable
                isResizable
                layout={groupLayouts}
                onLayoutChange={onLayoutChange}
                rowHeight={65}
            >
                {groupLayouts.map(group => (
                    <div className="c-builder-layout__group" data-grid={group} key={group.i}>
                        <LayoutGroup groupId={group.i} key={group.i} onChildLayoutChange={onChildLayoutChange} passedLayout={passedLayouts[group.i]} />
                    </div>
                ))}
            </Grid>
        </div>
    )
}