import React, { Component, Fragment } from 'react';
import { Button } from '@insight/toolkit-react'
import { FieldError, HelpText } from "@insight/toolkit-react/lib/Form/Components/Decorators";
import AppContext from '../../context/AppProvider'
import { validateEmail, mapEmails } from '../../helpers'
import FormButtons from './FormButtons'
import { PAGES } from '../../constants'

class EmailRecipients extends Component {  
  constructor(props, context) {
    super(props, context)
    const { emailRecipients } = this.context.setupDeliveryInfo
    this.state = {
      emails: emailRecipients ? emailRecipients.split(';') : [],
      emailInvalid: false,
      emailVal: '',
      errorMsg: ''
    }
  }

  saveEmail = (email) => {
    const obj = validateEmail(email, this.state.emails)

    if (obj.isValid) {
      this.setState(({ emails }) => ({
        emails: emails.concat(email),              
        emailInvalid: false,
        emailVal: ""
      }))
    } else {
      this.setState({ emailInvalid: true, errorMsg: obj.errorMsg })
    }
  }

  deleteEmail = (email) => {   
    this.setState(({ emails }) => {
      const emailsArr = emails.reduce((prev, currentEmail) => {
        return (currentEmail === email) ? prev : [...prev, currentEmail]
      }, [])
      return { emails: emailsArr }
    })
  }

  updateEmailValue = (e) => {
    e.preventDefault()
    this.setState({ emailVal: e.target.value })
  }

  viewNextStep = () => {    
    this.context.onSelectedTabChange(PAGES.CATALOG)
  }

  submitHandler = () => {
    //use submit function from parent
    const { onSubmit } = this.props
    const { emails } = this.state
    onSubmit(emails);
  }

  render() {
    const { formSubmitted, submitLoading, renderMessages, setupDeliveryInfo, disableSubmit } = this.props
    const { emails, emailInvalid, errorMsg, emailVal } = this.state;

    return (
      <div className="c-email-recipients">
        <h4 className="u-margin-bot">Step 3: Enter email recipients to recieve this catalog.</h4>
        <div id="c-email-recipients__form" className="u-margin-bot">          
          <div className="o-grid o-grid--gutters-tiny">
            <div className="o-grid__item u-2/3">
              <div className={emailInvalid ? "c-form__element has-error" : "c-form__element"}>
                <div className="c-form__control">
                  <input
                    type="email"
                    className="c-input"
                    placeholder="Enter email here..."
                    value={emailVal}
                    onChange={this.updateEmailValue}
                  />
                  <HelpText>Note: the maximum amount of emails that you can add is 15.</HelpText>
                  {(emails.length >= 15) && <HelpText>{`You've reached the max limit of 15. Please submit or remove your existing emails.`}</HelpText>}
                  {emailInvalid && <FieldError showErrorIcon>{errorMsg}</FieldError>}
                </div>              
              </div>
            </div>
            <div className="o-grid__item">
              <Button color="primary" icon="add" onClick={() => this.saveEmail(emailVal)}>Add Email</Button>
            </div>
          </div>
        </div>
        <div id="c-email-recipients__list">
          {emails.length > 0 && (
            <Fragment>
              <label className="c-form__label">Email recipients:</label>
              <ol>
                {mapEmails(emails, this.deleteEmail)}
              </ol>
              {renderMessages()}
              <FormButtons
                disableSubmit={disableSubmit}
                formSubmitted={formSubmitted}
                viewNextStep={this.viewNextStep}
                errorsExist={false}
                handleSubmit={this.submitHandler}
                submitLoading={submitLoading}
              />
            </Fragment>
          )}
        </div>
      </div>
      );
  }
}

EmailRecipients.contextType = AppContext
export default EmailRecipients;
