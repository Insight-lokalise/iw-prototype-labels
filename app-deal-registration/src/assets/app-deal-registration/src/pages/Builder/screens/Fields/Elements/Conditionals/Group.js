import React, { useState } from 'react'
import PropTypes from 'prop-types'
import { Button } from '@insight/toolkit-react'

import Conditional from './Conditional'

export default function Group({ group, groupIndex, prefix, removeEnabled, removeGroup, updateConditionals }) {
    const handleRemove = () => removeGroup({ groupIndex, id: group.id })

    return (
        <div>
            {removeEnabled && (
                <Button color="link" icon="trashcan" onClick={handleRemove} />
            )}
            {group.conditionals.map((conditional, conditionalIndex) => (
                <Conditional
                    conditionalIndex={conditionalIndex}
                    groupIndex={groupIndex}
                    is={conditional.is}
                    key={conditional.id}
                    prefix={`${prefix}.conditionals.${conditionalIndex}`}
                    updateConditionals={updateConditionals}
                    when={conditional.when}
                />
            ))}
        </div>
    )
}

Group.propTypes = {
    group: PropTypes.shape({
        conditionals: PropTypes.arrayOf(PropTypes.shape({})),
        id: PropTypes.string
    }),
    groupIndex: PropTypes.number,
    prefix: PropTypes.string.isRequired,
    removeEnabled: PropTypes.bool.isRequired,
    removeGroup: PropTypes.func.isRequired
}