import React from 'react'
import PropTypes from 'prop-types'
import Select from 'react-select'
import cn from 'classnames'
import { IWHelpIcon } from './../../../../libs/iw-components'
import { t } from '@insight/toolkit-utils/lib/labels'

export default class FavoritesDropdown extends React.PureComponent {
    render() {
        const {
            favorites,
            selectedFavorite,
            setSelectedFavorite,
            hideLabel,
            disabled,
            clearable,
            placeholder,
        } = this.props
        return (
                    <section>
                        <div className={cn({ hide: hideLabel }, 'row expanded collapse row__gutter--tiny align-middle')}>
                            <div className="column">
                                <label htmlFor="iw-checkout__cart-favorite-address-dropdown" className='form__label'>
                                    {t('Favorite addresses:')}
                                </label>
                            </div>
                            <div className="column shrink">
                                <IWHelpIcon tooltip={t('Select the stored address (if permission allows) to create a favorite.')}/>
                            </div>
                        </div>
                        <Select
                            className="Select__carrier-account"
                            value={selectedFavorite}
                            onChange={setSelectedFavorite}
                            options={favorites}
                            searchable={favorites.length > 1}
                            placeholder={t(placeholder)}
                            noResultsText={t('Address not found')}
                            clearable={clearable}
                            autoBlur
                            id="iw-checkout__cart-favorite-address-dropdown"
                            disabled={favorites.length === 0 || disabled }
                        />
                    </section>
        )
    }
}

FavoritesDropdown.defaultProps = {
    hideLabel: false,
    disabled: false,
    clearable: false,
    searchable: true,
    placeholder: 'Select a favorite',
}

FavoritesDropdown.propTypes = {
    value: PropTypes.object,
    onChange: PropTypes.func,
    options: PropTypes.array,
    searchable: PropTypes.bool.isRequired,
    placeholder: PropTypes.string.isRequired,
    clearable: PropTypes.bool.isRequired,
    disabled: PropTypes.bool.isRequired,
}

