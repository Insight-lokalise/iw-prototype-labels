import React, { Component } from 'react'
import PropTypes from 'prop-types'
import cn from 'classnames'
import { IWButton } from '../../../iw-components'
import { t } from '@insight/toolkit-utils/lib/labels'

class SelectorRow extends Component {
  constructor(props) {
    super(props)
    this.state = {
      text: props.dashletName,
    }
    this.changeText = this.changeText.bind(this)
  }
  componentDidUpdate(prevProps) {
    const { active, activeFavorite, tabName } = prevProps
    if (this.props.active !== active && this.props.active) this.changeText(`Added to ${tabName}`)
    else if (this.props.active !== active && !this.props.active) this.changeText(`Removed from ${tabName}`)
    else if (this.props.activeFavorite !== activeFavorite && this.props.activeFavorite)
      this.changeText('Added to Favorites')
    else if (this.props.activeFavorite !== activeFavorite && !this.props.activeFavorite)
      this.changeText('Removed from Favorites')
  }

  changeText(text) {
    const { dashletName } = this.props
    this.setState({ text }, () => {
      window.setTimeout(() => this.setState({ text: dashletName }), 2000)
    })
  }

  render() {
    const { dashletId, tabName, dashletName, toggleDashlet, active, activeFavorite } = this.props
    const { text } = this.state
    const addFavText = `Add ${dashletName} to favorites`
    const removeFavText = `Remove ${dashletName} from favorites`

    return (
      <div className="row align-middle dashboard__selector-dashlet" key={dashletId}>
        <label className="dashboard__selector-label column small-9">
          <input type="checkbox" value={dashletId} checked={active} onChange={() => toggleDashlet(dashletId, tabName)} />
          {t(text)}
        </label>
        <div className="column small-3 text-center">
          <IWButton
            className={cn('clear no-margin-bot dashboard__btn dashboard__btn--fav', {
              'ion-ios-heart': activeFavorite,
              'ion-ios-heart-outline': !activeFavorite,
            })}
            onClick={() => toggleDashlet(dashletId, 'Favorites')}
            aria-label={activeFavorite ? t(removeFavText) : t(addFavText)}
            type="button"
          />
        </div>
      </div>
    )
  }
}

SelectorRow.propTypes = {
  active: PropTypes.bool,
  activeFavorite: PropTypes.bool,
  dashletId: PropTypes.string.isRequired,
  dashletName: PropTypes.string.isRequired,
  tabName: PropTypes.string.isRequired,
  toggleDashlet: PropTypes.func.isRequired,
}

SelectorRow.defaultProps = {
  active: false,
  activeFavorite: false,
}

export default SelectorRow
