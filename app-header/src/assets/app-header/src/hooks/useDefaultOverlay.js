import React, {useCallback, useContext} from "react";
import IAHeaderContext from "../context/IAHeaderContext";
import HeaderContext from '@insight/toolkit-react/lib/Header/HeaderContext'

export default function useDefaultOverlay() {
  const { setActiveFlyout } = useContext(HeaderContext)
  const { setDefaultOverlay } = useContext(IAHeaderContext)

  const onOpenStateChange = useCallback((isOpen) => {
    setDefaultOverlay(!isOpen)
    setActiveFlyout(isOpen)
  }, [])

  return {
    setDefaultOverlay,
    onOpenStateChange
  }
}
