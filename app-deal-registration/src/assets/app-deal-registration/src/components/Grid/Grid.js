import React from 'react'
import RGL, { WidthProvider } from 'react-grid-layout'
import { DEFAULT_GRID_MARGIN } from '@constants'

const ReactGridLayout = WidthProvider(RGL)

export default function Grid({
    children,
    cols = 12,
    isEditable = true,
    margin = DEFAULT_GRID_MARGIN,
    rowHeight = 65,
    ...rest
}) {

    return (
        <ReactGridLayout
            cols={cols}
            isDraggable={!!isEditable}
            isResizable={!!isEditable}
            margin={margin}
            rowHeight={rowHeight}
            {...rest}
        >
            {children}
        </ReactGridLayout>
    )
}