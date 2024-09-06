import React, { useEffect, useState } from 'react'
import { isMobile, throttle } from '@insight/toolkit-utils'

export const useResponsive = (deps = []) => {
  const [isOnMobile, setIsMobile] = useState(isMobile())

  useEffect(() => {
    const onResize = throttle(() => {
      setIsMobile(isMobile())
    }, 250)
    window.addEventListener('resize', onResize)
    return () => {
      window.removeEventListener('resize', onResize)
    }
  }, deps)

  return [isOnMobile]
}

export default useResponsive
