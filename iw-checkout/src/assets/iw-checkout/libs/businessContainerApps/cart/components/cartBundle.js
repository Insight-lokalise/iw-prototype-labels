import React from "react";
import {submit} from "redux-form";
import PropTypes from 'prop-types'
import get from 'lodash-es/get'
import { t } from '@insight/toolkit-utils/lib/labels'

import {
    filterBundleDEPItems,
    getBundleOutsideChildItems,
    nameThatForm,
    prependedSmartTrackersWithString
} from '../helpers'
import { CartItemQuantityContainer } from './quantity'
import { CartItemTrashIcon } from './cartSFCs'
import LineLevelInfo from './lineLevelInfo'
import CartItem from './cartItem'
import LineLevelFormContainer from './lineLevelForm/lineLevelFormContainer'
import { navigateToSection } from './../../../routes/navigate'
import {IWAnchor} from "../../../iw-components";
import {
    clearFormSubmissionStaging, declareItemToSplit,
    resetNumberOfStagedLineLevelForms,
    setLineLevelFormSubmissionFailureStatus
} from "../actions/lineLevelFormActions";
import {recreateBundleParentFormName} from "../actions/lineLevelFormActionHelpers";


export default function CartBundle(props) {
    return (
        <div>
            <BundleHeader {...props} />
            <div className="cart__table-bundle-items">
                {renderBundledCartItems(props)}
            </div>
        </div>
    )
}


CartBundle.defaultProps = {
    contractReportingFields: [],
    DEPInsightPart: '',
}

CartBundle.propTypes = {
    b2bCartTransferCommoditiesMap: PropTypes.object,
    cartBundleDetails: PropTypes.object.isRequired,
    contractID: PropTypes.string.isRequired,
    contractReportingFields: PropTypes.array,
    contractStartDate: PropTypes.number,
    defaultContactInformation: PropTypes.object.isRequired,
    defaultCountryOfUsage: PropTypes.string.isRequired,
    disableDEPLink: PropTypes.bool.isRequired,
    DEPInsightPart: PropTypes.string,
    disableLineLevelLink: PropTypes.bool.isRequired,
    doesPartnerDiversityExistForContract: PropTypes.bool.isRequired,
    hasMultipleLicenseInfoForms: PropTypes.bool.isRequired,
    history: PropTypes.object,
    isB2BUser: PropTypes.bool,
    isCartPage: PropTypes.bool,
    isCloudCart: PropTypes.bool,
    isReadOnly: PropTypes.bool.isRequired,
    numberOfItemsInCart: PropTypes.number.isRequired,
    numberOfItemsInContract: PropTypes.number.isRequired,
    partners: PropTypes.array.isRequired,
    programIDsMap: PropTypes.object.isRequired,
    selectedCartDetails: PropTypes.object.isRequired,
    showLineLevelForm: PropTypes.bool,
    showReadOnlyLineLevels: PropTypes.bool,
    showReadOnlyDEPSection: PropTypes.bool,
    usCommunity: PropTypes.bool.isRequired,
    // actions
    addToReadOnlyFieldsMap: PropTypes.func.isRequired,
    copyProrationToAll: PropTypes.func.isRequired,
    deleteFromCart: PropTypes.func.isRequired,
    saveProrationUsageDate: PropTypes.func.isRequired,
    updateItemQuantity: PropTypes.func.isRequired,
    setActiveIndex: PropTypes.func.isRequired,
    splitItems: PropTypes.func.isRequired,
    updateChildItems: PropTypes.func.isRequired,
}


