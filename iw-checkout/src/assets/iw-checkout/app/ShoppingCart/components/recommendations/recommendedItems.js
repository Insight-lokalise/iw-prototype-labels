import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'

import { IWCarousel } from './../../../../libs/iw-components'
import { t } from '@insight/toolkit-utils/lib/labels'
import { ShowIf } from './../../../../libs/higherOrderComponents/showIf'
import { createProductTile } from './createProductTile'
import { addToCart } from './../../../../libs/businessContainerApps/cart/actions'
import {
  selectCartItemMaterialIds,
  selectRecommendedItems,
} from './../../../../libs/Cart/selectors'
import { selectRichRelavanceAPI } from './../../../../libs/Insight/selectors'
import {selector_isEMEA, selector_isCES, selector_isLoggedIn, selector_hasStockAndPriceDisplayDisabled} from '../../../../libs/User/selectors'

const customersWhoPurchased = t(
  'Customers who purchased items in your cart also purchased'
)
const sliderSettings = {
  slidesToShow: 6,
  infinite: false,
  responsive: [
    {
      breakpoint: 768,
      settings: {
        slidesToShow: 2,
      },
    },
    {
      breakpoint: 1180,
      settings: {
        slidesToShow: 3,
      },
    },
    {
      breakpoint: 1600,
      settings: {
        slidesToShow: 4,
      },
    },
    {
      breakpoint: 1800,
      settings: {
        slidesToShow: 5,
      },
    },
  ],
}

class RecommendedItems extends PureComponent {
  constructor(props) {
    super(props)
    this.state = {
      productTiles: [],
      strategyMessage: null,
    }
  }

  render() {
    const {
      placementId,
      recommendedItems,
      cartItemMaterialIds,
      addToCart,
      hideAddToCart,
      openProductDetailsInNewTab,
      richRelavanceAPI,
      isCES,
      isEMEA,
      isLoggedIn,
      isStockAndPriceDisabled
    } = this.props
    if (Object.keys(recommendedItems).length === 0) return null

    const placement = `${placementId}${
      richRelavanceAPI.includes('integration') ? '_qa' : ''
    }`
    const recommendedPlacementData =
      recommendedItems && recommendedItems[placement]
    if (!recommendedPlacementData) return null
    const { prodList = [], strategyMessage = '' } = recommendedPlacementData
    const showVAT = isEMEA

    const productTiles = prodList
      .map((product) =>
        createProductTile.call(
          null,
          cartItemMaterialIds,
          addToCart,
          isLoggedIn,
          hideAddToCart,
          openProductDetailsInNewTab,
          isCES,
          showVAT,
          product,
          isStockAndPriceDisabled,
        )
      )
      .filter((tile) => tile != null)
    if (!productTiles.length) return null

    const placementStrategyMessage = strategyMessage || customersWhoPurchased
    return (
      productTiles.length > 0 && (
        <ShowIf test={shouldShowRecommendedItems}>
          <div className="row expanded is-collapse-child">
            <div className="column small-12 recommendations__container recommendations__container--dark">
              <h3 className="recommendations__title">
                {placementStrategyMessage}
              </h3>
              <IWCarousel
                className="recommendations__carousel"
                settings={sliderSettings}
              >
                {productTiles}
              </IWCarousel>
            </div>
          </div>
        </ShowIf>
      )
    )
  }
}

/**
 * I know that this is the same boolean logic for the recentlyViewedItems and I
 * so want to abstract it but I think that some point they will diverge and I
 * don't know what really is common between the two. If at a later point we do
 * understand these components better, we can abstract.
 * @param  {Object} props   props passed to the showIf component
 * @return {Boolean}        should we render?
 */
function shouldShowRecommendedItems({ reduxState }) {
  return (
    !reduxState.isLoggedIn ||
    (reduxState.isLoggedIn &&
      reduxState.userPermissions.includes('enable_crosssell'))
  )
}

function mapStateToProps(state) {
  return {
    cartItemMaterialIds: selectCartItemMaterialIds(state),
    isCES: selector_isCES(state),
    isEMEA: selector_isEMEA(state),
    isLoggedIn: selector_isLoggedIn(state),
    recommendedItems: selectRecommendedItems(state),
    richRelavanceAPI: selectRichRelavanceAPI(state),
    isStockAndPriceDisabled: selector_hasStockAndPriceDisplayDisabled(state)
  }
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(
    {
      addToCart,
    },
    dispatch
  )
}

export default connect(mapStateToProps, mapDispatchToProps)(RecommendedItems)

RecommendedItems.propTypes = {
  hideAddToCart: PropTypes.bool.isRequired,
  openProductDetailsInNewTab: PropTypes.bool.isRequired,
  recommendedItems: PropTypes.shape({}).isRequired,
  richRelavanceAPI: PropTypes.string.isRequired,
}
RecommendedItems.defaultProps = {
  hideAddToCart: false,
  openProductDetailsInNewTab: true,
}
