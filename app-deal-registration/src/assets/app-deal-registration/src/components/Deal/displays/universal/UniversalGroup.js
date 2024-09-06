import React from 'react';
import { createField } from '@services/form';
import UniversalInput from './UniversalInput';

export default function UniversalGroup({
    group,
    handlers,
    inputs,
    lastGroupsModified,
    populatedSelects,
    styles,
    values
}) {
    // Is there any reason handlers needs to be created here? 
    // Or can I pass it from a higher level? That way we can forgo context.. 

    const passedContext = { groupDisplay: group.display, handlers, populatedSelects, values }
    const fields = inputs.map(input => createField(input, passedContext, 'universal'))
    return (
        <div className="c-deal__group is-universal">
            <div className="c-deal__group-title">
                <h4 className="c-deal__group-title__text">{group.name}</h4>
            </div>
            {group.header && (
                <div className="c-deal__group-header">
                    <p>{group.header}</p>
                </div>
            )}
            <div className="c-deal__inputs">
                {fields.map(field => (
                    <div className="c-deal__input is-universal">
                        <UniversalInput field={field} key={field.id} passedContext={passedContext} styles={styles[field.id]} />
                    </div>
                ))}
            </div>
        </div>
    )
}