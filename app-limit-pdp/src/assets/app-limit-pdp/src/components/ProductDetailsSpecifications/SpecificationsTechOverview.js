import React, { useContext, useState, useEffect } from 'react'
import { useHistory } from 'react-router-dom'
import { Button } from '@insight/toolkit-react'
import { t, isMobile, throttle } from '@insight/toolkit-utils'
import { PDPContext } from '../../context'
import { UIContext } from '../../shared/UIContext/UIContext'

export const SpecificationsTechOverview = () => {
  const { product } = useContext(PDPContext)
  const { scrollIntoView } = useContext(UIContext)
  const [isOnMobile, setIsMobile] = useState(isMobile())
  const history = useHistory()

  useEffect(() => {
    const onResize = throttle(() => {
      setIsMobile(isMobile())
    }, 250)
    window.addEventListener('resize', onResize)
    return () => {
      window.removeEventListener('resize', onResize)
    }
  }, [])

  return (
    <section className="c-product-specifications__tech-overview">
      <strong>{t('Tech overview')}</strong>
      <div>{product.descriptions?.longDescription}</div>
    </section>
  )
}

export default SpecificationsTechOverview
