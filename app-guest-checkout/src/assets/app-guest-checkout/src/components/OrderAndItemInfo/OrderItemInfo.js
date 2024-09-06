import React, { useEffect, useState } from 'react'
import { Accordion, Icon, Summary } from '@insight/toolkit-react'
import { t, checkoutGAE } from '@insight/toolkit-utils';
import { ROUTES } from '../../constants';
import cn from 'classnames';
import OrderInfo from './OrderInfo'
import ItemInfo from "./ItemInfo";
import {Helmet} from "react-helmet";
import {useSelector} from "react-redux";
import { selector_shoppingRequest, selector_cart, selector_hasWarrantyItem, selector_cartItemsGAE } from "../../state/slices/selectors/ShoppingReqeustSelector";
import { selector_hasSellRequirements } from "../../state/slices/selectors/lineLevelSessionInfosSelector";

export default function OrderItemInfo() {
  const hasWarrantyItem = useSelector(selector_hasWarrantyItem)
  const hasSellRequirements = useSelector(selector_hasSellRequirements)
  const shoppingRequest = useSelector(selector_shoppingRequest)
  const cart  = useSelector(selector_cart)
  const cartItemsGAE = useSelector((cartItems)=> selector_cartItemsGAE(cartItems))
  let defaultExpandedAccordion = hasWarrantyItem ? 'order-info' : 'item-info'
  if (window.location.href.indexOf("item-info") > -1) {
    defaultExpandedAccordion = 'item-info'
  }
  const [initiallyExpanded, setInitiallyExpanded] = useState([defaultExpandedAccordion])
  const orderInfoSectionToBeDisplayed = (hasWarrantyItem && hasSellRequirements) || hasWarrantyItem

  const toggleAccordion = (id) => {
    setInitiallyExpanded([id])
  }

  useEffect (()=>{
     // this step is used to track the order and item info page
     checkoutGAE({step: 1,
      cart: cart.summary,
      cartItems: cartItemsGAE,
      isSaveAsQuote: false,
      isOrderTemplate: false,
      isQuickCheckout: false,
      overridePageTitle: ROUTES['ITEM_INFO'].name
    });
  },[])

  const renderAccordionItems = (getItemProps) => {
    const updateItemProps = getItemProps()
    // disable toggle functionality in accordion item
    updateItemProps.accordion.toggle = () => {}
    return (
      <>
        {orderInfoSectionToBeDisplayed &&
          <Accordion.Item
            {...updateItemProps}
            content={<OrderInfo toggleAccordion={toggleAccordion} id={'item-info'} hasSellRequirements={hasSellRequirements} />}
            id={'order-info'}
            label={t('Order information')}
            extraAction={(hasWarrantyItem && hasSellRequirements && initiallyExpanded[0] === 'item-info') && <Icon icon="create" onClick={() => toggleAccordion('order-info')}/>}
            className={{item: cn({'expanded': initiallyExpanded[0] === 'order-info'})}}
          />
        }
        {hasSellRequirements &&
          <Accordion.Item
          {...updateItemProps}
            content={<ItemInfo/>}
            id={'item-info'}
            label={t('Item information')}
            className={{item: cn({'expanded': initiallyExpanded[0] === 'item-info'})}}
          />
        }
      </>
    )
  }

  return(
    <div className='o-grid'>
      <Helmet>
         <title>{t('Order & item information')}</title>
         <meta name="description" content={t('Order & item information page')} />
      </Helmet>
      <div className='o-grid__item c-guest-checkout_orderItem-info'>
        <Accordion initiallyExpanded={initiallyExpanded}>
          {({getItemProps}) => (
            <div>
              {renderAccordionItems(getItemProps)}
            </div>
          )}
        </Accordion>
      </div>
      <div className="o-grid__item u-1/4@desktop u-2/5@tablet u-1/1">
        <Summary
          currencyCode={shoppingRequest?.soldTo?.currencyCode}
          subtotal={cart?.summary?.subTotal}
          showEstimateMessage
        />
      </div>
    </div>
  )
}
