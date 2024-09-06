import React, { Component, Fragment } from 'react';
import { connect } from 'react-redux';
// actions
import { getWarranties, getThirdPartyWarranties } from '../actions';
import {
  deleteFromCart,
  addOEMToCart,
  addIPPToCart,
} from '../actions/cartActions';
// selectors
import {
  selectCartItemWarrentiesByContract,
  selectCartItemsViewByContract,
} from './../../../Cart/selectors';
import { selector_featureFlags } from '../../../flags/selectors';
import { selector_countryCode, selectRichRelavanceAPI } from '../../../Insight/selectors';
import {selector_currencyCode, selector_isEMEA} from '../../../../libs/User/selectors';
// components
import { AddWarrantyLink } from './cartSFCs';
import { WarrantyModal } from './cartModals';
import { IWLoading } from '../../../iw-components';
import { ShowIf } from '../../../higherOrderComponents/showIf';
// constants
import { RR_PLACEMENT_IDS } from '../../../../app/libs/constants';
import { triggerTrackingUrl } from '@insight/toolkit-utils';

const { rr_warranties, rr_warranties_qa } = RR_PLACEMENT_IDS;

class Warranties extends Component {
  constructor(props) {
    super(props)
    this.state = {
      showWarrantyDialog: false,
      warranty: {
        materialId: '',
        isIPPWarranty: false, // IPP and OEM have different addToCart logic
      },
      trackingUrl: null,
    }
  }

  handleAddWarrantyToCart = () => {
    const { 
      parentMaterialFromCart: {selectedProductWarrantyFlag, selectedProductWarranty, ippWarranty}, 
      productFromState: {warranties}, 
      thirdPartyWarranties = [],
    } = this.props;
    const defaultWarranty = [...warranties, ...thirdPartyWarranties][0];
    const defaultWarrantyState = {
      materialId: defaultWarranty.materialId,
      isIPPWarranty: ippWarranty,
    }
    const defaultTrackingURLState = defaultWarranty.clickTrackingURL ?? null;
    const hasSelectedWarranty = Object.keys(this.state.warranty).length > 0 || selectedProductWarrantyFlag;
    if(!hasSelectedWarranty){
      this.setState({
        warranty: defaultWarrantyState,
        trackingUrl: defaultTrackingURLState,
      })
    }

    const selectedItem = hasSelectedWarranty ? this.state.warranty : defaultWarrantyState

    //update warranty only if one is selected and it is not the same as the current one
    if (
      selectedItem.materialId &&
      (!selectedProductWarrantyFlag ||
        (selectedProductWarrantyFlag &&
          selectedItem.materialId != selectedProductWarranty.warrMaterialId))
    ) {
      let item
      let warrantyItem = {
        parentMaterialId: this.props.materialID,
        quantity: this.props.quantity,
        contractID: this.props.contractID,
      }
      if (selectedItem.isIPPWarranty) {
        // Add IPP warranty
        const body = Object.assign(
          {},
          {
            ...warrantyItem,
            ippMaterialId: selectedItem.materialId,
          }
        )
        this.props.addIPPToCart({ warranty: body })
      } else {
        // Add OEM warranty
        const body = Object.assign(
          {},
          {
            ...warrantyItem,
            parentMaterialIDKey: this.props.materialIDKey,
            warrMaterialId: selectedItem.materialId,
          }
        )
        item = Object.assign(
          {},
          { materialID: this.props.materialID },
          {
            warrantyDetail: body,
          }
        )
        this.props.addOEMToCart(item)
      }
      // RR tracking event
      const trackingUrl = selectedProductWarrantyFlag ? this.state.trackingUrl : defaultTrackingURLState;
      if (trackingUrl) {
        triggerTrackingUrl(trackingUrl)
      }
      // Google tracking event
      if (typeof window.dataLayer !== 'undefined') {
        const add_warranty_cart_page = {
          event: 'Add-Warranty-cart-page',
          warrantyType: selectedItem.isIPPWarranty
            ? 'IPP Warranty'
            : 'OEM Warranty',
          parentMaterialId: warrantyItem.parentMaterialId,
          warrantyMaterialId: selectedItem.materialId,
        }
        //                window.dataLayer.push(add_warranty_cart_page);
        fireTagEvent('addWarrantyCartPage', add_warranty_cart_page)
      }
    }
    this.hideWarrantyDialog()
  }

  hideWarrantyDialog = () => {
    this.setState({
      showWarrantyDialog: false,
    })

    /*
     *  when warranty dialog is opened, remove cart_page.rr_warranties as placement to RR
     * */
    const { richRelavanceAPI } = this.props
    const isIntegration = richRelavanceAPI.includes('integration')
    const placements = isIntegration ? ['cart_page.rr1_qa'] : ['cart_page.rr1']
    updateRRPlacements(placements)
  }

  showWarrantyDialog = () => {
    const {
      productFromState,
      getWarranties,
      thirdPartyWarranties,
      isThirdPartyWarrantyEnabled,
      getThirdPartyWarranties
    } = this.props;

    if (typeof productFromState === 'undefined') {
      getWarranties.call(this);
    }
    if (isThirdPartyWarrantyEnabled && !thirdPartyWarranties) {
      getThirdPartyWarranties.call(this);
    }

    this.setState({
      showWarrantyDialog: true,
      warranty: {},
    });

    /*
     *  when warranty dialog is opened, add cart_page.rr_warranties as placement to RR
     * */
    const { richRelavanceAPI } = this.props;
    const isIntegration = richRelavanceAPI.includes('integration');
    const placements = isIntegration ? [rr_warranties_qa] : [rr_warranties];
    updateRRPlacements(placements);
  }

