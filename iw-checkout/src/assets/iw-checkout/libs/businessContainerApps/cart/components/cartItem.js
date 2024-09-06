import React from 'react'
import PropTypes from 'prop-types'

import { IWImage } from '../../../iw-components'

import { prependedSmartTrackersWithString } from '../helpers'
import { CartItemTrashIcon } from './cartSFCs'
import CartItemInformation from './cartItemInformation'
import CartItemInteractions from './cartItemInteractions'
import LineLevelFormContainer from './lineLevelForm/lineLevelFormContainer'
import LineLevelInfo from './lineLevelInfo'
import DEPInfo from './DEPInfo'
import { navigateToSection } from './../../../routes/navigate'
import {selectCartItemsViewByContract, selector_DEPItemsInCart} from "../../../Cart/selectors";
import {connect} from "react-redux";
import {productImageToRender} from "../../../models/Products";
import { selector_hasStockAndPriceDisplayDisabled } from '../../../User/selectors';


function CartItem(props) {
    const emptyString = ''
    const isQuote = (props.cartItemDetails.quoteItemNumber !== null && props.cartItemDetails.quoteItemNumber !== emptyString)
        && !(props.selectedCartDetails.quoteOrderRequest !== null && props.selectedCartDetails.quoteOrderRequest.quoteEdited)
    const isAPPLEDEPenabledForB2B = window.flags && window.flags['GNA-8679-APPLE-DEP-B2B']
    const sharedProps = {
        bundledItem: props.bundledItem,
        b2bCartTransferCommoditiesMap: props.b2bCartTransferCommoditiesMap,
        cartItemDetails: props.cartItemDetails,
        isB2BUser: props.isB2BUser,
        isB2BTransfer: props.isB2BTransfer,
        isStockAndPriceDisplayDisabled: props.isStockAndPriceDisplayDisabled,
        isCartPage: props.isCartPage,
        childEnrollmentId: props.childEnrollmentId,
        contractID: props.contractID,
        customerId: props.customerId,
        enforceEnrollment: props.enforceEnrollment,
        isIPSUser: props.isIPSUser,
        isLoggedIn : props.isLoggedIn,
        isReadOnly: props.isReadOnly,
        isQuote,
        selectedCartDetails: props.selectedCartDetails,
        showReadOnlyDEPSection: props.showReadOnlyDEPSection,
        showAppleDEPForB2B: props.isB2BUser && isAPPLEDEPenabledForB2B
    }
    const showTrashIcon = !props.bundledItem && !isQuote && !props.isReadOnly && !props.showLineLevelForm
    const navigateToLineLevelSection = ()=>{
        navigateToSection(props.history, 'LINELEVEL', props.setActiveIndex)
    }
    const itemImage = productImageToRender(props.cartItemDetails.imageURLs)
    const warrantyMatID = !props.isReadOnly && props.cartItemDetails.selectedProductWarranty && props.cartItemDetails.selectedProductWarranty.warrMaterialIdKey
    return (
        <div className="cart__item">
            <div className="row expanded align-top is-collapse-child cart__table-row text-center">
                {props.hasUserPreferences ?
                    (props.showProductImages &&
                    <div className="columns flex-child-shrink cart__table-col cart__table-col--image hide-for-print">
                        <IWImage
                            src={itemImage}
                            alt={`${props.cartItemDetails.description}`}/>
                    </div>)
                    : <div className="columns flex-child-shrink cart__table-col cart__table-col--image hide-for-print">
                        <IWImage
                            src={itemImage}
                            alt={`${props.cartItemDetails.description}`}/>
                    </div>
                }
                <div className="columns medium-flex-child-grow cart__table-col--item">
                    <CartItemInformation
                        {...sharedProps}
                        bundleParentMaterialIDKey={props.bundleParentMaterialIDKey}
                        isCloudCart={props.isCloudCart}
                        showCopyToAllLink={props.numberOfDEPItems > 1}
                        showLineLevelForm={props.showLineLevelForm}
                        showProductImages={props.showProductImages}
                        updateItemQuantity={props.updateItemQuantity}
                        tentativeQuantity={props.tentativeQuantity}
                        showCountryOfUsageInDescription={!props.showReadOnlyLineLevels && !props.showLineLevelForm && !props.showReadOnlyDEPSection}
                    />
                    {!props.showLineLevelForm &&
                        <CartItemInteractions
                            {...sharedProps}
                            bundleParentMaterialIDKey={props.bundleParentMaterialIDKey}
                            contractReportingFields={props.contractReportingFields}
                            contractStartDate={props.contractStartDate}
                            doesPartnerDiversityExistForContract={props.doesPartnerDiversityExistForContract}
                            partners={props.partners}
                            showCopyToAllLink={props.showCopyToAllLink}
                            showProductImages={props.showProductImages}
                            showReadOnlyLineLevels={props.showReadOnlyLineLevels}
                            // actions
                            copyProrationToAll={props.copyProrationToAll}
                            saveProrationUsageDate={props.saveProrationUsageDate}
                        />
                    }
                </div>
                <div className="columns flex-child-shrink cart__table-col cart__table-col--trash text-center hide-for-print hide-for-email">
                  {showTrashIcon &&
                    <CartItemTrashIcon
                      deleteFromCart={props.deleteFromCart}
                      materialIDKey={props.cartItemDetails.materialIDKey}
                      contractID={props.contractID}
                    />
                  }
                  {warrantyMatID &&
                    <div className='cart__warranty-trash'>
                      <CartItemTrashIcon
                        deleteFromCart={props.deleteFromCart}
                        materialIDKey={warrantyMatID}
                        contractID={props.contractID}
                      />
                    </div>
                  }
                </div>
            </div>
            {props.showLineLevelForm &&
                <div className="row expanded is-collapse-child">
                    <div className="column">
                        <LineLevelFormContainer
                            bundledItem={props.bundledItem}
                            bundleHeader={false}
                            bundleParentMaterialIDKey={props.bundleParentMaterialIDKey}
                            childItems={props.childItems}
                            childEnrollmentId={props.childEnrollmentId}
                            contractID={props.contractID}
                            contractReportingFields={props.contractReportingFields}
                            countryOfUsage={props.cartItemDetails.countryOfUsage || props.selectedCartDetails.defaultCountryOfUsage}
                            defaultContactInformation={props.defaultContactInformation}
                            defaultCountryOfUsage={props.defaultCountryOfUsage}
                            defaultLineLevels={props.selectedCartDetails.defaultLineLevels}
                            doesPartnerDiversityExistForContract={props.doesPartnerDiversityExistForContract}
                            hasMultipleLicenseInfoForms={props.hasMultipleLicenseInfoForms}
                            history={props.history}
                            setActiveIndex={props.setActiveIndex}
                            licenseInfo={props.cartItemDetails.sellRequirement}
                            materialIDKey={props.cartItemDetails.materialIDKey}
                            numberOfItemsInCart={props.numberOfItemsInCart}
                            numberOfItemsInContract={props.numberOfItemsInContract}
                            outOfBundleChildItems={props.outOfBundleChildItems}
                            partners={props.partners}
                            partnerID={props.cartItemDetails.partnerID}
                            savedContractReportingFields={props.cartItemDetails.contractReportingFields}
                            savedSmartTrackers={prependedSmartTrackersWithString(props.cartItemDetails.lineLevels)}
                            showCountryOfUsage={props.cartItemDetails.showCountryOfUsage}
                            showSplitLink={props.bundledItem ? props.bundleQuantity > 1 : props.cartItemDetails.quantity > 1}
                            usCommunity={props.usCommunity}
                            // actions
                            addToReadOnlyFieldsMap={props.addToReadOnlyFieldsMap}
                            updateChildItems={props.updateChildItems}
                        />
                    </div>
                </div>
            }
            {props.cartItemDetails.enrollable && props.customerId && (props.showReadOnlyDEPSection || (sharedProps.showAppleDEPForB2B && props.isB2BTransfer)) &&
                <DEPInfo
                    customerId={props.customerId}
                    contractID={props.contractID}
                    DEPInsightPart={props.DEPInsightPart}
                    disableDEPLink={props.disableDEPLink || (sharedProps.showAppleDEPForB2B && props.isB2BTransfer)}
                    getCart={props.getCart}
                    materialIDKey={props.cartItemDetails.materialIDKey}
                />
            }
            {props.showReadOnlyLineLevels &&
                <LineLevelInfo
                    bundledItem={props.bundledItem}
                    bundleHeader={false}
                    savedContractReportingFields={props.cartItemDetails.contractReportingFields}
                    contractReportingFields={props.contractReportingFields}
                    countryOfUsage={props.cartItemDetails.countryOfUsage || props.selectedCartDetails.defaultCountryOfUsage}
                    defaultLineLevels={props.selectedCartDetails.defaultLineLevels}
                    disableLineLevelLink={props.disableLineLevelLink}
                    enableExpandCollapse={props.enableExpandCollapse}
                    doesPartnerDiversityExistForContract={props.doesPartnerDiversityExistForContract}
                    hideLineLevelLink={props.hideLineLevelLink}
                    licenseInfo={props.cartItemDetails.sellRequirement}
                    navigateToLineLevelSection={navigateToLineLevelSection}
                    partners={props.partners}
                    partnerID={props.cartItemDetails.partnerID}
                    showCountryOfUsage={props.cartItemDetails.showCountryOfUsage}
                    smartTracker={props.cartItemDetails.lineLevels}
                />
            }
        </div>
    );
}


