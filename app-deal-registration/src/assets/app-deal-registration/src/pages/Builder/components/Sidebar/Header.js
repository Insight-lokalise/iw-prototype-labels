import React from 'react'
import PropTypes from 'prop-types'
import { Button } from '@insight/toolkit-react'
import { Field } from '@components'
import { FILTER_OPTIONS } from '@constants'

export default function Header({
    groupFilter,
    isExpanded,
    setGroupFilter,
    toggleExpanded
}) {
    const icon = isExpanded ? 'arrow-left' : 'arrow-right'

    function handleChange({ target: { value }}) {
        setGroupFilter(value)
    }

    return (
        <div className="c-sidebar__header">
            <Button className="c-sidebar__close" color="link" icon={icon} onClick={toggleExpanded} />
            <div className="c-sidebar__search">
            </div>
            <div className="c-sidebar__filter">
                <Field
                    fullWidth
                    handleChange={handleChange}
                    initialValue={groupFilter}
                    label="Filter"
                    name="filter"
                    options={FILTER_OPTIONS}
                    type="Select"
                />
            </div> 
        </div>
    )
}

Header.propTypes = {
    groupFilter: PropTypes.string.isRequired,
    isExpanded: PropTypes.bool.isRequired,
    setGroupFilter: PropTypes.func.isRequired,
    toggleExpanded: PropTypes.func.isRequired
}