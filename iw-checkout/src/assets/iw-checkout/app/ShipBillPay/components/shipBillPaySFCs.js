import React from 'react'
import PropTypes from 'prop-types'
import { t } from '@insight/toolkit-utils/lib/labels'
import { IWAnchor } from '../../../libs/iw-components'

function AddNewAddressLink(props) {
    return (
        <IWAnchor onClick={props.onClick} className="section__body-action">
            <span className=""><span className=""></span>{t('Add new')}</span>
        </IWAnchor>
    )
}

AddNewAddressLink.propTypes = {
    onClick: PropTypes.func.isRequired,
}

export { AddNewAddressLink }
