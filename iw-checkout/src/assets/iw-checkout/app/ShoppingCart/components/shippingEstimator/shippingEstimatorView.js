import React, { Component } from 'react'

import ShippingOptions from './shippingOptions'
import { t } from '@insight/toolkit-utils/lib/labels'
import { IWButton, IWLoading, IWMessage } from '../../../../libs/iw-components'
import { validateZipcode } from './../../../../libs/models/Security/validation'
import generateUniqueId from '../../../libs/utils';


class ShippingEstimatorView extends Component {
    constructor() {
        super()
        this.state = {
            message: {},
            showAllCarriers: false,
            tempShippingOption: {},
            transformedShipOption: {},
        }
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        if(prevState.showAllCarriers && !this.props.shippingEstimator.isDialogVisible){
            this.setState({ showAllCarriers: false });
        }
    }

    handleGetShipEstimate() {
        this.setState({
            message: {},
        })
        const zipcode = this.refs.zipcode.value.toUpperCase()
        const countryCode = this.props.insightFromState.locale.split('_')[1]
        if (validateZipcode({ zipcode, countryCode, isApac: this.props.userFromState.isAPAC })) {
            this.props.getShipEstimate(this.refs.zipcode.value.toUpperCase())
            this.refs.zipcode.value = ''
        } else {
            this.setState({
                message: {
                    severity: 'error',
                    text: t('Please enter a valid ZIP/postal code.'),
                },
            })
        }
    }

    handleShippingOption = option => {
        const transformedOption = {
            data: {
                freight: option.cost,
                carrierId: option.carrierId,
                shippingPartnerForViewCart: Math.round(this.props.shippingEstimator.shippingOptions.shippingPartnerForViewCart),
                sourcePageOfRequest: 'ViewCart',
            },
        }
        this.setState({ tempShippingOption: option, transformedShipOption: transformedOption });
    };

    handleUpdateShipCarrier = () => {
        this.props.updateShipCarrier(this.state.transformedShipOption)
    };

    toggleCarriers = () => {
        this.setState({ showAllCarriers: !this.state.showAllCarriers });
    };

    render() {
        const applyText = t('Apply')
        const shippingEstimatorId = generateUniqueId('shippingEstimator-zipcode')

        return (
        <div className="row is-collapse-child shipping-estimator">
            <div className="columns">
                <h4>{t('Shipping estimator')}</h4>
                <p>
                  {t('Would you like to estimate your shipping price? Please enter your ZIP/Postal code below.')}
                </p>
                <div className="row row__gutter--tiny collapse">
                    <div className="column small-8 medium-5 large-8">
                      <label className="show-for-sr" htmlFor={shippingEstimatorId}>{t('ZIP code or Postal code')}</label>
                      <input ref="zipcode" type="text" className="no-margin-bot"
                        onKeyPress={(event) => event.which === 13 ? this.handleGetShipEstimate.call(this) : true }
                        id={shippingEstimatorId} />
                    </div>
                    <div className="column small-4">
                      <IWButton className="small expanded no-margin-bot" type="button"
                        onClick={()=>{ this.handleGetShipEstimate.call(this) }}>
                            {applyText}
                      </IWButton>
                    </div>
                </div>
                <IWMessage { ...this.state.message }></IWMessage>
            </div>

            {this.props.shippingEstimator.isPending ?
                <IWLoading modal={true} className="iw-loading__size-giant"></IWLoading>
                : ''}
             {this.props.shippingEstimator.isDialogVisible ?
                 <ShippingOptions
                     shippingOptions = {this.props.shippingEstimator.shippingOptions}
                     zipcode = {this.props.shippingEstimator.zipcode}
                     onHide={this.props.closeDialog}
                     toggleCarriers={this.toggleCarriers}
                     handleShippingOption={this.handleShippingOption}
                     showAllCarriers={this.state.showAllCarriers}
                     isDialogVisible={this.props.shippingEstimator.isDialogVisible}
                     isEMEA={this.props.userFromState.isEMEA}
                     handleUpdateShipCarrier={this.handleUpdateShipCarrier}
                     selectedCarrier={this.state.tempShippingOption}
                     />
                 : ''}
        </div>
      )
    }
}

export default ShippingEstimatorView
