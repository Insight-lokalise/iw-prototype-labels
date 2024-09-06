import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { IWAnchor } from '../../../../../libs/iw-components'
import { Loading } from '@insight/toolkit-react'
import { getSortedUrl } from '../../../../../models/OrderDetails/OrderDetails'

export default class SortedLink extends Component {
    constructor(props) {
      super(props)
      this.state = {
        isLoading: true,
        sortedUrl: ''
      }
    }

    componentDidMount() {
        const { consignmentNumber, salesAreaId } = this.props

        getSortedUrl(consignmentNumber, salesAreaId).then(res => {
            this.setState({ isLoading: false, sortedUrl: res.data })
        }).catch((e) => {
            console.error('Unable to fetch sorted url.')
        })
    }

    render () {
        const { linkText } = this.props

        {this.state.isLoading && <Loading />}

        return (
            <IWAnchor className="orders__link" href={this.state.sortedUrl} target="_blank" rel="noopener noreferrer">
              <span className="orders__link-text">{linkText}</span>
            </IWAnchor>
          )
    }
}

SortedLink.propTypes = {
    linkText: PropTypes.string.isRequired,
    consignmentNumber: PropTypes.string.isRequired,
    salesAreaId: PropTypes.number.isRequired
}
