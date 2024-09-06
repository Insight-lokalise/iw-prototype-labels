import React, { useRef, useEffect } from 'react'
import PropTypes from 'prop-types'

/**
 * Hook that alerts clicks outside of the passed ref
 */
function useOutsideAlerter(ref, cb) {
  useEffect(() => {
    /**
     * If clicked on outside of element
     */
    function handleClickOutside(event) {
      if (ref.current && !ref.current.contains(event.target)) {
        cb()
      }
    }
    document.documentElement.classList?.add('overflow-y-hidden')
    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.documentElement.classList?.remove('overflow-y-hidden')
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [cb, ref])
}

function ClickOutsideWrapper({ children, className, onClickOutside }) {
  const wrapperRef = useRef(null)
  useOutsideAlerter(wrapperRef, onClickOutside)

  return (
    <div className={className} ref={wrapperRef}>
      {children}
    </div>
  )
}

ClickOutsideWrapper.propTypes = {
  children: PropTypes.element.isRequired,
}

export default ClickOutsideWrapper
