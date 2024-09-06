import React, { Component } from 'react'
import PropTypes from 'prop-types'

export default class ImpactContent extends Component {
    render() {
        return (
            <div className='c-impactcontent'>{this.props.children}</div>
        )
    }
}
ImpactContent.propTypes = {
    children: PropTypes.node.isRequired
}
