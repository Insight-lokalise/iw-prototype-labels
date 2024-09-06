import React, { Component } from 'react'
import PropTypes from 'prop-types'
import get from 'lodash-es/get'
import { getInObject } from '@insight/toolkit-utils'


import ConfirmationTableRow from './ConfirmationTableRow'
import ErrorTableRow from './ErrorTableRow'
import { IWExpandedTableSection, IWTableRow } from '../../../../iw-components'
import { PURCHASE_CHECKOUT_TYPE } from '../../constants'


export default class RequisitionTableRow extends Component {
  constructor(props) {
    super(props)

    this.state = {
      errorMessage: null,
      isExpanded: false,
      isRequisitionPending: false,
      updateDashletRequisitionParams: null,
      isRequisitionUpdating: false
    }

    this.handleError = this.handleError.bind(this)
    this.handleAction = this.handleAction.bind(this)
    this.handleConfirmationClose = this.handleConfirmationClose.bind(this)
    this.handleRequisitionUpdate = this.handleRequisitionUpdate.bind(this)
    this.toggleExpand = this.toggleExpand.bind(this)
  }

  handleError(errorMessage) {
    this.setState({ errorMessage })
  }

  handleAction(status) {
    // status: 1(approve) /2 (cancel) / 3 (deny) / 6 (under review)
    const updateDashletRequisitionParams = { ...this.props.requisitionParams, status }
    this.setState({ isRequisitionPending: true, updateDashletRequisitionParams })
  }

  handleConfirmationClose() {
    this.setState({ isRequisitionPending: false, updateDashletRequisitionParams: null })
  }

  async handleRequisitionUpdate() {
      const { isRequisitionUpdating } = this.state
      if (!isRequisitionUpdating) {
          this.setState({ isRequisitionUpdating: true })
          this.props.updateRequisitionStatus(this.state.updateDashletRequisitionParams).then((updatedRequisitionResponse) => {             
            const { lastApprover, referenceNumber } = this.state.updateDashletRequisitionParams
            if(updatedRequisitionResponse?.cart) {
              //requisition is approved successfully when cart object is available and this is the last approval
              this.approverActionAnalyticsEvent(updatedRequisitionResponse, referenceNumber,lastApprover)
            }
          })
      }
  }

  approverActionAnalyticsEvent(response, referenceNumber,lastApprover) {
    const isPurchaseAnalyticFlagEnabled = window.flags && window.flags['GNA-12643-PURCHASE-ANALYTICS']
          const { cart } = response
          const oldProducts = []
          const products = []

          cart.cartItemsForEmail.forEach(function (item,index) {
            products.push({
              insightPartId: item.materialID,
              productSku: item.mfrPartNumber,
              name: item.description,
              category: item.categoryId,
              price: item.price,
              quantity: item.quantity,
              brand: item.manufacturerName
            })
            oldProducts.push({
              id: item.materialID,
              name: item.description,
              category: item.categoryId,
              price: item.price,
              quantity: item.quantity,
              brand: item.manufacturerName
            })

            //cannot get this array to populate despite adding warranty 
            if (item.warrantyDetails && item.warrantyDetails.length > 0) {
              // we have warranty Item to add
              const warranty = item.warrantyDetails[0];
              const materialID = warranty.materialID;
              const description = warranty.description;
              const warrantyPrice = warranty.price; 
              const quantity = warranty.quantity;
              const manufacturerName = warranty.manufacturerName;
              const manufacturerPartNumber = warranty.manufacturerPartNumber;
              products.push({
                insightPartId: materialID,
                productSku: manufacturerPartNumber,
                brand: manufacturerName,
                name: description,
                category: null,
                price: warrantyPrice,
                quantity: quantity
              })
              oldProducts.push({
                id: materialId,
                brand: manufacturerName,
                name: description,
                category: null,
                price: warrantyPriced,
                quantity: quantity
              })
            }
          })

          const taxCost = getInObject(response, "cart.taxCost") || 0;
          const pstTaxCost = getInObject(response, "cart.pstTaxCost") || 0;
          const gstHstTax = getInObject(response, "cart.gstHstTax") || 0;
          const total = getInObject(response, "cart.totalCost") || 0;
          const subTotal = getInObject(response, "cart.subTotal") || 0;
          const shipping = getInObject(response, "cart.shippingCost") || 0;
          const shippingMethod = getInObject(response, "cart.shipCarrier.carrierDescription") || "";

          //  New purchase event
       
          const purchaseEvent = {
            ecommerce: {
              event: { eventName: 'approverActionYes' },
              scEvent: 'purchase',
              cartId: undefined, // SAP salesDocumentNumber will always be undefined because SAP does not process orders real time.
              dimension24: '' + false,
              coupon: '',
              currencyCode: cart.currency,
              purchaseId: referenceNumber,
              total: total,
              subTotal: subTotal,
              shipping: shipping,
              shippingMethod: shippingMethod,
              tax: taxCost + pstTaxCost + gstHstTax,
              products: products,
            }
          }
          // If lastApprover or isPurchaseAnalyticFlagEnabled is truthy, set the checkoutType based on isPurchaseAnalyticFlagEnabled and lastApprover. If isPurchaseAnalyticFlagEnabled is truthy, set the checkoutType to either REQUISITION_APPROVED or REQUISITION_CHECKOUT. Then, call fireTagEvent with purchaseEvent.
          if (lastApprover || isPurchaseAnalyticFlagEnabled) {
           
          if(isPurchaseAnalyticFlagEnabled){
            const checkoutType = lastApprover
            ? PURCHASE_CHECKOUT_TYPE.REQUISITION_CHECKOUT 
            :PURCHASE_CHECKOUT_TYPE.REQUISITION_APPROVED;
            purchaseEvent.ecommerce.checkoutType = checkoutType;
          }
           
            fireTagEvent('purchase', purchaseEvent);
              // Test to assure script hasn't been adblocked, then Force "Purchase" to be read synchronously
          window["_satellite"] && _satellite.track && _satellite.track("Purchase");

          window.dataLayer = window.dataLayer || [];

          const oldPurchaseEvent = {
            event: { eventName: 'approverActionYes' },
            dimension24: '' + false,
            purchase: {
              ecommerce: {
                id: referenceNumber,
                shipping: shipping,
                length: oldProducts.length,
                shippingMethod: shippingMethod,
                subTotal: subTotal,
                tax: taxCost + pstTaxCost + gstHstTax,
                total: total,
                coupon: '',
                products: oldProducts
              },
            },
          }
          fireTagEvent('oldPurchase',oldPurchaseEvent);
          
          }
       

        

         
  }

