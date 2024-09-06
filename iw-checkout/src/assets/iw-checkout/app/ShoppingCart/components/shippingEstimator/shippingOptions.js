import React, { Component } from 'react'

import { t } from '@insight/toolkit-utils/lib/labels'
import { ShippingOptionsList } from './shippingOptionsList'
import { IWAnchor, IWModal } from './../../../../libs/iw-components'
import { showCarrierChargeMessage } from '../../../libs/utils'

class ShippingOptions extends Component {
    constructor(props) {
        super(props);
    }

    componentDidMount() {
        let defaultCarrier;
        const shippingOptions = this.props.shippingOptions;
            // check for default carrier in SLS
        defaultCarrier = shippingOptions.slsFreightCosts
            && shippingOptions.slsFreightCosts.filter((freight)=> freight.defaultCarrier) || [];
            // if default carrier not found in SLS freight options
        defaultCarrier = defaultCarrier.length === 0 ? shippingOptions.freightCosts
            && shippingOptions.freightCosts.filter((freight)=> freight.defaultCarrier) : defaultCarrier;
            // set it to current state, view has been selected
        if (defaultCarrier && defaultCarrier.length > 0) {
            this.props.handleShippingOption(defaultCarrier[0])
        }
        else {
            // if no default carrier found, pre-select the first available carrier option
            if(shippingOptions.slsFreightCosts.length > 0) {
                this.props.handleShippingOption(shippingOptions.slsFreightCosts[0])
            }
            else if(shippingOptions.freightCosts.length > 0) {
                this.props.handleShippingOption(shippingOptions.freightCosts[0])
            }
        }
        if (shippingOptions.slsFreightCosts && shippingOptions.slsFreightCosts.length === 0) {
            // if user dont have SLS shipping options then show normal carriers
            this.props.toggleCarriers()
        }
    }

    render() {
        const shippingOptions = this.props.shippingOptions;
        const { freightCosts } = shippingOptions;
        const isFreightTbd = freightCosts.some( cost => cost['shippingCode'] === 'XD')
        const freightTbdMessage = "There has been an issue calculating shipping costs for this order. Either the freight cost is too large to calculate automatically or the address provided has returned an error. You may complete the order process, but once the order is placed you will be contacted with a quote for shipping costs before we can process the shipping. All totals are therefore showing as 'Estimated', as this price does not include shipping costs."

        return (
            <IWModal
               backdropClassName='iw-dialog iw-dialog-backdrop'
               modalSize='small'
               showIf={this.props.isDialogVisible}
               title={t('Select a shipping option')}
               confrimBtnText={t('Submit')}
               onHide={this.props.onHide}
               onConfirm={this.props.handleUpdateShipCarrier}
               >
               <div className="shipping-options">
                   <section className="row parent-product parent-product__border">
                       <div className="columns">
                           { shippingOptions.transportsToDetermine &&
                                showCarrierChargeMessage('hide-for-email')
                           }
                           <p>{t('Shipping cost estimates are based on the carrier and your ZIP/postal code')}: {this.props.zipcode}</p>
                           {isFreightTbd ? t(freightTbdMessage) : (
                           <ShippingOptionsList
                               shippingOptions={this.props.isEMEA ? this.props.shippingOptions.freightCosts : this.props.shippingOptions.slsFreightCosts}
                               isEMEA={this.props.isEMEA}
                               handleShippingOption={this.props.handleShippingOption}
                               selectedCarrier={this.props.selectedCarrier}
                            />
                           )}
                           {this.props.isEMEA ? null : this.props.showAllCarriers ?
                               <div>
                                   <p>{t('Please select a shipping carrier from the list below:')}</p>
                                   <ShippingOptionsList
                                       shippingOptions={this.props.shippingOptions.freightCosts}
                                       handleShippingOption={this.props.handleShippingOption}
                                       selectedCarrier={this.props.selectedCarrier}
                                    />                                       
                               </div>
                               : <IWAnchor href="#" className="shipping-options--expand"
                                        onClick={this.props.toggleCarriers}>{t('See all carriers')}</IWAnchor>}
                       </div>
                   </section>
               </div>
            </IWModal>

      )
    }
}

export default ShippingOptions;
