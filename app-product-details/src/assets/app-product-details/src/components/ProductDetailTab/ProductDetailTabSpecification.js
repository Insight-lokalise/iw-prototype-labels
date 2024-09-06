import React, {
  Fragment,
  useContext,
  useLayoutEffect,
  useState,
  useEffect,
  useRef,
} from 'react'
import { Button } from '@insight/toolkit-react'
import { t, isMobile, throttle } from '@insight/toolkit-utils'
import { PDPContext } from '../../context'
import { UIContext } from '../../shared/UIContext/UIContext'

export const ProductDetailTabSpecification = () => {
  const { specifications } = useContext(PDPContext)
  const { scrollIntoView } = useContext(UIContext)
  const [isOnMobile, setIsMobile] = useState(isMobile())
  const [expanded, setExpanded] = useState(false)

  // Calculate the total number of specifications
  const totalSpecs = specifications.reduce(
    (total, { details = [] }) => total + details.length,
    specifications.length
  )
  const limit = 15
  // Total count of rendered rows
  let rows = 0

  useEffect(() => {
    const onResize = throttle(() => {
      setIsMobile(isMobile())
    }, 250)
    window.addEventListener('resize', onResize)
    return () => {
      window.removeEventListener('resize', onResize)
    }
  }, [])

  // Used to prevent scrolling into view on initial render
  const initialRender = useRef(true)
  useLayoutEffect(() => {
    // Update ref since component has rendered
    if (initialRender.current) {
      initialRender.current = false
      return
    }
    // Scroll tabs into view when collapsed
    if (!expanded) {
      if (isOnMobile) {
        scrollIntoView('tab-specifications')
        return
      }
      scrollIntoView('tabs')
    }
  }, [expanded])

  const renderSpecificationDetails = (details) => {
    if (!details?.length) return null

    return details.map(({ label, value }) => {
      rows += 1
      if (!expanded && rows > limit) return null
      return (
        <div
          key={label}
          className="c-product-tabs__specification__group__table__row o-grid"
        >
          <div className="o-grid__item u-1/2">{label}</div>
          <div className="o-grid__item u-1/2">{value}</div>
        </div>
      )
    })
  }
  const renderSpecificationsGroups = () => {
    if (!specifications?.length) return <h5>{t('No specifications found')}</h5>
    return specifications.map(({ label, details }) => {
      rows += 1
      // Return if rows rendered is greater than the limit(headers included) / specs is not expanded
      if (!expanded && rows > limit) return null
      return (
        <section
          className="c-product-tabs__specification__group o-grid__item u-1/1"
          key={label}
        >
          <h5 className="c-product-tabs__specification__group__label">
            {label}
          </h5>
          <div className="c-product-tabs__specification__group__table">
            {renderSpecificationDetails(details)}
          </div>
        </section>
      )
    })
  }
  const renderViewMoreSpec = () => {
    // Hide if total specifications is less than limit
    if (totalSpecs < limit) return null
    return (
      <div className="o-grid o-grid--justify-center">
        <div className="o-grid__item o-grid__item--shrink">
          <Button
            icon={expanded ? 'remove' : 'add'}
            onClick={() => setExpanded(!expanded)}
            color="link"
          >
            {t(`View ${expanded ? 'less' : 'more'} specifications`)}
          </Button>
        </div>
      </div>
    )
  }
  return (
    <Fragment>
      <div className="c-product-tabs__specification">
        <h5 className="c-product-tabs__specification__title">
          {t('Specifications')}
        </h5>
        <div className="c-product-tabs__specification__groups o-grid">
          {renderSpecificationsGroups()}
        </div>
      </div>
      {renderViewMoreSpec()}
    </Fragment>
  )
}

export default ProductDetailTabSpecification