  toggleWarranty = ({ materialId, isIPPWarranty, trackingUrl }) => {
    this.setState({
      warranty: {
        materialId,
        isIPPWarranty,
      },
      trackingUrl,
    })
  }

  render() {
    const {
      isEMEA,
      isReadOnly,
      isCartPage,
      contractID,
      productFromState,
      thirdPartyWarranties,
      parentMaterialFromCart,
      isThirdPartyWarrantyEnabled,
      isStockAndPriceDisplayDisabled
    } = this.props;
    const {
      selectedProductWarrantyFlag,
      selectedProductWarranty,
      selectedIPPFlag,
      productWarranties,
      warrantyDetails
    } = parentMaterialFromCart;
    const { showWarrantyDialog } = this.state;

    const showAddWarrantyLink = isCartPage && (productWarranties.length > 0 || warrantyDetails.length > 0);

    // Display warranties
    let showWarranties = showWarrantyDialog && productFromState;
    if (isThirdPartyWarrantyEnabled) {
      showWarranties = showWarranties && thirdPartyWarranties;
    }

    // Show loader
    let showLoader = showWarrantyDialog;
    if (showLoader) {
      showLoader = isThirdPartyWarrantyEnabled ? !(productFromState && thirdPartyWarranties) : !productFromState;
    }

    return (
      <Fragment>
        <span>
          <ShowIf
            test={
              ((selectedProductWarrantyFlag || selectedIPPFlag) &&
                !isReadOnly) ||
              (!isReadOnly &&
                shouldShowWarranties.bind(
                  null,
                  selectedProductWarrantyFlag,
                  selectedIPPFlag
                ))
            }
          >
            {showAddWarrantyLink && (
              <AddWarrantyLink
                onClick={this.showWarrantyDialog}
                isWarrantyAdded={selectedProductWarrantyFlag || selectedIPPFlag}
              />
            )}
          </ShowIf>
        </span>
        <span>
          <ShowIf
            test={
              !isReadOnly &&
              shouldShowWarranties.bind(
                null,
                selectedProductWarrantyFlag,
                selectedIPPFlag
              )
            }
          >
            {showWarranties && (
              <WarrantyModal
                onHide={this.hideWarrantyDialog}
                toggleWarranty={this.toggleWarranty}
                contractID={contractID}
                parentMaterialData={productFromState.parentProduct}
                warrantiesData={productFromState.warranties}
                thirdPartywarrantiesData={thirdPartyWarranties}
                selectedProductWarrantyFlag={selectedProductWarrantyFlag}
                selectedProductWarranty={selectedProductWarranty}
                showWarrantyDialog={showWarrantyDialog}
                handleAddWarrantyToCart={this.handleAddWarrantyToCart}
                showVAT={isEMEA}
                isStockAndPriceDisplayDisabled={isStockAndPriceDisplayDisabled}
              />
            )}
          </ShowIf>

          <div>
            {showLoader ? (
              <IWLoading modal={true} className="iw-loading__size-giant" />
            ) : null}
          </div>
        </span>
      </Fragment>
    )
  }
}

function mapStateToProps(state, ownProps) {
  return {
    productFromState: selectCartItemsViewByContract(
      state,
      ownProps.materialIDKey,
      ownProps.contractID
    ).productWarrantyData,
    thirdPartyWarranties: selectCartItemsViewByContract(
      state,
      ownProps.materialIDKey,
      ownProps.contractID
    ).thirdPartyWarranties,
    isThirdPartyWarrantyEnabled: selector_featureFlags(state)['GNA-8766-Third-Party-Warranty'] && selector_countryCode(state) === 'US' && selector_currencyCode(state) === 'USD',
    warrantyMaterialIds: selectCartItemWarrentiesByContract(
      state,
      ownProps.contractID,
      ownProps.materialIDKey
    ),
    richRelavanceAPI: selectRichRelavanceAPI(state),
    isEMEA: selector_isEMEA(state),
  }
}

function mapDispatchToProps(dispatch, ownProps) {
  return {
    getWarranties() {
      dispatch(getWarranties({ ...ownProps }))
    },
    getThirdPartyWarranties() {
      dispatch(getThirdPartyWarranties({ ...ownProps }))
    },
    addOEMToCart(item) {
      dispatch(addOEMToCart(item))
    },
    addIPPToCart(item) {
      dispatch(addIPPToCart(item))
    },
    deleteFromCart(item) {
      dispatch(deleteFromCart(item))
    },
  }
}

/**
 *
 * @param  {Object} props   props passed to the showIf component
 * @return {Boolean}       should we render?
 */
function shouldShowWarranties(oemSelected = false, ippSelected = false, props) {
  const { reduxState } = props
  return (
    (!reduxState.isLoggedIn ||
      (reduxState.isLoggedIn &&
        reduxState.userPermissions.includes('enable_warranties'))) &&
    (!(oemSelected || ippSelected) || oemSelected)
  )
}

/**
 *
 * @param placements to send to rich relavance
 */
function updateRRPlacements(placements) {
  if (
    placements.length > 0 &&
    typeof window.R3_COMMON !== 'undefined' &&
    window.R3_ADDTOCART !== 'undefined'
  ) {
    window.R3_COMMON.placementTypes = ''
    placements.forEach((placement) => {
      window.R3_COMMON.addPlacementType(placement)
    })
    window.rr_flush_onload()
    window.r3()
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Warranties)
