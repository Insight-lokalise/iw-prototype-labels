import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { t } from '@insight/toolkit-utils/lib/labels'
import { EDIT_LINE_LEVEL_INFO_TITLE } from './../../../../libs/businessContainerApps/checkoutAppHeader/constants'
import { IWAccordionSection } from './../../../../libs/iw-components/iw-accordion'

import { selector_hasLineLevelInformation } from './../../selectors'
import { checkoutGAE } from '@insight/toolkit-utils/lib/analytics'
import { selector_cart, selector_isOrderTemplate, selector_cartItemsGAE, selector_isSavedQuote } from '../../../../libs/Cart/selectors/cartResponse'
import { selector_isQuickCheckout } from '../../../../libs/Cart/selectors/shoppingCartView'
import LineLevelInfoFormSection from './LineLevelInfoFormSection'

export class LineLevelInfoAccordion extends Component {
    constructor(props) {
      super(props)
    }

    componentDidMount() {
      checkoutGAE({step: 1,
        cart: this.props.cart,
        cartItems: this.props.cartItemsGAE,
        isSaveAsQuote: this.props.isSavedQuote,
        isOrderTemplate: this.props.isOrderTemplate,
        isQuickCheckout: this.props.isQuickCheckout,
        overridePageTitle: EDIT_LINE_LEVEL_INFO_TITLE
      });
    }

    render() {
        return (
            this.props.hasLineLevelInformation && (
                this.props.isCollapsed ?
                    <IWAccordionSection {...this.props}
                      isPrivate={true}
                      className="line-level-information"
                      title={t('Item information')} >
                        <LineLevelInfoFormSection {...this.props} />
                    </IWAccordionSection>
                    :
                    <LineLevelInfoFormSection
                        history={this.props.history}
                        isReadOnly={this.props.isReadOnly}
                        isCollapsed={this.props.isCollapsed}
                    />
            )

        )
    }
}

function mapStateToProps(state) {
    return {
        hasLineLevelInformation: selector_hasLineLevelInformation(state),
        cart: selector_cart(state),
        cartItemsGAE: selector_cartItemsGAE(state),
        isSavedQuote: selector_isSavedQuote(state),
        isOrderTemplate: selector_isOrderTemplate(state),
        isQuickCheckout: selector_isQuickCheckout(state),
    }
}
LineLevelInfoAccordion.propTypes = {
    hasLineLevelInformation: PropTypes.bool,
}
export default connect(mapStateToProps, null)(LineLevelInfoAccordion)
