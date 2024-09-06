import React, { useEffect, useState } from 'react'
import PropTypes from 'prop-types'
import cn from 'classnames'

import { Grid, useFormContext } from '@components'
import { parseForm } from '@services/deal'
import CustomGroup from './CustomGroup'

export default function CustomGroups({
    groupLayout,
    groups,
    inputs,
    layouts,
    registerHandler,
    styles
}) {
    const [lastGroupsModified, setGroupsModified] = useState('')
    const form = useFormContext()
    useEffect(() => {
        registerHandler(() => ({
            isFormValid: form.validateAll(),
            key: 'custom',
            passedValues: parseForm({
                groups,
                inputs,
                layouts,
                values: form.getFormValues()
            }, 'custom')
        }))
    }, [])

    const values = form.getFormValues()
    const handlers = {
        field: ({ target: { name, value }}) => {
            setGroupsModified(prev => [name.split('-')[0]])
        }
    }

    return (
        <div className="c-deal__groups">
            <Grid isEditable={false}>
                {groups.map((group, index) => (
                    <div className="c-deal__group is-universal" data-grid={groupLayout[index]} key={groupLayout[index].i}>
                        <CustomGroup
                            childLayouts={layouts[group.id].childLayouts}
                            group={group}
                            handlers={handlers}
                            inputs={inputs[group.id]}
                            key={group.id}
                            lastGroupsModified={lastGroupsModified}
                            styles={styles}
                            values={values}
                        />
                    </div>
                ))}
            </Grid>
        </div>
    )
}