import PropTypes from 'prop-types'
import React, { Component } from 'react'
import { IWCheckboxField } from '../../../../iw-components/iw-form'
import { t } from '@insight/toolkit-utils/lib/labels'
import Lozenge from '@insight/toolkit-react/lib/Lozenge/Lozenge'

export default class SetAsMyDefault extends Component {
  constructor(props) {
    super()
    this.state = {
      newValue: props.value || '',
    }
  }

  handleOnChange = (event, newValue) => {
    this.setState({ newValue: newValue || '' })
    this.props.clearSetAsMyDefault(this.props.name)
  }

  render() {
    const trim = (str) => (str || '').trim()
    const children = React.Children.map(this.props.children, (child) =>
      React.cloneElement(child, { onChange: this.handleOnChange })
    )
    const { defaultValue = '', name, readOnly } = this.props
    const { newValue } = this.state
    return (
      <div className="set-as-my-default">
        {children}
        {newValue === defaultValue ? (
          <Lozenge color="info">
            {defaultValue === '' ? '' : t('Default')}
          </Lozenge>
        ) : (
          <span>
            {!readOnly && trim(newValue) != '' && (
              <IWCheckboxField
                className="form__label--inline set-as-my-default__checkbox"
                label={t('Set as default')}
                name={name}
              />
            )}
          </span>
        )}
      </div>
    )
  }
}

SetAsMyDefault.defaultProps = {
  defaultValue: '',
  value: '',
}

SetAsMyDefault.propTypes = {
  clearSetAsMyDefault: PropTypes.func.isRequired,
  defaultValue: PropTypes.string,
  name: PropTypes.string.isRequired,
  readOnly: PropTypes.bool,
  value: PropTypes.string,
}
