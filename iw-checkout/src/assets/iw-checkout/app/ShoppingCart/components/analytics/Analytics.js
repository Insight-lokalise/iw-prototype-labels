import React, { Component } from 'react';
import { connect } from 'react-redux'

import { selector_cart } from './../../../../libs/Cart/selectors'
import { processCartGAE } from '@insight/toolkit-utils/lib/analytics';

class Analytics extends Component {
    componentDidMount() {
        const pcart = this.props.cartItems;
        processCartGAE(pcart);
    }

    render() {
        return null
    }
}

function mapStateToProps(state) {
    return {
        cartItems: selector_cart(state)
    }
}

export default connect(mapStateToProps)(Analytics)
