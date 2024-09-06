import PropTypes from 'prop-types'
import React, {Component} from 'react'
import cn from 'classnames';
// import Button from '../Button/Button'
// import Icon from '../Icon/Icon'

import { Button, Icon } from '@insight/toolkit-react'
import { generateClassesFromMap } from '@insight/toolkit-utils';
import { QUANTITY_SELECTOR_SIZES, QUANTITY_SELECTOR_CLASS_MAP } from '@insight/toolkit-react/lib/QuantitySelector/classes';

export default class QuantitySelector extends Component {

  state = {
    displayValue: `${this.props.value}`,
    value: this.props.value
  }

  static getDerivedStateFromProps = (nextProps, prevState) => {
    if(nextProps.value!==prevState.value){
      return {
        displayValue: `${nextProps.value}`,
        value: nextProps.value
      };
    }
    return null
  }

  changeValue = (value) => {
    if (value !== '') {
      if (value >= this.props.min && value <= this.props.max) {
        this.props.onChange(Number(value))
        this.setState({displayValue: value})
      }
    } else {
      this.setState({displayValue: ''})
    }
  }

  decreaseValue = () => {
    this.changeValue(Number(this.props.value) - 1)
  }

  incrementValue = () => {
    this.changeValue(Number(this.props.value) + 1)
  }

  handleBlur = () => {
    this.setState({displayValue: `${this.props.value}`})
  }

  handleChange = (event) => {
    this.changeValue(event.target.value)
  }

  handleKeyPress = (event) => {
    if(event.key === '-'){
      event.preventDefault()

    }
  }

  render() {
    const derivedClasses = generateClassesFromMap(
      { size: this.props.size },
      QUANTITY_SELECTOR_CLASS_MAP
    );

    const classes = cn('c-quantity-selector', derivedClasses, this.props.className);

    return (
      <div className={classes}>
        <label className="c-quantity-selector__label u-hide-visually" htmlFor={this.props.id}>Select quantity</label>
        <input
          autoComplete="off"
          className="c-quantity-selector__input"
          id={this.props.id}
          min={this.props.min}
          max={this.props.max}
          onBlur={this.handleBlur}
          onKeyPress={this.handleKeyPress}
          onChange={this.handleChange}
          type="number"
          value={this.state.displayValue}
        />
        <div className="c-quantity-selector__controls">
          <Button className="c-quantity-selector__button" onClick={this.incrementValue}>
            <Icon className="c-quantity-selector__icon" icon="arrow-up" title="Increase quantity" />
          </Button>
          <Button className="c-quantity-selector__button" onClick={this.decreaseValue}>
            <Icon className="c-quantity-selector__icon" icon="arrow-down" title="Decrease quantity" />
          </Button>
        </div>
      </div>
    )
  }
}

QuantitySelector.propTypes = {
  className: PropTypes.string,
  id: PropTypes.string.isRequired,
  max: PropTypes.number,
  min: PropTypes.number,
  onChange: PropTypes.func.isRequired,
  size: PropTypes.oneOf(QUANTITY_SELECTOR_SIZES),
  value: PropTypes.number.isRequired,
}
QuantitySelector.defaultProps = {
  className: '',
  max: 999,
  min: 1,
}