function BundleHeader(props) {
    const emptyString = ''
    const splitbundles = t('Split into individual bundles')

    const isQuote = (props.cartBundleDetails.quoteItemNumber !== null && props.cartBundleDetails.quoteItemNumber !== emptyString)
        && !(props.selectedCartDetails.quoteOrderRequest !== null && props.selectedCartDetails.quoteOrderRequest.quoteEdited)

    const insightPartNumberText = props.selectedCartDetails.specialSEWPSession ? t('Insight # / CLIN #') : t('Insight #')

    const showTrashIcon = !props.showLineLevelForm && !isQuote && !props.isReadOnly

    const navigateToLineLevelSection = ()=>{
        navigateToSection(props.history, 'LINELEVEL', props.setActiveIndex)
    }

    const outOfBundleChildItems = getBundleOutsideChildItems(props.items)

    const splitDEPItems = () =>{
        const splitReq = {
            enrollments: [{
                parentId: props.cartBundleDetails.materialIDKey,
                contractId: props.contractID
            }]
        }
        props.splitItems(splitReq)
    }

    const submitAllLineLevelForms = () => {
        const formName = nameThatForm(props.contractID, props.cartBundleDetails.materialIDKey, '')
        const { dispatch, formNames, bundledItem } = props
        dispatch(resetNumberOfStagedLineLevelForms())
        // reset failureStatus
        dispatch(setLineLevelFormSubmissionFailureStatus(false))
        // clear form submit data
        dispatch(clearFormSubmissionStaging())
        // declare which form will be split if any
        bundledItem
            ? dispatch(declareItemToSplit(recreateBundleParentFormName(formName)))
            : dispatch(declareItemToSplit(formName))
        // dispatch all form submits
        formNames.forEach(form => dispatch(submit(form)))
    }

    return (
        <div className="cart__table-bundle-row">
            <div className="row expanded align-top is-collapse-child">
                <div className="columns flex-child-shrink cart__table-col cart__table-col--image hide-for-print"></div>
                <div className="columns medium-flex-child-grow cart__table-col--item">
                    <div className="row">
                        <div className="columns flex-child-grow cart__table-col cart__table-col--desc cart__table-col--bundleDesc text-left">
                            <h4 className="cart__item-heading">{props.cartBundleDetails.description}</h4>
                            <div className="cart__item-bundle">
                                {t(insightPartNumberText)}: {props.cartBundleDetails.materialID}
                                {props.cartBundleDetails.quantity > 1 && !props.showReadOnlyDEPSection &&
                                    <IWAnchor onClick={props.isCartPage ? splitDEPItems : submitAllLineLevelForms} className="line-level__split-link float--right">
                                        <span className="ion ion-shuffle" />
                                        {splitbundles}
                                    </IWAnchor>
                                }
                            </div>
                        </div>
                        {!props.isStockAndPriceDisplayDisabled && props.selectedCartDetails.hasCOI &&
                            <div className="columns flex-child-auto medium-flex-child-shrink cart__table-col cart__table-col--coi text-center">
                                <span className="cart__table-col--label cart__font-size--sm hide-for-medium">{t('COI')}: </span>{props.cartBundleDetails.coiQuantity}
                            </div>
                        }
                        {!props.isStockAndPriceDisplayDisabled && props.selectedCartDetails.hasCSI &&
                            <div className="columns flex-child-auto medium-flex-child-shrink cart__table-col cart__table-col--csi text-center">
                                <span className="cart__table-col--label cart__font-size--sm hide-for-medium ">{t('CSI')}: </span>{props.cartBundleDetails.csiQuantity}
                            </div>
                        }
                        { props.selectedCartDetails.hasReserved &&
                            <div className="columns flex-child-auto medium-flex-child-shrink cart__table-col cart__table-col--reserved text-center">
                                <span className="cart__table-col--label cart__font-size--sm hide-for-medium ">{t('Reserved')}: </span>{props.cartBundleDetails.reservedQuantity}
                            </div>
                        }
                       { Object.keys(props.b2bCartTransferCommoditiesMap).length > 0 &&
                            <div className="columns flex-child-auto medium-flex-child-shrink cart__table-col cart__table-col--unspsc text-center">
                                <span className="cart__table-col--label cart__font-size--sm hide-for-medium ">{t('UNSPSC ver')}: </span>
                                {get(props.b2bCartTransferCommoditiesMap, [props.cartBundleDetails.materialID, 'code'], '')}
                            </div>
                        }
                        <div className="columns flex-child-auto medium-flex-child-shrink cart__table-col cart__table-col--price medium-text-right"></div>
                            <div className="columns flex-child-auto medium-flex-child-shrink cart__table-col cart__table-col--qty">
                                <span className="cart__table-col--label cart__font-size--sm hide-for-medium text-center">{t('Qty')} </span>
                                <CartItemQuantityContainer
                                    cartItemDetails={props.cartBundleDetails}
                                    contractID={props.contractID}
                                    readOnly={props.showLineLevelForm || isQuote || props.cartBundleDetails.zeroUsage || props.isReadOnly}
                                    updateItemQuantity={props.updateItemQuantity}
                                />
                            </div>
                            {!props.isStockAndPriceDisplayDisabled &&
                                <div className="columns flex-child-auto medium-flex-child-shrink cart__table-col cart__table-col--total medium-text-right"></div>
                            }
                            </div>
                    { props.showReadOnlyLineLevels &&
                        <LineLevelInfo
                            bundledItem={false}
                            bundleHeader
                            countryOfUsage={props.cartBundleDetails.countryOfUsage}
                            defaultLineLevels={props.selectedCartDetails.defaultLineLevels}
                            disableLineLevelLink={props.disableLineLevelLink}
                            enableExpandCollapse={props.enableExpandCollapse}
                            doesPartnerDiversityExistForContract={props.doesPartnerDiversityExistForContract}
                            hideLineLevelLink={props.hideLineLevelLink}
                            licenseInfo={props.cartBundleDetails.sellRequirement}
                            navigateToLineLevelSection={navigateToLineLevelSection}
                            partners={props.partners}
                            partnerID={props.cartBundleDetails.partnerID}
                            savedContractReportingFields={props.cartBundleDetails.contractReportingFields}
                            smartTracker={props.cartBundleDetails.lineLevels}
                        />
                    }
                    { props.showLineLevelForm &&
                        <div className="row expanded">
                            <div className="column">
                                <br />
                                <LineLevelFormContainer
                                    bundledItem={false}
                                    bundleHeader
                                    bundleParentMaterialIDKey={props.cartBundleDetails.materialIDKey}
                                    contractID={props.contractID}
                                    contractReportingFields={props.contractReportingFields}
                                    countryOfUsage={props.cartBundleDetails.countryOfUsage}
                                    defaultContactInformation={props.defaultContactInformation}
                                    defaultCountryOfUsage={props.defaultCountryOfUsage}
                                    defaultLineLevels={props.selectedCartDetails.defaultLineLevels}
                                    doesPartnerDiversityExistForContract={props.doesPartnerDiversityExistForContract}
                                    hasMultipleLicenseInfoForms={props.hasMultipleLicenseInfoForms}
                                    history={props.history}
                                    setActiveIndex={props.setActiveIndex}
                                    licenseInfo={props.cartBundleDetails.sellRequirement}
                                    materialIDKey={''}
                                    numberOfItemsInCart={props.numberOfItemsInCart}
                                    numberOfItemsInContract={props.numberOfItemsInContract}
                                    outOfBundleChildItems={outOfBundleChildItems}
                                    partnerID={props.cartBundleDetails.partnerID}
                                    partners={props.partners}
                                    savedContractReportingFields={props.cartBundleDetails.contractReportingFields}
                                    savedSmartTrackers={prependedSmartTrackersWithString(props.cartBundleDetails.lineLevels)}
                                    showSplitLink={false}
                                    usCommunity={props.usCommunity}
                                    // actions
                                    addToReadOnlyFieldsMap={props.addToReadOnlyFieldsMap}
                                    updateChildItems={props.updateChildItems}
                                />
                            </div>
                        </div>
                    }
                </div>
                <div className="columns flex-child-shrink cart__table-col cart__table-col--trash text-center hide-for-print">
                  { showTrashIcon &&
                    <CartItemTrashIcon
                      bundleHeader
                      contractID={props.contractID}
                      deleteFromCart={props.deleteFromCart}
                      materialIDKey={props.cartBundleDetails.materialIDKey}
                    />
                  }
                </div>
            </div>
        </div>
    )
}

