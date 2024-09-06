import React, { Fragment } from 'react'
import PropTypes from 'prop-types'
import { useSelector } from 'react-redux'
import RGL, { WidthProvider } from 'react-grid-layout'

import { Field } from '@components'
import { getLayoutFieldProps } from '@services/builder/layout'



const Grid = WidthProvider(RGL)

export default function LayoutGroup({ className, groupId, onChildLayoutChange, passedLayout, ...rest }) {
    const { group, inputs } = useSelector(state => {
        const group = state.builder.groups[groupId]
        const inputs = group.inputIds.reduce((acc, key) => ({
            ...acc,
            [key]: state.builder.inputs[key].sets[0]
        }), {})
        return { group, inputs }
    })
    const { childLayouts } = passedLayout

    const onDragStart = (layout, oldItem, newItem, placeholder, e, element) => {
        e.stopPropagation()
    }

    const onLayoutChange = layout => {
        onChildLayoutChange(groupId, layout)
    }

    return (
        <Fragment>
            <div className="c-builder-layout__title">
                <h3>{group.name}</h3>
            </div>
            {group.header && (
                <div className="c-builder-layout__header">
                    <p>{group.header}</p>
                </div>
            )}
            <Grid
                cols={12}
                onDragStart={onDragStart}
                onLayoutChange={onLayoutChange}
                rowHeight={65}
            >
                {childLayouts.map(childLayout => (
                    <div className="c-builder-layout__field" data-grid={childLayout} key={childLayout.i}>
                        <Field {...getLayoutFieldProps(inputs[childLayout.i])} />
                    </div>
                ))}
            </Grid>
        </Fragment>
    )
}

LayoutGroup.propTypes = {
    className: PropTypes.string,
    groupId: PropTypes.string.isRequired,
    onChildLayoutChange: PropTypes.func.isRequired,
    passedLayout: PropTypes.shape({})
}