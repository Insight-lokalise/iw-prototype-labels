import React from 'react'
import cn from 'classnames'
import PropTypes from "prop-types";
import { useDispatch, useSelector } from "react-redux";
import { Icon } from '@insight/toolkit-react'
import {
  LIST_VIEW,
  selector_userSettings,
  selector_webGroupSettings,
  setViewMode,
  TILE_VIEW,
} from "../../duck";

export default function ToggleView({ backToCatalog }) {
  const { userSettings, webGroupSettings } = useSelector(state => ({
    userSettings: selector_userSettings(state),
    webGroupSettings: selector_webGroupSettings(state),
  }))

  const dispatch = useDispatch()

  const toggleView = (view) => {
    backToCatalog()
    dispatch(setViewMode(view))
  }

  const { disableViewChange, defaultView } = webGroupSettings
  const { viewMode } = userSettings

  const mode = viewMode || defaultView

  return !disableViewChange && (
    <div className="o-grid c-cs-toggleview">
      <div className={cn('c-cs-viewMode o-grid__item', { 'is-active': mode === TILE_VIEW })} onClick={() => toggleView(TILE_VIEW)} >
        <Icon icon="tile" />
      </div>
      <div className={cn('c-cs-viewMode o-grid__item', { 'is-active': mode === LIST_VIEW })} onClick={() => toggleView(LIST_VIEW)} >
        <Icon icon="list" />
      </div>
    </div>
  )
}

ToggleView.propTypes = {
  backToCatalog: PropTypes.func
}
