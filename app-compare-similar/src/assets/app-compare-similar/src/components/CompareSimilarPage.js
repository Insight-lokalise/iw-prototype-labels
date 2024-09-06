import React, { useEffect, useState } from 'react'
import { Message } from '@insight/toolkit-react'
import { t, isDesktop, throttle } from '@insight/toolkit-utils'
import { CompareBreadcrumb } from './CompareBreadcrumb'
import { CompareHeader } from './CompareHeader'
import { CompareProvider } from '../context/compare'
import CompareProducts from './CompareProducts'

export const CompareSimilarPage = () => {
  const [isOnDesktop, setIsOnDesktop] = useState(isDesktop())

  useEffect(() => {
    const onResize = throttle(() => {
      setIsOnDesktop(isDesktop())
    }, 250)
    window.addEventListener('resize', onResize)
    return () => {
      window.removeEventListener('resize', onResize)
    }
  }, [])

  return (
    <div className="c-compare-similar">
      <CompareProvider>
        <div className="o-wrapper">
          <CompareBreadcrumb />
          <CompareHeader />
          {isOnDesktop ? (
            <CompareProducts />
          ) : (
            <div className="c-compare-similar__unavailable">
              <Message>
                {t('Product compare is unavailable on mobile at this time.')}
              </Message>
            </div>
          )}
        </div>
      </CompareProvider>
    </div>
  )
}

export default CompareSimilarPage
