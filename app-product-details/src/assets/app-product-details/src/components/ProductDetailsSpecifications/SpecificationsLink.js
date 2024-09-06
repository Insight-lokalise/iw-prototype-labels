import React, { useContext, useState, useEffect } from 'react'
import { Button, Icon } from '@insight/toolkit-react'
import { t, isMobile, throttle } from '@insight/toolkit-utils'
import addToPersonalProducts from '../../api/addToPersonalProducts'
import { PDPContext } from '../../context'

export const SpecificationsLink = ({ contractID }) => {
  const { product, personalProductLists } = useContext(PDPContext)
  const [isOnMobile, setIsMobile] = useState(isMobile())
  const [addToPersonalProductsStatus, setAddToPersonalProductsStatus] = useState(false)

  const { materialId } = product
  const isAddedToPPL = personalProductLists?.includes(materialId)

  useEffect(() => {
    const onResize = throttle(() => {
      setIsMobile(isMobile())
    }, 250)
    window.addEventListener('resize', onResize)
    return () => {
      window.removeEventListener('resize', onResize)
    }
  }, [])

  const handleAddToPersonalProducts = async (materialId) => {
    const res = await addToPersonalProducts({ materialId, contract: contractID })
    if(!!res) setAddToPersonalProductsStatus(true)
  }

  return (
    <section className="c-product-specifications__link">
      <div>
        {
          (addToPersonalProductsStatus || isAddedToPPL) ? 
          (
            <div className='o-grid o-grid--center'>
              <Icon icon="checkmark-circled" className="c-product-specifications__link-success-icon" />
              <div className="c-product-specifications__link-success">{t('Added to personal product list')}</div>
              <Button
                className="c-product-specifications__anchor"
                color="inline-link"
                href='/insightweb/search/personalProducts'
              >
                {t('View list')}
              </Button>
            </div>
          )
          :(
            <div>
              <Icon icon="bookmark" />
              <Button
                className="c-product-specifications__anchor"
                color="inline-link"
                onClick={() => {
                  handleAddToPersonalProducts(materialId)
                }}
              >
                {t('Add to personal product list')}
              </Button>
            </div>)
        }
      </div>
    </section>
  )
}


