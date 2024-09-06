import  React, { Component } from 'react'
import PropTypes from 'prop-types';

import { Message } from '@insight/toolkit-react'
import { getPasswordStrength } from "@insight/toolkit-utils"
import { updateSetupDeliveryData } from 'api'

import EmailRecipients from './EmailRecipients'
import FTPMethod from './FTPMethod'
import AppContext from '../../context/AppProvider'
import { PAGES } from '../../constants'


class DeliveryMethodConfig extends Component {
  constructor(props, context) {
    super(props, context)    

    this.state = {
      errorsExist: true,
      formSubmitted: false,
      apiStatus: "",
      apiStatusMessage: ""
    }
  }
  
  onSubmit = (values) => {
    const { deliveryMethod, setSubmitLoading, soldTo } = this.props;
    const { salesOrg, soldTo: partnerNumber, catalogId: elementId, setupDeliveryInfo, eComServiceUrl} = this.context

    // don't send properties with empty values
    const cachedValues = Object.keys(setupDeliveryInfo).reduce((acc, key) => {
      if(setupDeliveryInfo[key]) {
        acc[key] = setupDeliveryInfo[key]
      }
      return acc
    }, {})

    let apiOptions = {
      elementId,      
      partnerNumber: typeof partnerNumber !== "undefined" ? partnerNumber : soldTo,      
      salesOrg
    }  

    

    switch (deliveryMethod) {
      case 'EMAIL': {
        const emailString = values.join(";")
        apiOptions = {
          ...apiOptions,
          ...cachedValues,
          emailRecipients: emailString,
          primaryCommMethod: "EMAIL",
        }
        //update context with updated email addresses
        this.context.updateDeliveryFields({'emailRecipients': emailString});

        break
      }
      case 'FTP': {
        const {host, port, pwd, user} = values;

        //add salesOrg, soldTo
        apiOptions = {
          ...apiOptions,
          ...cachedValues,
          ftpRemoteHost: host,
          ftpRemotePort: port,
          ftpRemoteUser: user,
          ftpRemotePassword: pwd,
          primaryCommMethod: deliveryMethod.toUpperCase(),
        }
        break
      }
      case 'SFTP': {
        const {host, port, pwd, user} = values;

        //add salesOrg, soldTo
        apiOptions = {
          ...apiOptions,
          ...cachedValues,
          ftpRemoteHost: host,
          ftpRemotePort: port,
          ftpRemoteUser: user,
          ftpRemotePassword: pwd,
          primaryCommMethod: deliveryMethod.toUpperCase(),
        }
        break
      }
      default: {
        break
      }
    }

    setSubmitLoading(true)
    updateSetupDeliveryData(apiOptions)
      .then(
        () => {
          this.context.updateDeliveryFields(apiOptions)
          this.context.updateClientInfo({ allowEditSoldTo: false })
          this.setState({ formSubmitted: true, apiStatus: "success", apiStatusMessage: "Data saved successfully!" })
          setSubmitLoading(false)                 
        }
      )       
      .catch((error) => {
        this.context.updateClientInfo({ allowEditSoldTo: false })
        this.setState({ formSubmitted: true, apiStatus: "error", apiStatusMessage: "Data was not saved successfully!" })
          setSubmitLoading(false)
          console.error(error) 
        }
      )    
  }

  isPasswordStrengthInvalid(value){
    if (value === '' || value === undefined) {
      return true
    } else {
      const strength = getPasswordStrength(value)
      if( ['', 'weak' ].includes(strength)) {
        return true
      }
    }
    return false
  }

  validateForm = (values, isMounting) => {
    const errors = {}
    if (!values.host) {
      errors.host = 'Host name is required.'
    }
    if (!values.port) {
      errors.port = 'Port number is required'
    } else if (isNaN(values.port)) {
      errors.port = 'Port must be a number (usually either 20 or 21). sftp 22'
    }
    if (!values.user) {
      errors.user = 'Username is required'
    }
    if (!values.pwd || this.isPasswordStrengthInvalid(values.pwd)) {
      errors.pwd = 'Please enter a valid password.'
    }
    if(values.pwd !== values.confirm) {
      errors.confirm = 'Password and Confirm Password do not match'
    }
    if (Object.keys(errors).length === 0) {
      this.setState({ errorsExist: false });
    } else {
      this.setState({ errorsExist: true });
    }
    return isMounting ? {} : errors
  }

  shouldComponentUpdate(prevProps, nextState) {    
    if(this.props.deliveryMethod !== prevProps.deliveryMethod) {
      //reset api status on method change
      this.setState({ formSubmitted: false, apiStatus:"", apiStatusMessage: "" })
    }

    return true
  } 

  renderMessages = () => {

    const { apiStatus, apiStatusMessage } = this.state

    if(apiStatus !== "") {
      return (
        <Message type={apiStatus}>
          {apiStatusMessage}
        </Message>
      )
    }
    return null

  }

  viewNextStep = () => {    
    this.context.onSelectedTabChange(PAGES.CATALOG)
  }

  componentDidUpdate(prevProps) {    
    if (this.props.deliveryMethod !== prevProps.deliveryMethod) {      
      this.setState({ errorsExist: true });
    }
  }

  render() {
    const { deliveryMethod, disableSubmit, setupDeliveryInfo, submitLoading } = this.props
    const { formSubmitted, errorsExist } = this.state
    return (
      <div className="o-grid__item">
      { deliveryMethod === 'EMAIL' ? (
        <EmailRecipients
          disableSubmit={disableSubmit}
          formSubmitted={formSubmitted}
          onSubmit={this.onSubmit}
          renderMessages={this.renderMessages}
          setupDeliveryInfo={setupDeliveryInfo}
          submitLoading={submitLoading}
        />
      ) : (
        <FTPMethod
          deliveryMethod={deliveryMethod}
          disableSubmit={disableSubmit}
          errorsExist={errorsExist}
          formSubmitted={formSubmitted}
          onSubmit={this.onSubmit}
          renderMessages={this.renderMessages}
          setupDeliveryInfo={setupDeliveryInfo}
          submitLoading={submitLoading}
          validateForm={this.validateForm}
          viewNextStep={this.viewNextStep}
        />
      )}
      </div>
    )
  }
}

DeliveryMethodConfig.propTypes = {
  deliveryMethod: PropTypes.string
};

DeliveryMethodConfig.contextType = AppContext
export default DeliveryMethodConfig;