  toggleExpand() {
    const currentState = this.state.isExpanded
    this.setState({ isExpanded: !currentState })
  }

  render() {
    const {
      isExpandable,
      maxExpandedPriortiy,
      numberOfColumns,
      rowData,
      tableColumns,
      visibleTableColumns,
    } = this.props

    const { errorMessage, isExpanded, isRequisitionPending, updateDashletRequisitionParams, isRequisitionUpdating } = this.state

    const hiddenTableColumns = tableColumns.filter(row => row.priority > maxExpandedPriortiy)

    const rowDataCopy = { ...rowData }

    // Inject action handler into button/select component
    rowDataCopy.actions = React.cloneElement(rowDataCopy.actions, {
      handleError: this.handleError,
      handleAction: e => this.handleAction(Number(e.value)),
      value: get(updateDashletRequisitionParams, ['status'], null),
    })

    return (
      <tbody className="iw-table__tbody">
        {errorMessage && <ErrorTableRow numberOfColumns={numberOfColumns} errorMessage={errorMessage} />}
        <IWTableRow
          isExpandable={isExpandable}
          isExpanded={isExpanded}
          rowData={rowDataCopy}
          toggleExpand={this.toggleExpand}
          visibleTableColumns={visibleTableColumns}
        />
        {isRequisitionPending && (
          <ConfirmationTableRow
            numberOfColumns={numberOfColumns}
            onCancel={this.handleConfirmationClose}
            onConfirm={this.handleRequisitionUpdate}
            status={updateDashletRequisitionParams.status}
            isRequisitionUpdating={isRequisitionUpdating}
          />
        )}
        <IWExpandedTableSection
          hiddenTableColumns={hiddenTableColumns}
          isExpanded={isExpanded}
          numberOfColumns={numberOfColumns}
          rowData={rowData}
        />
      </tbody>
    )
  }
}

RequisitionTableRow.propTypes = {
  // explicit
  requisitionParams: PropTypes.object.isRequired,
  rowData: PropTypes.object.isRequired,
  updateRequisitionStatus: PropTypes.func.isRequired,
  // implicit
  isExpandable: PropTypes.bool.isRequired,
  maxExpandedPriortiy: PropTypes.number.isRequired,
  numberOfColumns: PropTypes.number.isRequired,
  tableColumns: PropTypes.arrayOf(
    PropTypes.PropTypes.shape({
      className: PropTypes.string,
      name: PropTypes.string.isRequired,
      priority: PropTypes.number.isRequired,
      reference: PropTypes.string.isRequired,
    })
  ).isRequired,
  visibleTableColumns: PropTypes.arrayOf(
    PropTypes.PropTypes.shape({
      className: PropTypes.string,
      name: PropTypes.string.isRequired,
      priority: PropTypes.number.isRequired,
      reference: PropTypes.string.isRequired,
    })
  ).isRequired,
}
