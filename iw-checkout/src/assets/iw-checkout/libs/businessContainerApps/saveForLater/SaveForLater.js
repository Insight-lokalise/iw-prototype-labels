import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'

import { ShowIf } from '../../higherOrderComponents'
import { t } from '@insight/toolkit-utils/lib/labels'
import { IWAnchor, IWButton } from '../../iw-components'
import SaveLineLevels, { linkTypes } from '../cart/components/lineLevelForm/saveLineLevels'
import {
    selector_hasUsagePeriodReportableNonReportable,
    selector_cart,
    selector_isCloudCart, selector_cartItemsEnrollment,
} from './../../Cart/selectors'
import { selector_isLimitedUser } from './../../User/selectors'
import { userPermissions } from './../../User/permissions'
import { selector_hasUserPermission } from './../../User/selectors'
import SaveForLaterModal from './SaveForLaterModal'
import {submitEnrollmentValues} from "../cart/actions";
import {enrollmentInfoToUpdate} from './../../businessContainerApps/cart/helpers'

export class SaveForLater extends Component {
    constructor() {
        super()
        this.state = {
            saveCartModalIsOpen: false,
            orderTemplateModalIsOpen: false,
        }
        this.openSaveCartModal = this.openModal.bind(this, 'saveCart')
        this.openOrderTemplateModal = this.openModal.bind(this, 'orderTemplate')
    }


    closeModal = () => {
        this.setState({ saveCartModalIsOpen: false, orderTemplateModalIsOpen: false })
    };

    openModal(type) {
        const { hasEnrollmentInfoToUpdate, optInPartners, optOutPartners} = enrollmentInfoToUpdate(this.props.enrollmentInfo)
        hasEnrollmentInfoToUpdate &&  this.props.submitEnrollmentValues({enrollments: optInPartners , removedIds: optOutPartners })
        if (type === 'saveCart') {
            this.setState({ saveCartModalIsOpen: true, orderTemplateModalIsOpen: false })
        } else if (type === 'orderTemplate') {
            this.setState({ saveCartModalIsOpen: false, orderTemplateModalIsOpen: true })
        }
    }

    saveQuote = () => {
        const { hasEnrollmentInfoToUpdate, optInPartners, optOutPartners} = enrollmentInfoToUpdate(this.props.enrollmentInfo)
        hasEnrollmentInfoToUpdate ?
            this.props.submitEnrollmentValues({enrollments: optInPartners , removedIds: optOutPartners }).then(() => window.location =  "/insightweb/displaysavequote" )
            : window.location =  "/insightweb/displaysavequote"
    };

    render() {
        const saveForLaterText = t('Save for later')
        const saveAsQuoteText = t('Save as quote')
        const saveCartContentsText = t('Save cart contents')
        const saveOrderTemplateText = t('Save order template')
        const saveCart = 'save_cart'
        const viewQuotes = 'view_quotes'
        const {
            cartIsEmpty,
            canShowSaveForLaterSection,
            enrollmentInfo,
            isCloudCart,
            isLimitedUser,
            hasUsagePeriodReportableNonReportable,
            saveLineLevels,
            submitEnrollmentValues,
        } = this.props
        const {
            saveCartModalIsOpen,
            orderTemplateModalIsOpen,
        } = this.state
        return (
            !cartIsEmpty && canShowSaveForLaterSection && !isCloudCart &&
                <div className="save-for-later">
                    <div className="row section__header align-middle is-collapse-child hide-for-print">
                        <h3 className="columns section__header-title">
                            {saveForLaterText}
                        </h3>
                    </div>
                    <div className="row is-collapse-child hide-for-print">
                        <div className="columns">
                            { !isLimitedUser &&
                                 <ShowIf permissions={viewQuotes} test={!hasUsagePeriodReportableNonReportable}>
                                    { saveLineLevels ?
                                            <SaveLineLevels linkType={linkTypes.SAVE_AS_QUOTE_LINK} text={saveAsQuoteText} />
                                        :
                                            <IWAnchor className="save-for-later__action" onClick={this.saveQuote}  role="button" tabindex="0">
                                                {saveAsQuoteText}
                                            </IWAnchor>
                                    }
                                </ShowIf>
                            }
                            <ShowIf permissions={saveCart}>
                                <span>
                                    <IWButton className="save-for-later__action iw-button--link" onClick={this.openSaveCartModal}>
                                        {saveCartContentsText}
                                    </IWButton>
                                    <IWButton className="save-for-later__action iw-button--link" onClick={this.openOrderTemplateModal}>
                                        {saveOrderTemplateText}
                                    </IWButton>
                                    <SaveForLaterModal
                                        closeModal={this.closeModal}
                                        enrollmentInfo={enrollmentInfo}
                                        saveCartModalIsOpen={saveCartModalIsOpen}
                                        submitEnrollmentValues={submitEnrollmentValues}
                                        orderTemplateModalIsOpen={orderTemplateModalIsOpen}
                                    />
                                </span>
                            </ShowIf>
                        </div>
                    </div>
                </div>
        )
    }
}


SaveForLater.propTypes = {
    saveLineLevels: PropTypes.bool.isRequired,
}


SaveForLater.defaultProps = {
    saveLineLevels: false,
}

const mapStateToProps = state => ({
    canShowSaveForLaterSection: selector_hasUserPermission(state, userPermissions.SAVE_CART) ||
        selector_hasUserPermission(state, userPermissions.VIEW_QUOTES),
    cartIsEmpty: selector_cart(state).totalCount === 0,
    enrollmentInfo: selector_cartItemsEnrollment(state),
    isCloudCart: selector_isCloudCart(state),
    isLimitedUser: selector_isLimitedUser(state),
    hasUsagePeriodReportableNonReportable: selector_hasUsagePeriodReportableNonReportable(state),
})

const mapDispatchToProps = dispatch => bindActionCreators({
    submitEnrollmentValues,
}, dispatch)

export default connect(mapStateToProps, mapDispatchToProps)(SaveForLater)
