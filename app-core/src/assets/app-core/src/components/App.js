import React from 'react'
import FlagSymbols from '@insight/toolkit-react/lib/Flag/FlagSymbols'
import IconSymbols from '@insight/toolkit-react/lib/Icon/IconSymbols'
import ToolkitCommon from './ToolkitCommon'
import { Locale } from '@insight/toolkit-react'
import { getCurrentLocale } from '@insight/toolkit-utils/lib/helpers/localeHelpers'

export default function App() {

  const locale = getCurrentLocale("insight_current_locale", "insight_locale")

  return (
    <Locale value={{ locale }}>
      <IconSymbols />
      <FlagSymbols />
      <ToolkitCommon />
    </Locale>
  )
}
