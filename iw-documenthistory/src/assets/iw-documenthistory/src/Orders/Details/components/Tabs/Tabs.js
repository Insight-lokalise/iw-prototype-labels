import React, { Component, Children } from 'react'
import PropTypes from 'prop-types'
import cn from 'classnames'

/**
 * Renders a list of tabs.
 * Every tab has the ability of being clicked.
 * Tab shows its respective content when clicked
 * @param {number} defaultActiveKey
 */
export default class Tabs extends Component {
  constructor(props) {
    super(props)
    this.state = {
      defaultActiveKey: props.defaultActiveKey,
      visibleTabs: props.children.filter(children => !!children),
    }
  }

  /**
   * Updates the selected tab when clicking one of them.
   * @param {number} index
   */
  handleClick = (index) => {
    this.setState({
      defaultActiveKey: index,
    })
  }

  /**
   * Creates tab labels based on child props. It gives
   * an "tabs__label--active" class to the selected tab
   * @param {React Element} child
   * @param {number} index
   */
  createTabLabels = (child, index) => {
    return (
      <a
        className={cn('order-details__tab', { 'order-details__tab--active': this.state.defaultActiveKey === index })}
        key={index}
        onClick={() => this.handleClick(index)}
      >
        {child.props.label}
      </a>
    )
  }

  /**
   * Renders the content of the selected or defaultActiveKey tab.
   */
  renderTabContent() {
    return (
      <div className="order-details__tab-content">
        {Children.toArray(this.state.visibleTabs)[this.state.defaultActiveKey]}
      </div>
    )
  }

  /**
   * Renders the list of tabs with it's respective lable (Title)
   */
  renderTitles() {
    return (
      <nav className="order-details__tabs hide-for-print">
        {Children.map(this.state.visibleTabs, this.createTabLabels)}
      </nav>
    )
  }

  render() {
    return (
      <div>
        {this.renderTitles()}
        {this.renderTabContent()}
      </div>
    )
  }
}

Tabs.propTypes = {
  defaultActiveKey: PropTypes.number.isRequired,
  children: PropTypes.arrayOf(PropTypes.element).isRequired,
}
