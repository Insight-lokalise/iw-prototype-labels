import React from 'react'
import PropTypes from 'prop-types'

import { Form } from '@components'
import { getInitialValues } from '@services/deal'
import CustomGroups from './CustomGroups'

export default function Custom({ passedFields, passedValues, registerHandler }) {
    const { groupLayout, groups, inputs, layouts, styles } = passedFields
    const initialValues = getInitialValues({ passedFields, passedValues, type: 'custom' })
    return (
        <div className="c-deal__display c-deal__display--custom">
            <Form initialValues={initialValues}>
                <CustomGroups
                    groupLayout={groupLayout}
                    groups={groups}
                    inputs={inputs}
                    layouts={layouts}
                    registerHandler={registerHandler}
                    styles={styles}
                />
            </Form>
        </div>
    )    
}

Custom.propTypes = {
    passedFields: PropTypes.shape({
        groupLayouts: PropTypes.arrayOf(PropTypes.shape({})),
        groups: PropTypes.arrayOf(PropTypes.shape({})),
        inputs: PropTypes.objectOf(PropTypes.arrayOf(PropTypes.shape({})))
    })
}