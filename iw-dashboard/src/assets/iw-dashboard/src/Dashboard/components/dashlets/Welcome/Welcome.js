import React, { Component } from 'react'
import PropTypes from 'prop-types'
import parse from 'react-html-parser'

import Dashlet from '../Dashlet'
import {IWLoading} from "../../../../iw-components";

const options = {
  transform: (node) => (node.type === 'tag' && node.name === 'img') ? null : undefined
}

export default class Welcome extends Component {
  componentDidMount() {
    if (!this.props.hasData) {
      this.props.getData()
    }
  }

  render() {
    const { data, hasData, title, toggleThisDashlet } = this.props
    return (
      <Dashlet
        headerLink={{ href: 'welcome', text: 'View My Company page' }}
        title={title}
        toggleThisDashlet={toggleThisDashlet}
      >
        { hasData ? (
            <div className="dashlet__welcome-container">
              {parse(data, options)}
            </div>
        ) : (
          <div className="dashlet__loading-wrapper">
            <IWLoading />
          </div>
        )}
      </Dashlet>
    )
  }
}

Welcome.propTypes = {
  data: PropTypes.string,
  getData: PropTypes.func.isRequired,
  hasData: PropTypes.bool,
  title: PropTypes.string,
  toggleThisDashlet: PropTypes.func,
}

Welcome.defaultProps = {
  data: '',
  hasData: false,
  title: 'Welcome',
  toggleThisDashlet: undefined,
}
