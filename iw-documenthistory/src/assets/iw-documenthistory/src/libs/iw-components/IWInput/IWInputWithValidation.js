import React, { Component } from 'react'
import PropTypes from 'prop-types'

import { IWInput } from './'

export default class IWInputWithValidation extends Component {
  constructor() {
    super()
    this.state = { showError: false }

    this.handleTyping = this.handleTyping.bind(this)
    this.validate = this.validate.bind(this)
  }

  handleTyping(e) {
    const { value, defaultValue } = e.target
    value !== defaultValue && this.validate(value)
  }

  hideError() {
    this.setState({ showError: false })
  }

  showError() {
    this.setState({ showError: true })
  }

  validate(value) {
    !this.props.isValid(value) ? this.showError() : this.hideError()
  }

  render() {
    const { defaultValue, errorMessage, name, label, type, ...otherProps } = this.props
    return (
      <IWInput
        defaultValue={defaultValue}
        errorMessage={errorMessage}
        label={label}
        name={name}
        onChange={this.handleTyping}
        onBlur={e => this.validate(e.target.value)}
        showError={this.state.showError}
        type={type}
        {...otherProps}
      />
    )
  }
}

IWInputWithValidation.propTypes = {
  defaultValue: PropTypes.string,
  errorMessage: PropTypes.string.isRequired,
  isValid: PropTypes.func,
  label: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  type: PropTypes.oneOf(['checkbox', 'email', 'file', 'tel', 'text', 'textArea']).isRequired,
}

IWInputWithValidation.defaultProps = {
  defaultValue: '',
  isValid: () => true,
}
