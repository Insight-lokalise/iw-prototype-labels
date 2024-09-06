import React, { Component } from 'react'
import {connect} from "react-redux";
import PropTypes from 'prop-types';

import moment from 'moment'
import CartBundle from './cartBundle'
import CartItem from './cartItem'
import { ContractHeader } from './cartSFCs'
import {filterNonDEPCartItems, formatUTCDate, nameThatForm} from '../helpers'
import { ShowIf } from '../../../higherOrderComponents'
import { IWShowHide } from '../../../iw-components'
import {selector_lineLevelFormNames} from "../selectors";

class Contract extends Component {
    /**
     * copies proration date to all items in the same contract who's programID matches the selected item
     *     and who's showProrationDeployDateLink === true
     * @param  {date Object} selectedDateToBeCopied - the date that will be copied
     * @param  {string} programIDToBeMatched   - programID that must match
     * @return {undefined}                     - will get a cart response
     */
    copyProrationToAll = (selectedDateToBeCopied, programIDToBeMatched, purchaseTypeToBeCopied) => {
        const arrayOfItemsToBeUpdated = []
        const argumentObject = { contractMaterialIdsList: null }
        const emptyString = ''

        function _findCartItems(contractID, cartItemsObject, parentMaterialIDKey = 0) {
            Object.keys(cartItemsObject).forEach((cartItem) => {
                let itemToCheck = cartItemsObject[cartItem]
                // if bundled then find line items - else check to see if item matches
                itemToCheck.bundle ? _findCartItems(contractID, itemToCheck.lineItems, itemToCheck.materialIDKey) : _checkForMatch(contractID, itemToCheck, parentMaterialIDKey, purchaseTypeToBeCopied)
            })
        }

        /**
         * searches for matching programIDs within the contract who can also have their proration date/type changed
         * @param  {string} contractID             contractID from the contract object
         * @param  {object} itemToCheck            cartItem object from cartItems object
         * @param  {number} parentMaterialIDKey    if item is bundled it is the materialIDKey of the cartItem containing
         *                                             the bundled -- if not bundled defaults to 0
         * @param  {string} purchaseTypeToBeCopied (optional) used if purchase type can be changed
         * @return {undefined}                        adds match to array to be sent to server for update
         */
        function _checkForMatch(contractID, itemToCheck, parentMaterialIDKey, purchaseTypeToBeCopied) {
            const zero = 0
            const bundled = parentMaterialIDKey !== zero
            // bundled items will use the materialIDKey of their parent
            const materialIDKey = bundled ? parentMaterialIDKey : itemToCheck.materialIDKey
            // nonbundled items will have a default childMaterialIDKey of zero
            const childMaterialIDKey = bundled ? itemToCheck.materialIDKey : zero
            // only one link will show - if either shows it could be a match
            if ((itemToCheck.showProrationDeployDateLink || itemToCheck.showPurchaseTypeLinkOnUI)
                && itemToCheck.programID === programIDToBeMatched) {
                const proratableDateObject = formatUTCDate(selectedDateToBeCopied)
                let itemToBeUpdated = {
                    contractId: contractID,
                    childMaterialIDKey: childMaterialIDKey,
                    materialIDKey: materialIDKey,
                    proratableDate: moment(selectedDateToBeCopied).date().toString(),
                    proratableMonth: moment(selectedDateToBeCopied).month().toString(),
                    proratableYear: moment(selectedDateToBeCopied).year().toString(),
                    proratableDateObject: proratableDateObject,
                }
                // if the purchase type is editable then add prop to item
                if (purchaseTypeToBeCopied !== emptyString && itemToCheck.showPurchaseTypeLinkOnUI) {
                    itemToBeUpdated.cartItemPurchaseType = purchaseTypeToBeCopied
                }
                arrayOfItemsToBeUpdated.push(itemToBeUpdated)
            }
        }

        _findCartItems(this.props.contractDetails.contractID, this.props.contractDetails.cartItems)

        argumentObject.contractMaterialIdsList = arrayOfItemsToBeUpdated
        this.props.saveProrationUsageDate(argumentObject)
    };

