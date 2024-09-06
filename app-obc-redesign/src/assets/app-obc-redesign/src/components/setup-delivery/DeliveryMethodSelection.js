import React, { Component, Fragment } from 'react'
import { Field } from '@insight/toolkit-react'
import PropTypes from "prop-types";
import AppContext from '../../context/AppProvider'
import DeliveryMethodConfig from './DeliveryMethodConfig'

class DeliveryMethodSelection extends Component {
  constructor(props, context) {
    super(props, context)
    const { primaryCommMethod } = context.setupDeliveryInfo    
    
    this.state = {
      deliveryMethod: primaryCommMethod || '',
      deliveryMethodChecked: !!primaryCommMethod,
      submitLoading: false
    }
    this.isSubmitDisabled = this.isSubmitDisabled.bind(this)
  }

  onMethodChange = ({currentTarget: method}) => {
    this.setState({
      deliveryMethod: method.value,
      deliveryMethodChecked: true
    });
  }

  setSubmitLoading = (loadingState) => {
    this.setState( {submitLoading: loadingState} )
  }

  isSubmitDisabled = () => {
    const { delimiter, fileExtention, fileTemplate, finalFileNameTemplate } = this.context.setupDeliveryInfo
    if (!['SPACE', 'TAB', 'COMMA', 'PIPE', 'OCI5'].includes(delimiter) || delimiter === 'Select One') {
      return true
    }
    if (!['txt','csv','json'].includes(fileExtention) || fileExtention === 'Select One') {
      return true
    }
    if(fileTemplate === "CUSTOM" && !finalFileNameTemplate) {
      return true
    }
    if(fileTemplate === "CUSTOM" && !finalFileNameTemplate) {
      return true
    }
    return false
  }

  render() {
    const { deliveryMethod, submitLoading } = this.state
    return (
      <Fragment>
        <div className="o-grid__item u-margin-bot-large">
          <h4 className="u-margin-bot">Step 2: Choose your primary delivery method.</h4>
          <Field fieldComponent="Radio" name="method-group" checked={deliveryMethod === 'FTP'} label="FTP" value="FTP" handleChange={this.onMethodChange} />
          <Field fieldComponent="Radio" name="method-group" checked={deliveryMethod === 'SFTP'} label="SFTP" value="SFTP" handleChange={this.onMethodChange} />
          <Field fieldComponent="Radio" name="method-group" checked={deliveryMethod === 'EMAIL'} label="Email" value="EMAIL" handleChange={this.onMethodChange} />
        </div>
        <div className="o-grid__item">
          {this.state.deliveryMethodChecked && (
            <DeliveryMethodConfig
              disableSubmit={this.isSubmitDisabled()}
              submitLoading={submitLoading}
              setSubmitLoading={this.setSubmitLoading}
              deliveryMethod={this.state.deliveryMethod}
              setupDeliveryInfo={this.context.setupDeliveryInfo}              
              soldTo={this.props.soldTo}
            />
          )}
        </div>
      </Fragment>
    )
  }
}

DeliveryMethodSelection.contextType = AppContext
DeliveryMethodSelection.propTypes = { 
  soldTo: PropTypes.number.isRequired
}
export default DeliveryMethodSelection
