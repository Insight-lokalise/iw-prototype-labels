import React, { useEffect, useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { t } from '@insight/toolkit-utils'
import { Accordion, Icon, Summary } from '@insight/toolkit-react'
import { getCurrentLocale } from '@insight/toolkit-utils/lib/helpers'
import cn from 'classnames'
import {
  SHIPPING_ADDRESS,
  SHIPPING_OPTIONS,
  BILLING_ADDRESS,
  shoppingInfoSequence,
} from '@constants'

import ShippingAddress from './ShippingAddress/ShippingAddress'
import ShippingOptions from './ShippingOptions/ShippingOptions'
import BillingAddress from './BillingAddress/BillingAddress'

import {
  selector_address,
  selector_hasShippableItems,
  selector_shoppingRequest,
  selector_shoppingRequestSummary,
} from '../../../src/state/slices/selectors/ShoppingReqeustSelector'
import { Helmet } from 'react-helmet'
import { fetchTaxAndEWRFee } from '../../api'
import { save as saveShoppingRequest } from '../../state/slices/shoppingRequestSlice'
import { ADDRESS_TYPE } from '../../constants'
import { fetchTaxAndEWRFeeForTheCartItems } from './helpers'

export default function ShoppingInfo() {
  const [initiallyExpanded, setInitiallyExpanded] = useState([SHIPPING_ADDRESS])
  const shoppingRequest = useSelector(selector_shoppingRequest)
  const summary = useSelector(selector_shoppingRequestSummary)
  const [isShippingAddressCreated, setIsShippingAddressCreated] =
    useState(false)
  const hasShippableItems = useSelector(selector_hasShippableItems)
  const shippingAddress = useSelector((state) =>
    selector_address(state, ADDRESS_TYPE.SHIPPING)
  )
  const [isAddressCreation, setIsAddressCreation] = useState(Object.keys(shippingAddress).length === 0)
  const dispatch = useDispatch()

  const locale = getCurrentLocale('insight_current_locale')
  const countryCode = locale.split('_')[1].toUpperCase()

  const toggleAccordion = (id) => {
    setInitiallyExpanded([id])
  }

  useEffect(() => {
    let section = location.hash.replace('#', '')
    if (section.length > 0) {
      setInitiallyExpanded([section])
    }

    if (Object.keys(shippingAddress).length) {
      _fetchTaxAndEWRFeeForTheCartItems();
    }
  }, [])

  const _fetchTaxAndEWRFeeForTheCartItems = async () => {
    const shoppingRequestData =  await fetchTaxAndEWRFeeForTheCartItems(shoppingRequest)
    shoppingRequestData && dispatch(saveShoppingRequest(shoppingRequestData));
  }

  const renderAccordionItems = (getItemProps) => {
    const updateItemProps = getItemProps()
    // disable toggle functionality in accordion item
    updateItemProps.accordion.toggle = () => {}
    return (
      <>
        <Helmet>
          <title>{t('Shipping & billing')}</title>
          <meta name="description" content={t('Shipping & billing page')} />
        </Helmet>
        <Accordion.Item
          {...updateItemProps}
          onToggle={() => {}}
          content={
            <ShippingAddress
              toggleAccordion={toggleAccordion}
              id={SHIPPING_ADDRESS}
              countryCode={countryCode}
              setIsAddressCreation={setIsAddressCreation}
              isAddressCreation={isAddressCreation}
              setIsShippingAddressCreated={setIsShippingAddressCreated}
              initiallyExpanded={initiallyExpanded}
            />
          }
          id={SHIPPING_ADDRESS}
          label={t('Shipping address')}
          extraAction={
            shoppingInfoSequence[initiallyExpanded] >
              shoppingInfoSequence[SHIPPING_ADDRESS] && (
              <Icon
                icon="create"
                onClick={() => toggleAccordion(SHIPPING_ADDRESS)}
              />
            )
          }
          className={{
            item: cn({ expanded: initiallyExpanded[0] === SHIPPING_ADDRESS }),
          }}
        />
        {hasShippableItems && (
          <Accordion.Item
            {...updateItemProps}
            onToggle={() => {}}
            content={
              <ShippingOptions
                toggleAccordion={toggleAccordion}
                id={SHIPPING_OPTIONS}
              />
            }
            id={SHIPPING_OPTIONS}
            label={t('Shipping options')}
            extraAction={
              shoppingInfoSequence[initiallyExpanded] >
                shoppingInfoSequence[SHIPPING_OPTIONS] && (
                <Icon
                  icon="create"
                  onClick={() => toggleAccordion(SHIPPING_OPTIONS)}
                />
              )
            }
            className={{
              item: cn({ expanded: initiallyExpanded[0] === SHIPPING_OPTIONS }),
            }}
          />
        )}
        <Accordion.Item
          {...updateItemProps}
          content={
            <BillingAddress
              toggleAccordion={toggleAccordion}
              id={BILLING_ADDRESS}
              storedBillingAddress={{}}
              countryCode={countryCode}
              initiallyExpanded={initiallyExpanded}
            />
          }
          id={BILLING_ADDRESS}
          label={t('Billing address')}
          extraAction={
            shoppingInfoSequence[initiallyExpanded] >
              shoppingInfoSequence[BILLING_ADDRESS] && (
              <Icon
                icon="create"
                onClick={() => toggleAccordion(BILLING_ADDRESS)}
              />
            )
          }
          className={{
            item: cn({ expanded: initiallyExpanded[0] === BILLING_ADDRESS }),
          }}
        />
      </>
    )
  }
  const isInShippingAddress =
    initiallyExpanded[0] === SHIPPING_ADDRESS ||
    initiallyExpanded[0] === SHIPPING_OPTIONS
  return (
    <div className="o-grid">
      <div className="o-grid__item c-guest-checkout_shopping-info">
        <Accordion initiallyExpanded={initiallyExpanded}>
          {({ getItemProps }) => (
            <div>{renderAccordionItems(getItemProps)}</div>
          )}
        </Accordion>
      </div>
      <div className="o-grid__item u-1/4@desktop u-2/5@tablet u-1/1">
        <Summary
          subtotal={summary?.subTotal}
          showEstimateDash={isInShippingAddress}
          estimatedShipping={summary?.shippingCost}
          estimatedTax={summary?.taxCost}
          ewrFee={summary?.ewrFee}
          total={summary?.totalCost}
          currencyCode={shoppingRequest?.soldTo?.currency}
        />
      </div>
    </div>
  )
}
