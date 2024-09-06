import React from 'react'
import PropTypes from 'prop-types'

import Proration from './proration'
import SelectedWarranty from './SelectedWarranty'
import { connectToLocale } from '@insight/toolkit-react'
import { connect } from 'react-redux'

import { selector_isDefaultLoggedOutUserEnabled, selector_webGroupPermissions} from '../../../../libs/User/selectors/index'


export function CartItemInteractions(props) {
  const { isCES } = props.context
  return (
    <div>
      {(props.cartItemDetails.proratable ||
        props.cartItemDetails.showProrationDeployDate) && (
        <Proration
          bundledItem={props.bundledItem}
          bundleParentMaterialIDKey={props.bundleParentMaterialIDKey}
          cartItemPurchaseType={props.cartItemDetails.cartItemPurchaseType}
          cartItemPurchaseTypeFromSAPUnEditable={
            props.cartItemDetails.cartItemPurchaseTypeFromSAPUnEditable
          }
          contractID={props.contractID}
          contractStartDate={props.contractStartDate}
          description={props.cartItemDetails.description}
          isReadOnly={props.isReadOnly}
          mfrPartNumber={props.cartItemDetails.mfrPartNumber}
          materialIDKey={props.cartItemDetails.materialIDKey}
          priceProrated={props.cartItemDetails.priceProrated}
          programID={props.cartItemDetails.programID}
          prorationDeployDate={props.cartItemDetails.prorationDeployDate}
          prorationType={props.cartItemDetails.prorationType}
          showCopyToAllLink={props.showCopyToAllLink}
          showProrationDeployDate={
            props.cartItemDetails.showProrationDeployDate
          }
          showProrationDeployDateLink={
            props.cartItemDetails.showProrationDeployDateLink
          }
          showPurchaseTypeLinkOnUI={
            props.cartItemDetails.showPurchaseTypeLinkOnUI
          }
          quantity={props.cartItemDetails.quantity}
          // actions
          copyProrationToAll={props.copyProrationToAll}
          saveProrationUsageDate={props.saveProrationUsageDate}
        />
      )}
      {!props.bundledItem && (
        <div
          className={
            props.showProductImages
              ? `small-negative-left-margin`
              : 'small-negative-left-margin hide-images-margin'
          }
        >
          <SelectedWarranty
            isCES={isCES}
            isLoggedIn={isLoggedIn}
            key={`${props.cartItemDetails.materialIDKey}__warranty`}
            parentMaterialFromCart={props.cartItemDetails}
            isReadOnly={props.isReadOnly}
            isLoggedOutDefaultUser={props.isLoggedOutDefaultUser}
            webGroupPermissions={props.webGroupPermissions}
            isIPSUser={props.isIPSUser}
          />
        </div>
      )}
    </div>
  )
}

function mapStateToProps(state) {
  return {
    isLoggedOutDefaultUser: selector_isDefaultLoggedOutUserEnabled(state),
    webGroupPermissions: selector_webGroupPermissions(state)
  }
}

export default connect(
  mapStateToProps,
  null
)(connectToLocale(CartItemInteractions))

CartItemInteractions.defaultProps = {
  contractReportingFields: [],
}

CartItemInteractions.propTypes = {
  bundledItem: PropTypes.bool.isRequired,
  bundleParentMaterialIDKey: PropTypes.string.isRequired,
  b2bCartTransferCommoditiesMap: PropTypes.object,
  cartItemDetails: PropTypes.object.isRequired,
  contractID: PropTypes.string.isRequired,
  contractReportingFields: PropTypes.array,
  contractStartDate: PropTypes.number,
  doesPartnerDiversityExistForContract: PropTypes.bool.isRequired,
  isReadOnly: PropTypes.bool.isRequired,
  partners: PropTypes.array.isRequired,
  selectedCartDetails: PropTypes.object.isRequired,
  setShowWarrantyTrash: PropTypes.bool.isRequired,
  showCopyToAllLink: PropTypes.bool.isRequired,
  showProductImages: PropTypes.bool.isRequired,
  // actions
  copyProrationToAll: PropTypes.func.isRequired,
  saveProrationUsageDate: PropTypes.func.isRequired,
}