function renderBundledCartItems(props) {
    const outOfBundleChildItems = getBundleOutsideChildItems(props.items)
    const filteredCartItems = filterBundleDEPItems(props.cartBundleDetails.lineItems, props.items)
    const childItems = Object.values(props.cartBundleDetails.lineItems).filter(item => item.parentMaterialId > 0)
    return Object.keys(filteredCartItems).map((itemIndexFromServer) => {
        const cartItemDetails = filteredCartItems[itemIndexFromServer]
        return (
            <CartItem
                key={itemIndexFromServer}
                bundledItem
                bundleParentMaterialIDKey={props.cartBundleDetails.materialIDKey}
                bundleQuantity={props.cartBundleDetails.quantity}
                b2bCartTransferCommoditiesMap={props.b2bCartTransferCommoditiesMap}
                cartItemDetails={cartItemDetails}
                isCartPage={props.isCartPage}
                childEnrollmentId={cartItemDetails.childEnrollmentId}
                childItems={childItems}
                contractID={props.contractID}
                contractReportingFields={props.contractReportingFields}
                contractStartDate={props.contractStartDate}
                customerId={cartItemDetails.customerId}
                defaultContactInformation={props.defaultContactInformation}
                defaultCountryOfUsage={props.defaultCountryOfUsage}
                disableDEPLink={props.disableDEPLink}
                disableLineLevelLink={props.disableLineLevelLink}
                DEPInsightPart={cartItemDetails.DEPInsightPart}
                doesPartnerDiversityExistForContract={props.doesPartnerDiversityExistForContract}
                enforceEnrollment={cartItemDetails.enforceEnrollment}
                getCart={props.getCart}
                hideLineLevelLink={props.hideLineLevelLink}
                hasMultipleLicenseInfoForms={props.hasMultipleLicenseInfoForms}
                hasUserPreferences={props.hasUserPreferences}
                history={props.history}
                isB2BUser={props.isB2BUser}
                isCloudCart={props.isCloudCart}
                isLoggedIn= {props.isLoggedIn}
                isReadOnly={props.isReadOnly}
                isShoppingCartReadOnly={props.isShoppingCartReadOnly}
                numberOfItemsInCart={props.numberOfItemsInCart}
                numberOfItemsInContract={props.numberOfItemsInContract}
                outOfBundleChildItems={outOfBundleChildItems}
                partners={props.partners}
                selectedCartDetails={props.selectedCartDetails}
                setActiveIndex={props.setActiveIndex}
                showCopyToAllLink={props.programIDsMap[cartItemDetails.programID] !== undefined && props.programIDsMap[cartItemDetails.programID]}
                showLineLevelForm={props.showLineLevelForm}
                showReadOnlyLineLevels={props.showReadOnlyLineLevels}
                showReadOnlyDEPSection={props.showReadOnlyDEPSection}
                showProductImages={props.showProductImages}
                usCommunity={props.usCommunity}
                // actions
                addToReadOnlyFieldsMap={props.addToReadOnlyFieldsMap}
                copyProrationToAll={props.copyProrationToAll}
                deleteFromCart={props.deleteFromCart}
                saveProrationUsageDate={props.saveProrationUsageDate}
                updateItemQuantity={props.updateItemQuantity}
            />
        )
    })
}