    renderCartBundlesAndCartItems = () => {
        const programIDsMap = _mapProgramIDs(this.props.contractDetails.cartItems)

        /**
         * used to determine whether to show the copy to all link for proratable items
         * creates a map of proratable programIDs used as a reference as to whether there
         * are matching programIDs in the same contract
         * @param  {object} contractCartItems cartItems object within contract object
         * @return {object}                   map of programIDs and boolean values
         */
        function _mapProgramIDs(contractCartItems) {
            const duplicateProgramIDsMap = {}

            /**
             * iterates through cartItemsObject to find cart items both solo and nested
             * within a bundle
             * @param  {object} cartItemsObject   cartItems object within contract object
             * @return {function}                 either calls itself in case of bundle or
             *                                    returns _addToduplicateProgramIDsMap
             */
            function _findCartItems(cartItemsObject) {
                Object.keys(cartItemsObject).forEach((cartItem) => {
                    let itemToCheck = cartItemsObject[cartItem]
                    // if bundled then find line items - else check to see if item matches
                    itemToCheck.bundle ?
                        _findCartItems(itemToCheck.lineItems) :
                        _addToduplicateProgramIDsMap(itemToCheck.programID, itemToCheck.showProrationDeployDateLink, itemToCheck.showPurchaseTypeLinkOnUI)
                })
            }

            // check if item has proration/ability to change date
            // && to see if program id is in map.
            // if found, sets value to true, else adds it with default value of false
            function _addToduplicateProgramIDsMap(programID, showProrationDeployDateLink, showPurchaseTypeLinkOnUI) {
                if (showProrationDeployDateLink || showPurchaseTypeLinkOnUI) {
                    if (duplicateProgramIDsMap.hasOwnProperty(programID)) {
                        duplicateProgramIDsMap[programID] = true
                    } else {
                        duplicateProgramIDsMap[programID] = false
                    }
                }
            }

            _findCartItems(contractCartItems)

            return duplicateProgramIDsMap
        }

        const filteredCartItems = filterNonDEPCartItems(this.props.contractDetails.cartItems)
        const childItems = Object.values(this.props.contractDetails.cartItems).filter(item => item.parentMaterialId > 0)
        return Object.keys(filteredCartItems).map((itemIndexFromServer) => {
            const item = filteredCartItems[itemIndexFromServer]
            const sharedProps = {
				        key: itemIndexFromServer,
                b2bCartTransferCommoditiesMap: this.props.b2bCartTransferCommoditiesMap,
                items: this.props.contractDetails.cartItems,
                isCartPage: this.props.isCartPage,
                childEnrollmentId: item.childEnrollmentId,
                customerId: item.customerId,
                contractID: this.props.contractDetails.contractID,
                contractReportingFields: this.props.contractDetails.reportingFields || emptyArray,
                contractStartDate: this.props.contractDetails.startDate,
                copyProrationToAll: this.copyProrationToAll,
                DEPInsightPart: item.DEPInsightPart,
                defaultContactInformation: this.props.defaultContactInformation,
                defaultCountryOfUsage: this.props.defaultCountryOfUsage,
                disableDEPLink: this.props.disableDEPLink,
                disableLineLevelLink: this.props.disableLineLevelLink,
                enableExpandCollapse: this.props.enableExpandCollapse,
                enforceEnrollment: item.enforceEnrollment,
                doesPartnerDiversityExistForContract: this.props.contractDetails.doesPartnerDiversityExistForContract,
                getCart: this.props.getCart,
                hideLineLevelLink: this.props.hideLineLevelLink,
                hasMultipleLicenseInfoForms: this.props.hasMultipleLicenseInfoForms,
                hasUserPreferences: this.props.hasUserPreferences,
                history: this.props.history,
                setActiveIndex: this.props.setActiveIndex,
                isB2BUser: this.props.isB2BUser,
                isB2BTransfer: this.props.isB2BTransfer,
                isIPSUser: this.props.isIPSUser,
                isLoggedIn : this.props.isLoggedIn,
                isReadOnly: this.props.isReadOnly,
                isCloudCart: this.props.isCloudCart,
                isStockAndPriceDisplayDisabled: this.props.isStockAndPriceDisplayDisabled,
                numberOfItemsInCart: this.props.numberOfItemsInCart,
                numberOfItemsInContract: this.props.numberOfItemsInContract,
                partners: this.props.contractDetails.partners || emptyArray,
                selectedCartDetails: this.props.selectedCartDetails,
                showLineLevelForm: this.props.showLineLevelForm,
                showReadOnlyLineLevels: this.props.showReadOnlyLineLevels,
                showReadOnlyDEPSection: this.props.showReadOnlyDEPSection,
                showProductImages: this.props.showProductImages,
                usCommunity: this.props.contractDetails.usCommunity,
                // actions
                addToReadOnlyFieldsMap: this.props.addToReadOnlyFieldsMap,
                deleteFromCart: this.props.deleteFromCart,
                saveProrationUsageDate: this.props.saveProrationUsageDate,
                splitItems: this.props.splitItems,
                updateItemQuantity: this.props.updateItemQuantity,
                updateChildItems: this.props.updateChildItems,
			}



            const showItem = this.props.showLineLevelForm ?
                    item.bundle ?
                            this.props.lineLevelFormNames
                                .filter(name => {
                                    return name.startsWith(`lineLevelForm__${sharedProps.contractID}__${item.materialIDKey}`)
                                }).length > 0
                        :
                            this.props.lineLevelFormNames.includes(nameThatForm(sharedProps.contractID, '0', item.materialIDKey))
                :
                    true

            return (
                item.bundle ?
                    <IWShowHide key={sharedProps.key} showIf={showItem} >
                        <CartBundle
                            {...sharedProps}
                            bundledItem
                            cartBundleDetails={item}
                            dispatch={this.props.dispatch}
                            formNames={this.props.formNames}
                            programIDsMap={programIDsMap}
                        />
                    </IWShowHide>
                    :
                    <ShowIf key={sharedProps.key}
                        test={shouldShowCartItem.bind(null, item)}>
                        <IWShowHide showIf={showItem} >
                            <CartItem
                                {...sharedProps}
                                bundledItem={false}
                                cartItemDetails={item}
                                childItems={childItems}
                                showCopyToAllLink={programIDsMap[item.programID] !== undefined && programIDsMap[item.programID]}
                            />
                        </IWShowHide>
                    </ShowIf>
            )
        })
    };


