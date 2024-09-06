import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'

import { t } from '@insight/toolkit-utils/lib/labels'
import ROUTES from './../../../../libs/routes'
import AddressSection from './AddressSection'
import AddressSectionSimple from './AddressSectionSimple'
import { IWAccordionSection } from './../../../../libs/iw-components'
import { selector_isB2BUser, selector_isLimitedUser } from './../../../../libs/User/selectors'
import { selector_orderMetaData } from './../../../../libs/OrderMetaData/selectors'
import { handleSectionAndPageRedirect } from './../helpers'

/**
 * TODO document
 */
export function AddressSectionWrapper(props) {
    const {
        isReadOnly,
        isCollapsed,
        type,
        ownIndex,
        setActiveIndex,
        history,
        isB2BUser,
        redirectToSBPOnEdit,
        isCES,
    } = props
    const isShipping = type === 'shipping'
    const title = isShipping ? t('Shipping address') : t('Billing address')
    const className = isShipping ? 'shipping-address' : 'billing-address'
    const redirectActiveSection = isShipping ? 0 : 2

    const shouldRender = !(!isShipping && isB2BUser)

    // If IWAccordion sets us as the active section when we shouldn't display,
    // set the next accordion section as active
    const isEditable = !isReadOnly && !isCollapsed
    if (!shouldRender && isEditable) {
        setActiveIndex('SBP', ownIndex + 1)
    }

    const onEdit = redirectToSBPOnEdit
        ? handleSectionAndPageRedirect.bind(null, history, setActiveIndex, ROUTES.SHIP_BILL_PAY, redirectActiveSection)
        : undefined

    return shouldRender &&
        <IWAccordionSection className={className}
            title={title}
            onEdit={onEdit}
            isPrivate={true}
            {...props}>
            {isCES ? 
                <AddressSectionSimple history={history} type={type} {...props} /> :
                <AddressSection history={history} type={type} {...props} />
            }          
        </IWAccordionSection>
}

function mapStateToProps(state) {
    return {
        isB2BUser: selector_isB2BUser(state),
        isLimitedUser: selector_isLimitedUser(state),
        orderMetaData: selector_orderMetaData(state),
    }
}

export default connect(mapStateToProps)(AddressSectionWrapper)

AddressSectionWrapper.propTypes = {
    type: PropTypes.string.isRequired,
    isB2BUser: PropTypes.bool.isRequired,
    isLimitedUser: PropTypes.bool.isRequired,
    isReadOnly: PropTypes.bool.isRequired,
    isCollapsed: PropTypes.bool.isRequired,
    ownIndex: PropTypes.number.isRequired,
    setActiveIndex: PropTypes.func.isRequired,
    history: PropTypes.object,
    redirectToSBPOnEdit: PropTypes.bool,
    isCES: PropTypes.bool.isRequired,
}
