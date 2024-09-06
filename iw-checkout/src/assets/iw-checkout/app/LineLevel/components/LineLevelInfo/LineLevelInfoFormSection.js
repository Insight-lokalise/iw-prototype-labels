import React, { Component } from 'react'
import ReactDOM from 'react-dom'
import PropTypes from 'prop-types'
import Cart from './../../../../libs/businessContainerApps/cart/cart'
import ScrollIntoView from '../../../../libs/routes/ScrollIntoView'

export class LineLevelInfoFormSection extends Component {
  componentDidMount() {
    const isEditable = !this.props.isReadOnly && !this.props.isCollapsed
    /* scroll into view when component finished loading */
    if (isEditable) {
      const thisComponent = ReactDOM.findDOMNode(this)
      thisComponent && ScrollIntoView(thisComponent, -140)
    }
  }

  render() {
    return (
      <div>
        <Cart className="cart c-line-level-cart" showLineLevelForm history={this.props.history} />
      </div>
    )
  }
}

export default LineLevelInfoFormSection

LineLevelInfoFormSection.propTypes = {
  history: PropTypes.object.isRequired,
  isReadOnly: PropTypes.bool.isRequired,
  isCollapsed: PropTypes.bool.isRequired,
}
