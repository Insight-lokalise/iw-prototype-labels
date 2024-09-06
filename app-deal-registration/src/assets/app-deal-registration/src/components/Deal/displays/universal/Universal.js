import React, { useMemo } from 'react'
import PropTypes from 'prop-types'

import { Form } from '@components'
import { getInitialValues } from '@services/deal' 
import UniversalGroups from './UniversalGroups'

export default function Universal({ isEdit, passedFields, passedPopulated, passedValues, registerHandler, topLevelFields }) {
    const { groups, inputs, styles } = passedFields
    const initialValues = useMemo(() => {
        return getInitialValues({ passedFields, passedValues, topLevelFields, type: 'universal' })
    }, [topLevelFields])

    return (
        <div className="c-deal__display c-deal__display--universal">
            <Form initialValues={initialValues}>
                <UniversalGroups
                    groups={groups}
                    inputs={inputs}
                    isEdit={isEdit}
                    passedPopulated={passedPopulated}
                    registerHandler={registerHandler}
                    styles={styles}
                />
            </Form>
        </div>
    )
}