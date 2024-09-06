import React, { Component, Fragment } from 'react'
import { connect } from 'react-redux'

import { AddAccessoryLink } from './cartSFCs'
import { AccessoryModal } from './cartModals'
import { getAccessories, getCESAccessories } from '../actions'
import { addToCart } from '../actions/cartActions'
import { IWLoading } from '../../../iw-components'
import {
  selectCartItemMaterialIdsByContract,
  selectCartItemsViewByContract,
} from './../../../Cart/selectors'
import { selector_isEMEA } from '../../../../libs/User/selectors'
import { ShowIf } from '../../../higherOrderComponents/showIf'

class Accessories extends Component {
  filteredAccessoriesList = [];
  constructor(props) {
    super(props)
    this.state = {
      showAccessoryDialog: false,
    }
  }

  hideAccessoryDialog = () => {
    this.setState({
      showAccessoryDialog: false,
    })
  }

  showAccessoryDialog = () => {
    this.setState({
      showAccessoryDialog: true,
    })
    if (typeof this.props.productFromState === 'undefined') {
      if (this.props.isCES || this.props.isLoggedOutDefaultUser) {
        this.props.getCESAccessories()
      } else {
        this.props.getAccessories()
      }
    }
  }

  getFilteredAccessoriesList = (list) => {
    if(this.props.isCES || this.props.isLoggedOutDefaultUser) {
      return list;
    } else {
      const filteredItems = list.filter(accessoriesItem => accessoriesItem?.prices?.every(item => item?.priceLabel !== "CALLFORPRICELABEL"))
      return filteredItems.length ? filteredItems : [];
    }
  }

  render() {
    if(this.state.showAccessoryDialog && this.props.productFromState) {
      this.filteredAccessoriesList = this.getFilteredAccessoriesList(this.props.productFromState.accessories);
    }
    return (
      <span>
        <ShowIf test={!this.props.isReadOnly && shouldShowAccessories}>
          <Fragment>
            {this.props.isCartPage && this.props.hasAccessories && (
              <AddAccessoryLink onClick={this.showAccessoryDialog} />
            )}
            {this.state.showAccessoryDialog && this.props.productFromState && (
              <AccessoryModal
                isCES={this.props.isCES}
                productDetails={this.props.productFromState.webProduct}
                accessories={this.filteredAccessoriesList}
                hasAccessories={this.props.productFromState.hasAccessories}
                onHide={this.hideAccessoryDialog}
                addToCart={this.props.addToCart}
                contractId={this.props.contractID}
                itemsInCartByContract={this.props.itemsInCartByContract}
                materialIDKey={this.props.materialIDKey}
                showAccessoryDialog={this.state.showAccessoryDialog}
                softwareContractId={this.props.softwareContractId}
                isEMEA={this.props.isEMEA}
                isLoggedOutDefaultUser={this.props.isLoggedOutDefaultUser}
                isStockAndPriceDisplayDisabled={this.props.isStockAndPriceDisplayDisabled}
              />
            )}
          </Fragment>
        </ShowIf>
        {this.state.showAccessoryDialog && !this.props.productFromState ? (
          <IWLoading
            modal={true}
            className="iw-loading__size-giant"
          ></IWLoading>
        ) : (
          ''
        )}
      </span>
    )
  }
}

function mapStateToProps(state, ownProps) {
  return {
    productFromState: selectCartItemsViewByContract(
      state,
      ownProps.materialIDKey,
      ownProps.contractID
    ).product,
    itemsInCartByContract: selectCartItemMaterialIdsByContract(
      state,
      ownProps.contractID
    ),
    isEMEA: selector_isEMEA(state),
  }
}

function mapDispatchToProps(dispatch, ownProps) {
  return {
    addToCart(item) {
      dispatch(addToCart(item))
    },
    getAccessories() {
      // need some details on software contract id, which is used in get product info call
      dispatch(getAccessories(ownProps))
    },
    getCESAccessories() {
      dispatch(getCESAccessories(ownProps))
    },
  }
}

/**
 *
 * @param  {Object} props   props passed to the showIf component
 * @return {Boolean}       should we render?
 */
function shouldShowAccessories(props) {
  const { reduxState } = props
  return (
    !reduxState.isLoggedIn ||
    (reduxState.isLoggedIn && reduxState.userPermissions.includes('accessories'))
  )
}

export default connect(mapStateToProps, mapDispatchToProps)(Accessories)