CartItem.propTypes = {
    bundledItem: PropTypes.bool.isRequired,
    bundleParentMaterialIDKey: PropTypes.string,
    bundleQuantity: PropTypes.number,
    b2bCartTransferCommoditiesMap: PropTypes.object,
    cartItemDetails: PropTypes.object.isRequired,
    childEnrollmentId: PropTypes.number.isRequired,
    childItems: PropTypes.array,
    contractID: PropTypes.string.isRequired,
    contractReportingFields: PropTypes.array,
    contractStartDate: PropTypes.number,
    defaultContactInformation: PropTypes.object.isRequired,
    defaultCountryOfUsage: PropTypes.string.isRequired,
    DEPInsightPart: PropTypes.string,
    disableDEPLink: PropTypes.bool.isRequired,
    disableLineLevelLink: PropTypes.bool.isRequired,
    doesPartnerDiversityExistForContract: PropTypes.bool.isRequired,
    hasMultipleLicenseInfoForms: PropTypes.bool.isRequired,
    history: PropTypes.object,
    isB2BTransfer: PropTypes.bool,
    isCartPage: PropTypes.bool,
    isCloudCart: PropTypes.bool.isRequired,
    isLoggedIn: PropTypes.bool.isRequired,
    isReadOnly: PropTypes.bool.isRequired,
    numberOfItemsInCart: PropTypes.number.isRequired,
    numberOfItemsInContract: PropTypes.number.isRequired,
    outOfBundleChildItems: PropTypes.array,
    partners: PropTypes.array.isRequired,
    selectedCartDetails: PropTypes.object.isRequired,
    showAppleDEPForB2B: PropTypes.bool.isRequired,
    showCopyToAllLink: PropTypes.bool.isRequired,
    showLineLevelForm: PropTypes.bool,
    showReadOnlyLineLevels: PropTypes.bool,
    showReadOnlyDEPSection: PropTypes.bool,
    isPriceAndStockDisabled: PropTypes.bool,
    // actions
    addToReadOnlyFieldsMap: PropTypes.func.isRequired,
    copyProrationToAll: PropTypes.func.isRequired,
    deleteFromCart: PropTypes.func.isRequired,
    saveProrationUsageDate: PropTypes.func.isRequired,
    setActiveIndex: PropTypes.func.isRequired,
    updateChildItems: PropTypes.func.isRequired,
}


CartItem.defaultProps = {
    bundleParentMaterialIDKey: '0',
    bundleQuantity: 0,
    childItems: [],
    contractReportingFields: [],
    DEPInsightPart: '',
    isB2BTransfer: false,
    isCartPage: false,
    outOfBundleChildItems: []
}

function mapStateToProps(state, ownProps) {
    return {
        numberOfDEPItems: selector_DEPItemsInCart(state),
        isStockAndPriceDisplayDisabled: selector_hasStockAndPriceDisplayDisabled(state),
        tentativeQuantity: selectCartItemsViewByContract(state, ownProps.cartItemDetails.materialIDKey, ownProps.contractID)
        .tentativeQuantity,

    }
}

export default connect(mapStateToProps)(CartItem)