    render() {
		return (
			<div className="cart__table-block">
                <ShowIf test={this.props.showContractNames}>
                    <ContractHeader contractName={this.props.contractDetails.abbreviation} />
                </ShowIf>
				{this.renderCartBundlesAndCartItems()}
			</div>
		)
	}
}


Contract.propTypes = {
    b2bCartTransferCommoditiesMap: PropTypes.object,
    contractDetails: PropTypes.object.isRequired,
    defaultContactInformation: PropTypes.object.isRequired,
    defaultCountryOfUsage: PropTypes.string.isRequired,
    disableDEPLink: PropTypes.bool.isRequired,
    disableLineLevelLink: PropTypes.bool.isRequired,
    enableExpandCollapse: PropTypes.bool.isRequired,
    hideLineLevelLink: PropTypes.bool.isRequired,
    hasMultipleLicenseInfoForms: PropTypes.bool.isRequired,
    history: PropTypes.object,
    isB2BTransfer: PropTypes.bool,
    isB2BUser: PropTypes.bool,
    isCartPage: PropTypes.bool,
    isCloudCart: PropTypes.bool,
    isLoggedIn: PropTypes.bool.isRequired,
    isReadOnly: PropTypes.bool.isRequired,
    lineLevelFormNames: PropTypes.arrayOf(PropTypes.string).isRequired,
    selectedCartDetails: PropTypes.object.isRequired,
    showContractNames: PropTypes.bool.isRequired,
    showLineLevelForm: PropTypes.bool,
    showReadOnlyLineLevels: PropTypes.bool,
    showReadOnlyDEPSection: PropTypes.bool,
    numberOfItemsInCart: PropTypes.number.isRequired,
    numberOfItemsInContract: PropTypes.number.isRequired,
    // actions
    addToReadOnlyFieldsMap: PropTypes.func.isRequired,
    deleteFromCart: PropTypes.func.isRequired,
    saveProrationUsageDate: PropTypes.func.isRequired,
    setActiveIndex: PropTypes.func.isRequired,
    splitItems: PropTypes.func.isRequired,
    updateItemQuantity: PropTypes.func.isRequired,
    updateChildItems: PropTypes.func.isRequired,
}

Contract.defaultProps = {
  isB2BTransfer: false,
  isCartPage: false,
}

function mapStateToProps(state) {
    return {
        formNames: selector_lineLevelFormNames(state),
    }
}

export default connect(mapStateToProps)(Contract)

function shouldShowCartItem(item) {
    return !((item.ippWarranty && item.selectedwarrantyDetails !== null) || (item.oemWarranty && item.selectedProductWarranty !== null))
}

const emptyArray = []
