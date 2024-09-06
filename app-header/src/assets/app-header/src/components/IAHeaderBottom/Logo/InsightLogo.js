import React, { useContext } from 'react'

import Header from '@insight/toolkit-react/lib/Header/Header'

import { getHomeURL, t } from 'api'

import IAHeaderContext from '../../../context/IAHeaderContext'
import { MASTHEAD_ICON_TITLES_HOMEPAGE } from '../../../api/common/constants'

export default function InsightLogo() {
  const { headerInfo } = useContext(IAHeaderContext)
  const homeURL = getHomeURL(headerInfo)
  const isPublicSector = headerInfo.isSEWPUser || headerInfo.isIPSUser
  const title = MASTHEAD_ICON_TITLES_HOMEPAGE  

  return (
    <Header.Logo href={homeURL} isPublicSector={isPublicSector} title={t(title)}/>
  )
}
