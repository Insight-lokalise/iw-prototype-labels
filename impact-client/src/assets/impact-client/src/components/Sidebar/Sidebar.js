import React, { Component } from 'react'
import PropTypes from 'prop-types'

export default class Sidebar extends Component {
    render() {
        return (
            <div className='c-sidebar'>{this.props.children}</div>
        )
    }
}
Sidebar.propTypes = {
    children: PropTypes.node.isRequired
}
