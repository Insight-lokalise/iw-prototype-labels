import React from 'react'
import PropTypes from 'prop-types'
import cn from 'classnames'

import { Grid, useFormContext } from '@components'
import { createField, transformStyles } from '@services/form'
import CustomInput from './CustomInput'

export default function CustomGroup({
    childLayouts,
    group,
    handlers,
    inputs,
    lastGroupsModified,
    styles,
    values,
}) {

    const passedContext = { groupDisplay: group.name.split(' ').join(''), handlers, values }
    const fields = inputs.map(input => createField(input, passedContext, 'custom'))
    const classes = cn('c-deal__group', transformStyles(styles[group.id]))

    return (
        <div className={classes}>
            <div className="c-deal__group-title">
                <h4 className="c-deal__group-title__text">{group.name}</h4>
            </div>
            {group.header && (
                <div className="c-deal__group-header">
                    <p>{group.header}</p>
                </div>
            )}
            <div className="c-deal__inputs">
                <Grid isEditable={false} margin={[10, 40]} useCSSTransforms={false}>
                    {fields.map((field, index) => (
                        <div className="c-deal__input" data-grid={childLayouts[index]} key={childLayouts[index].i}>
                            <CustomInput
                                field={field}
                                passedContext={passedContext}
                                styles={styles[field.id]}
                            />
                        </div>
                    ))}
                </Grid>
            </div>
        </div>
    )
}