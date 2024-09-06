import React, { Component } from 'react'
import PropTypes from 'prop-types'
import cn from 'classnames'
import Icon from '../Icon/Icon'
import Button from '../Button/Button'

import { BUTTON_COLORS, BUTTON_SIZES } from '../Button/classes'

/**
 * A Dropdown toggles a contextual overlay for displaying a list of links. It
 * is made up of a button and a menu. When the button is clicked (or tabbed to
 * with the keyboard and the enter key is pressed), the menu appears.
 *
 * The menu displays a list of links or buttons (made to look like links).
 *
 * To close the menu a user can either click on the button again, tab away and
 * focus on another element, or click anywhere outside of the component itself.
 */
export default class Dropdown extends Component {
  constructor(props){
    super(props);

    this.toggleDropdownMenu = this.toggleDropdownMenu.bind(this);
    this.handleOutsideClick = this.handleOutsideClick.bind(this);

    this.state = {isOpen: false};
  }

  toggleDropdownMenu() {
    const eventList = ["mouseup", "keyup"];
    for(event of eventList) {
      if (!this.state.isOpen) {
        document.addEventListener(event, this.handleOutsideClick, false);
      } else {
        document.removeEventListener(event, this.handleOutsideClick, false);
      }
    }

    this.setState(prevState => ({
      isOpen: !prevState.isOpen
    }));
  }

  handleOutsideClick(e) {
    // ignore clicks on the component itself
    if (this.node.contains(e.target)) {
      return;
    }

    this.toggleDropdownMenu();
  }

  render() {
    const dropdownClasses = cn('c-dropdown', {'is-open': this.state.isOpen});
    const buttonClasses = cn('c-dropdown__button', {'is-active': this.state.isOpen});

    const { children, color, id, position, size, text } = this.props;

    return (
      <div className={dropdownClasses} ref={node => { this.node = node; }}>
        <Button color={color} size={size} className={buttonClasses} id={id} data-toggle="dropdown" aria-haspopup="true" aria-expanded={this.state.isOpen} onClick={this.toggleDropdownMenu}>
          {text}
          <Icon className="c-button__icon  c-button__icon--right" icon="arrow-down" />
        </Button>
        <div className={cn('c-dropdown__menu', `c-dropdown__menu--${position}`)} aria-labelledby={id}>
          {children}
        </div>
      </div>
    )
  }

}

Dropdown.propTypes = {
  children: PropTypes.node,
  color: PropTypes.oneOf(BUTTON_COLORS),
  id: PropTypes.string.isRequired,
  position: PropTypes.oneOf(['left', 'right']).isRequired,
  size: PropTypes.oneOf(BUTTON_SIZES),
  text: PropTypes.string.isRequired,
}

Dropdown.defaultProps = {
  children: null,
  color: null,
  size: null,
}
