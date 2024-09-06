import React from 'react'
import PropTypes from 'prop-types'

import { t } from '@insight/toolkit-utils/lib/labels'
import { selector_showDuns } from '../../../LineLevel/selectors'
import Address from '@insight/toolkit-react/lib/Address/Address'
import Lozenge from "@insight/toolkit-react/lib/Lozenge/Lozenge";
import { useSelector } from 'react-redux'

const ReadOnlyAddress = props => {
    const { selectedAddress, isDefault } = props
    const showDun = useSelector(selector_showDuns)
    return (
        <div className="row expanded is-collapse-child">
            <div className="o-grid review-page-shipping-address-section">
                <div className="o-grid__item u-1/2">
                <Address
                    address={{
                        attentionLine:selectedAddress.attentionLine,
                        company:selectedAddress.companyName,
                        address1:selectedAddress.address.address1,
                        address2:selectedAddress.address.address2,
                        address3:selectedAddress.address.address3,
                        city:selectedAddress.address.city,
                        state:selectedAddress.address.state,
                        zipcode:selectedAddress.address.zipCode,
                        country:selectedAddress.address.countryId,
                        phone:selectedAddress.phone
                    }}
                />
                </div>
                {(showDun && selectedAddress?.address?.dunsNumber) &&
                  <div className="o-grid__item u-1/2">
                    <div className='u-text-bold'>{t('Duns Number')}</div>
                    <div>{selectedAddress?.address?.dunsNumber}</div>
                  </div>
                }
            </div>
            {isDefault &&
                <div className='columns small-12'>
                    <Lozenge color='info'>{t('Default')}</Lozenge>
                </div>
            }
        </div>
    )
};

export default ReadOnlyAddress;

ReadOnlyAddress.propTypes = {
    selectedAddress: PropTypes.object.isRequired,
}
