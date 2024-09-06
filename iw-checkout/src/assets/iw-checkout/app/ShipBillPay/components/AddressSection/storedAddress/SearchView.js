import React, {Component} from 'react'
import PropTypes from 'prop-types'
import { t } from '@insight/toolkit-utils/lib/labels'
import { IWButton } from './../../../../../libs/iw-components'

class SearchView extends Component {
    constructor() {
        super()
        this.state = {
            message: {},
        }
    }

    componentWillUnmount() {
        this.props.setSearchKey('')
    }

    searchAddress = () => {
        this.setState({
            message: {},
        })
        const searchKey = this.refs.searchKey.value
        this.props.setSearchKey(searchKey)
    };

    render() {
        const searchPlaceholder = t('Search for account name, number or address')
        return (
            <div className="row">
                <div className="column small-12">
                    <div className="input-group">
                        <input ref="searchKey" type="text" className="input-group-field" placeholder={searchPlaceholder}
                               onKeyPress={(event) => event.which === 13 ? this.searchAddress.call(this) : true }
                               id="storedAddress-search" />
                        <div className="input-group-button">
                            <IWButton type="button"
                                      onClick={ this.searchAddress }>
                                <span className="ion-search"><span className="show-for-sr">{searchPlaceholder}</span></span>
                            </IWButton>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}


export default SearchView

SearchView.propTypes = {
    getStoredAddresses: PropTypes.func.isRequired,
    setSearchKey: PropTypes.func,
}
