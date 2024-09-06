import React, { Component, Fragment } from 'react'
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types'

import ROUTES from './../../../../libs/routes'
import { t } from '@insight/toolkit-utils/lib/labels'
import {
    IWButton,
    IWLoading,
    msgBox,
} from './../../../../libs/iw-components'
import { checkoutOptionsGAE } from '@insight/toolkit-utils/lib/analytics'
import { navigateToSection } from '../../../../libs/routes/navigate'
import ScrollIntoView from '../../../../libs/routes/ScrollIntoView'
import TaxExemption from './TaxExemption'

export default class TaxExemptionView extends Component {
    constructor(props) {
        super(props)
        this.state = {
            isLoadingData: true,
            overrideTax: false,
        }
      // @todo remove disable_feature_payment after pack one is merged with develop
      this.disable_feature_payment = false
    }

    componentDidMount() {
        this.props.getShoppingRequest()
        Promise.all([
            this.props.getTaxExemptFromShoppingRequest(),
        ]).then(([taxExemption]) => {

            this.setState({
              overrideTax: this.props.hasTaxOverride && taxExemption.value !== null && taxExemption.value.applyTaxCertificate,
              isLoadingData: false
            })
            /* scroll into view when component finished loading */
            if(!this.props.isReadOnly && !this.props.isCollapsed) {
                const thisComponent = ReactDOM.findDOMNode(this);
                thisComponent && ScrollIntoView(thisComponent, -200)
            }
        })
    }


    handleFormSubmit = () => {

        const taxExemptionPayload = {
          number: this.props.taxExemptionNumber,
          applyTaxCertificate: this.state.overrideTax,
        }
      Promise.all([
        !this.disable_feature_payment && this.props.hasTaxOverride ? this.props.updateTaxExemption(taxExemptionPayload) : null,
      ]).then(() => {
                const { history, setActiveIndex, isB2BUser } = this.props
                if (isB2BUser) {
                    this.props.validateReviewOrder()
                        .then(({ value }) => {
                            if (value.length > 0) {
                                msgBox.addMsg('SBP-header', {
                                    text: t('Errors must be corrected before saving.'),
                                    severity: 'error',
                                    scrollTo: '.SBP__messages',
                                })
                            } else {
                                msgBox.clear('SBP-header')
                                history.push({ pathname: ROUTES.CART_TRANSFER })
                                setActiveIndex('SBP', 0)
                                setActiveIndex('LineLevel', 0)
                            }
                        })
                } else {
                    this.props.proceedToCheckout({source:'CARRIER'})
                        .then(({value})=>{
                            const { checkoutState } = value
                            navigateToSection(history, checkoutState, setActiveIndex)
                        })
                }
            })
            .then(this.props.isQuickCheckout ? Promise.resolve() : this.props.getTaxAndEWRFee)
            .then(() => {
                checkoutOptionsGAE(2, this.props.selectedShippingOption.name, this.props.isQuickCheckout)
            })
    };


    render() {
        if (this.state.isLoadingData) return <IWLoading />
        const {
            isReadOnly,
            isCollapsed,
        } = this.props
        const isEditable = !isReadOnly && !isCollapsed
        return (
            <section>
                { isEditable &&
                  <Fragment>
                    <div className="row expanded is-collapse-child">
                        <div className="column">
                          { !this.disable_feature_payment && this.props.hasTaxOverride &&
                            <TaxExemption
                              hasTaxOverride={this.props.hasTaxOverride}
                              setOverrideTax={(overrideTax)=>{this.setState({overrideTax})}}
                              overrideTax={this.state.overrideTax}
                            />
                          }
                        </div>
                    </div>
                    <div className="row expanded is-collapse-child align-right text-right">
                        <div className="column small-12 medium-shrink">
                          <IWButton className="expanded section__button no-margin-bot" onClick={this.handleFormSubmit}>
                            {t('Continue')}
                          </IWButton>
                        </div>
                    </div>
                  </Fragment>
                }
              { isReadOnly &&
              <div className="row expanded is-collapse-child">
                <div className="columns small-12 medium-12">
                  { !this.disable_feature_payment && this.props.hasTaxOverride &&
                  <TaxExemption
                    hasTaxOverride={this.props.hasTaxOverride}
                    setOverrideTax={(overrideTax)=>{this.setState({overrideTax})}}
                    overrideTax={this.state.overrideTax}
                    isReadOnly={true}
                  />
                  }
                </div>
              </div>
              }
            </section>
        )
    }
}

TaxExemptionView.defaultProps = {
    isQuickCheckout: false,
}

TaxExemptionView.propTypes = {
    isCollapsed: PropTypes.bool.isRequired,
    isEMEA: PropTypes.bool,
    isReadOnly: PropTypes.bool.isRequired,
    isQuickCheckout: PropTypes.bool,
    reduxForm: PropTypes.object.isRequired,
    setActiveIndex: PropTypes.func.isRequired,
}
