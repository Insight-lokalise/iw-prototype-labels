import React from 'react'

import { t } from '@insight/toolkit-utils/lib/labels'
import { IWTranslationWithAsterisk, IWMessageBox, IWMessage } from '../../../../libs/iw-components'


export default function SBPHeader() {
    return (
        <IWMessageBox boxId='SBP-header' Content={props =>
            <div className="row expanded is-collapse-child SBP__messages">
                <div className="columns">
                    { props.messages.map(msg => <IWMessage className="expanded" key={msg.text} {...msg} />) }
                </div>
            </div>
        } />
    )
}
