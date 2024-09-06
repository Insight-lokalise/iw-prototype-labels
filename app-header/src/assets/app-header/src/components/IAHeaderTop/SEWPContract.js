import React, { useContext } from 'react'
import Header from '@insight/toolkit-react/lib/Header/Header'

import { getSEWPHomeURL, t } from 'api'
import IAHeaderContext from '../../context/IAHeaderContext'

export default function SEWPContract() {
  const {
    headerInfo: { isSEWPUser },
  } = useContext(IAHeaderContext)

  return isSEWPUser && <Header.Top.Item href={getSEWPHomeURL()}>{t('SEWP Contract')}</Header.Top.Item>
}

SEWPContract.propTypes = {}
