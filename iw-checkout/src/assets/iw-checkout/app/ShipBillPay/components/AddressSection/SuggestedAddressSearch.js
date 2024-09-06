import React, { useState } from 'react'
import PropTypes from 'prop-types'
import { t } from '@insight/toolkit-utils/lib/labels'
import { IWButton } from '../../../../libs/iw-components'

export function SuggestedAddressSearch(props) {

    const [searchTerm, setSearchTerm] = useState('')
    const { filterAddress } = props
    
    const keyPressHandler = (event) => {
        setSearchTerm(event.target.value)
        if(event.which === 13 ) {
            filterAddressHandler()
        }
    }

    const filterAddressHandler = () => {      
        filterAddress(searchTerm)
    };

    const searchPlaceholder = t('Search for suggested address')
    const search = t('search')
    return (
        <div className="row">
            <div className="column small-12">
                <div className="input-group">
                    <input type="text" className="input-group-field" placeholder={searchPlaceholder}
                            onKeyUp={ keyPressHandler }
                            id="suggestedAddress-search" />
                    <div className="input-group-button">
                        <IWButton type="button"
                                    aria-label={search}
                                    onClick={ filterAddressHandler }>
                            <span className="ion-search"><span className="show-for-sr">{searchPlaceholder}</span></span>
                        </IWButton>
                    </div>
                </div>
            </div>
        </div>
    )
}


export default SuggestedAddressSearch

SuggestedAddressSearch.propTypes = {
    filterAddress: PropTypes.func.isRequired,
}
