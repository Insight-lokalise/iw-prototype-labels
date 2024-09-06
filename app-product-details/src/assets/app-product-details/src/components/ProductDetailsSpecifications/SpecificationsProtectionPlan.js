import React, { useContext, useEffect, useState } from 'react'
import PropTypes from 'prop-types'
import { useHistory } from 'react-router-dom'
import { Button, Currency, Field } from '@insight/toolkit-react'
import { t, isMobile, throttle } from '@insight/toolkit-utils'
import { UIContext } from '../../shared/UIContext/UIContext'

export const SpecificationsProtectionPlan = ({
  addingToCart,
  protectPurchase,
  setProtectPurchase,
  selectedProtectionPlan,
  selectedProtectionPrice,
  isIPSUserWithContract,
  isLoggedIn,
}) => {
  const { scrollIntoView } = useContext(UIContext)
  const [isOnMobile, setIsMobile] = useState(isMobile())
  const history = useHistory()
  const isStockAndPriceDisabled = isLoggedIn ? Insight?.webGroupPermissions?.includes('disable_stock_and_price_display') : false
  const finalPrice = isIPSUserWithContract? selectedProtectionPrice?.webPrice: selectedProtectionPlan.price?.price
  const currency = isIPSUserWithContract? selectedProtectionPrice?.currency: selectedProtectionPlan.price?.currency
  useEffect(() => {
    const onResize = throttle(() => {
      setIsMobile(isMobile())
    }, 250)
    window.addEventListener('resize', onResize)
    return () => {
      window.removeEventListener('resize', onResize)
    }
  }, [])

  if (!selectedProtectionPlan) return null
  const planName = selectedProtectionPlan.description ?? selectedProtectionPlan.name;
  const priceWithCurrency = !isStockAndPriceDisabled && `${currency} ${finalPrice}`;
  const protectPurchaseAriaLabel = `${t('Protect your purchase by adding')} ${planName} ${priceWithCurrency}`;

  return (
    <section className="c-product-specifications__protection o-grid">
      <div className="o-grid__item u-1/1">
        <strong>{t('Protect your purchase')}</strong>
      </div>
      <div className="o-grid__item u-1/1">
        <div className="c-product-specifications__protection__item" aria-label={protectPurchaseAriaLabel}>
          <Field
            fieldComponent="Checkbox"
            name="protectYourPurchase"
            onChange={() => setProtectPurchase(!protectPurchase)}
            checked={protectPurchase}
            disabled={addingToCart}
          />
          <span>{`${t('Add')} - ${planName}`}</span>
          { !isStockAndPriceDisabled  && 
            <>
              <span className="c-product-specifications__protection__item__divider">
                |
              </span>
                <span>
                  <Currency
                    value={finalPrice}
                    currencyCode={currency}
                  />
                </span>
            </>
          }
        </div>
      </div>
      <div className="o-grid__item u-1/1">
        <Button
          className="c-product-specifications__anchor"
          color="inline-link"
          onClick={() => {
            if (isOnMobile) {
              scrollIntoView('tab-protection')
              return
            }
            scrollIntoView('tabs')
            history.push({
              hash: '#tab-protection',
            })
          }}
        >
          {t('View all protection plans')}
        </Button>
      </div>
    </section>
  )
}

SpecificationsProtectionPlan.propTypes = {
  addingToCart: PropTypes.bool.isRequired,
  protectPurchase: PropTypes.bool.isRequired,
  setProtectPurchase: PropTypes.func.isRequired,
  selectedProtectionPlan: PropTypes.oneOfType([
    PropTypes.object,
    PropTypes.bool,
  ]),
}

export default SpecificationsProtectionPlan
