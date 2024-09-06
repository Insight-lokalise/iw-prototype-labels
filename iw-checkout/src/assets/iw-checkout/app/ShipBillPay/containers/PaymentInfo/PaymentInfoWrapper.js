import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'

import ROUTES from './../../../../libs/routes'
import { t } from '@insight/toolkit-utils/lib/labels'
import PaymentInfo from './../../components/PaymentInfo/PaymentInfoSection'
import { IWAccordionSection } from './../../../../libs/iw-components'
import { selector_isB2BUser } from './../../../../libs/User/selectors'
import { handleSectionAndPageRedirect } from './../helpers'
import { selector_isQuickCheckout } from './../../../../libs/Cart/selectors/shoppingCartView'

export function PaymentInfoWrapper(props) {
    const {
        isReadOnly,
        isCollapsed,
        ownIndex,
        setActiveIndex,
        history,
        isB2BUser,
        redirectToSBPOnEdit,
    } = props
    const paymentInfoTitle = t('Payment info')
    const shouldRender = !isB2BUser

    // If IWAccordion sets us as the active section when we shouldn't display,
    // set the next accordion section as active
    const isEditable = !isReadOnly && !isCollapsed
    if (!shouldRender && isEditable) {
        setActiveIndex('SBP', ownIndex + 1)
    }

    const onEdit = redirectToSBPOnEdit
        ? handleSectionAndPageRedirect.bind(null, history, setActiveIndex, ROUTES.SHIP_BILL_PAY, 3)
        : undefined

    return shouldRender &&
        <IWAccordionSection className="payment-info"
            title={paymentInfoTitle}
            isPrivate={true}
            onEdit={onEdit}
            {...props} >
            <PaymentInfo history={history} {...props} />
        </IWAccordionSection>
}

function mapStateToProps(state) {
    return {
        isB2BUser: selector_isB2BUser(state),
        isQuickCheckout: selector_isQuickCheckout(state),
    }
}

export default connect(mapStateToProps)(PaymentInfoWrapper)


PaymentInfoWrapper.propTypes = {
    isReadOnly: PropTypes.bool.isRequired,
    isCollapsed: PropTypes.bool.isRequired,
    ownIndex: PropTypes.number.isRequired,
    setActiveIndex: PropTypes.func.isRequired,
    history: PropTypes.object,
    isB2BUser: PropTypes.bool.isRequired,
    redirectToSBPOnEdit: PropTypes.bool,
    isQuickCheckout: PropTypes.bool,
}
