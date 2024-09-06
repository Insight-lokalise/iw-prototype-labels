import React from 'react'
import PropTypes from 'prop-types'
import { t } from '@insight/toolkit-utils/lib/labels'

import { IWAddressForm } from './../../../../libs/iw-components/iw-form'

export default class AddNewAddress extends React.PureComponent {
    render() {
        return (
            <section>
                {this.props.showSameAsShipping &&
                    <div className="row expanded is-collapse-child">
                        <div className="column small-12">
                            <label className="form__label form__label--inline">
                                <input
                                    className="form__field form__input--checkbox"
                                    type="checkbox"
                                    onChange={event => this.props.sameAsShipping(event.target.checked)}
                                />
                                <span className="form__label--checkbox">
                                    {t('Same as shipping address')}
                                </span>
                            </label>
                        </div>
                    </div>}
                <IWAddressForm
                    disableCountrySelect={this.props.disableCountrySelect}
                    isLimitedUser={this.props.isLimitedUser}
                    requireAttentionLine={this.props.requireAttentionLine}
                    showPrivateShipTo={this.props.showPrivateShipTo}
                    isShipping={this.props.isShipping}
                />
            </section>
        )
    }
}

AddNewAddress.propTypes = {
    isLimitedUser: PropTypes.bool.isRequired,
    sameAsShipping: PropTypes.func.isRequired,
    showSameAsShipping: PropTypes.bool.isRequired,
    showPrivateShipTo: PropTypes.bool.isRequired,
    disableCountrySelect: PropTypes.bool.isRequired,
    requireAttentionLine: PropTypes.bool.isRequired,
    isShipping: PropTypes.bool.isRequired,
}
