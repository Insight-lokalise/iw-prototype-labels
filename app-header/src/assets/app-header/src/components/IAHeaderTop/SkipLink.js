import React, { useContext, useEffect, useState } from 'react'
import { t } from 'api'
import Header from '@insight/toolkit-react/lib/Header/Header'
import IAHeaderContext from '../../context/IAHeaderContext'

export default function SkipLink({isCES}) {
  const {
    headerInfo: { isLoggedIn },
  } = useContext(IAHeaderContext)

  const [skipToLocation, setSkipToLocation] = useState((isLoggedIn && !isCES) ? "#opens-account-tools" : "#header-end");

  useEffect( () => {
    if(!document.querySelector('#opens-account-tools')){
      setSkipToLocation("#header-end");
    } else {
      setSkipToLocation("#opens-account-tools");
    }
  }, [])

  return (
    <Header.Top.Item href={skipToLocation} btnClassName="u-hide-visually  u-hide-visually--focusable">
      {t('Skip to content')}
    </Header.Top.Item>
  )
}
