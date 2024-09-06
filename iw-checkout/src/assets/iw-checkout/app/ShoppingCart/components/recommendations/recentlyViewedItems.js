import React, { Component } from 'react';
import { connect } from 'react-redux';

import ProductTile from './productTile';
import { IWCarousel } from './../../../../libs/iw-components';
import { t } from '@insight/toolkit-utils/lib/labels';
import { ShowIf } from '../../../../libs/higherOrderComponents';
import { getRecentlyViewedMaterialIds } from './../../../../libs/models/Products/';
import { getRecentlyViewedItems } from './../../actions/recommendationsActions';
import { addToCart } from './../../../../libs/businessContainerApps/cart/actions';
import { getCookie } from '@insight/toolkit-utils';
import {
  selectCartItemMaterialIds,
  selectRecentlyViewedItems,
} from './../../../../libs/Cart/selectors';
import {selector_isEMEA, selector_isLoggedIn, selector_hasStockAndPriceDisplayDisabled} from '../../../../libs/User/selectors';
import { isCesOrDefaultLoggedOut } from '../../../libs/helpers/cesOrDefaultLoggedOut';
import { getProductInfo } from '../../../libs/helpers/productInformation';

class RecentlyViewedItems extends Component {
  constructor(props) {
    super(props);
    this.state = {
      draggable: true
    }
  }

  setDraggable = () => {
    this.setState({draggable: !this.state.draggable});
  }

  componentDidMount() {
    // TODO interval query for new recently viewed items.
    // If a user opens more tabs and looks at additional items, that cookie
    // information is shared across all tabs of the Insight domain so we
    // can update this field on the fly.
    const recentlyViewedCookie = getCookie('recent_views');
    if(recentlyViewedCookie) {
      // fetch for products only if recently viewed cookie is populated
      this.props.getRecentlyViewedItems();
    }
  }

  render() {
    const {
      isEMEA,
      addToCart,
      isLoggedIn,
      itemsByMaterialId,
      cartItemMaterialIds,
      isStockAndPriceDisabled
    } = this.props;

    const sliderSettings = getSliderSettings(this.state.draggable);
    const hasRecentlyViewedItems = getRecentlyViewedMaterialIds().length > 0;
    const hasFetched = Object.keys(itemsByMaterialId).length > 0;
    const isCESOrDefaultLoggedOut = isCesOrDefaultLoggedOut();
    
    const productTiles = Object.keys(itemsByMaterialId)
      .map((itemId) => {
        const item = itemsByMaterialId[itemId];
        const {
          materialId,
          itemPricing,
          itemImage,
          isCallForPrice,
          itemDescription
        } = getProductInfo(item, isCESOrDefaultLoggedOut);
        // Filter out 'call for price' products
        if (isCallForPrice) return;

        const onAddToCart = addToCart.bind(null, [
          {
            materialID: materialId,
            quantity: 1,
            contractID:
              (item.contractDisplayInfo &&
                item.contractDisplayInfo.contractId) ||
              '',
          },
        ]);

        return (
          <div key={materialId}>
            <ProductTile
              className="Carousel__ProductTile"
              isLoggedIn={isLoggedIn}
              parentComponent="Recently Viewed Items"
              description={itemDescription}
              price={itemPricing}
              isInCart={cartItemMaterialIds.includes(materialId)}
              imageSRC={itemImage}
              webProduct={item}
              onAddToCartFromMorePrices={addToCart.bind(null)}
              materialId={materialId}
              onClick={onAddToCart}
              showVAT={isEMEA}
              setDraggable={this.setDraggable}
              isStockAndPriceDisabled={isStockAndPriceDisabled}
            />
          </div>
        )
      })
      .filter((tile) => tile != null);
    const hasProductTilesAfterFetch = hasFetched && productTiles.length > 0;

    return (
      <ShowIf
        test={shouldShowRecentlyViewedItems.bind(
          null,
          hasRecentlyViewedItems,
          hasFetched,
          hasProductTilesAfterFetch
        )}
      >
        <div className="row expanded is-collapse-child">
          <div className="column small-12 recommendations__container recommendations__container--light">
            <h3 className="recommendations__title">
              {t('Recently viewed items')}
            </h3>
            <IWCarousel
              className="recommendations__carousel"
              settings={sliderSettings}
            >
              {itemsByMaterialId ? productTiles : null}
            </IWCarousel>
          </div>
        </div>
      </ShowIf>
    )
  }
}

/**
 * I know that this is the same boolean logic for the recommendedItems and I
 * so want to abstract it but I think that some point they will diverge and I
 * don't know what really is common between the two. If at a later point we do
 * understand these components better, we can abstract.
 * @param  {Object} props   props passed to the showIf component
 * @return {Boolean}       should we render?
 */
function shouldShowRecentlyViewedItems(
  hasRecentlyViewedItems,
  hasFetched,
  hasProductTilesAfterFetch,
  props
) {
  const { reduxState } = props
  const isFetchingOrHasItems =
    (!hasFetched && hasRecentlyViewedItems) || hasProductTilesAfterFetch
  return (
    isFetchingOrHasItems &&
    (!reduxState.isLoggedIn ||
      (reduxState.isLoggedIn &&
        reduxState.userPermissions.includes('enable_crosssell')))
  )
}

function mapStateToProps(state) {
  return {
    cartItemMaterialIds: selectCartItemMaterialIds(state),
    itemsByMaterialId: selectRecentlyViewedItems(state).itemsByMaterialId || {},
    isEMEA: selector_isEMEA(state),
    isLoggedIn: selector_isLoggedIn(state),
    isStockAndPriceDisabled: selector_hasStockAndPriceDisplayDisabled(state)
  }
}

function mapDispatchToProps(dispatch) {
  return {
    getRecentlyViewedItems() {
      dispatch(getRecentlyViewedItems())
    },
    addToCart(item) {
      dispatch(addToCart(item))
    },
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(RecentlyViewedItems)

/**
 * Slider settings
 */
const getSliderSettings = (draggable) => ({
  slidesToShow: 6,
  infinite: false,
  draggable: draggable,
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
});
