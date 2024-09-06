import React from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import {selector_hasTaxOverride, selector_isSingleSoldTo} from '../../../LineLevel/selectors'

import ROUTES from './../../../../libs/routes'
import { t } from '@insight/toolkit-utils/lib/labels'
import ShippingOptions from './ShippingOptions'
import TaxExemption from './TaxExemption'
import { IWAccordionSection } from './../../../../libs/iw-components'
import { cartHasShippableItems } from './../../../../libs/Cart/selectors/cartResponse'
import { handleSectionAndPageRedirect } from './../helpers'
import {
    selector_isB2BUser,
    selector_isLimitedUser,
    selector_hasEditCheckoutDefaultsFavoritesPermission,
} from './../../../../libs/User/selectors'

import { selector_isQuickCheckout } from './../../../../libs/Cart/selectors/shoppingCartView'

function ShippingOptionsWrapper(props) {
    const {
        isReadOnly,
        isCollapsed,
        ownIndex,
        setActiveIndex,
        history,
        hasShippableItems,
        hasTaxOverride,
        redirectToSBPOnEdit,
    } = props
    const shippingOptionsTitle = t('Shipping options')
    const shouldRender = hasShippableItems
    const shouldRenderTaxExemption = !hasShippableItems && hasTaxOverride

    // If IWAccordion sets us as the active section when we shouldn't display,
    // set the next accordion section as active
    const isEditable = !isReadOnly && !isCollapsed
    if (!shouldRender && !shouldRenderTaxExemption && isEditable) {
        setActiveIndex('SBP', ownIndex + 1)
    }

    const onEdit = redirectToSBPOnEdit
        ? handleSectionAndPageRedirect.bind(null, history, setActiveIndex, ROUTES.SHIP_BILL_PAY, 1)
        : undefined

  return <div>
    { shouldRender &&
      <IWAccordionSection
        className="shipping-options"
        title={shippingOptionsTitle}
        onEdit={onEdit}
        {...props} >
        <ShippingOptions history={history} {...props} />
      </IWAccordionSection>
    }
    { shouldRenderTaxExemption &&
    <IWAccordionSection
      className="shipping-options"
      title={shippingOptionsTitle}
      onEdit={onEdit}
      {...props} >
      <TaxExemption history={history} {...props} />
    </IWAccordionSection>
    }
  </div>
}

function mapStateToProps(state) {
    return {
        hasShippableItems: cartHasShippableItems(state),
        isB2BUser: selector_isB2BUser(state),
        isEditChkoutDefaultFavs: selector_hasEditCheckoutDefaultsFavoritesPermission(state),
        hasTaxOverride: selector_hasTaxOverride(state),
        isLimitedUser: selector_isLimitedUser(state),
        isSingleSoldTo: selector_isSingleSoldTo(state),
        isQuickCheckout: selector_isQuickCheckout(state),
    }
}

export default connect(mapStateToProps)(ShippingOptionsWrapper)

ShippingOptionsWrapper.propTypes = {
    isReadOnly: PropTypes.bool.isRequired,
    isCollapsed: PropTypes.bool.isRequired,
    isEditChkoutDefaultFavs: PropTypes.bool.isRequired,
    isLimitedUser: PropTypes.bool.isRequired,
    isSingleSoldTo: PropTypes.bool.isRequired,
    ownIndex: PropTypes.number.isRequired,
    setActiveIndex: PropTypes.func.isRequired,
    history: PropTypes.object,
    hasShippableItems: PropTypes.bool.isRequired,
    redirectToSBPOnEdit: PropTypes.bool,
    selector_isQuickCheckout: PropTypes.bool,
}
