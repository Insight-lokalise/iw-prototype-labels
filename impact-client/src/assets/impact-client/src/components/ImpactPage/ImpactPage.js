import React, { Component } from 'react'
import PropTypes from 'prop-types'

export default class ImpactPage extends Component {
    render() {
        return (
            <div className='perfui-page'>{this.props.children}</div>
        )
    }
}
ImpactPage.propTypes = {
    children: PropTypes.node.isRequired
}