import React, {useState} from 'react'
import PropTypes from 'prop-types'
import { isReceiveInsightEmails, createLimitedAccount, checkUserLogin } from 'api'
import { t } from '@insight/toolkit-utils'
import LoginDetails from "./LoginDetails";
import MoreDetails from "./MoreDetails";

export default function CreateAccountForm (props) {
  const { title, description, locale } = props
  const [isPending, setIsPending] = useState(false)
  const [moreDetailsView, setMoreDetailsView] = useState(false)
  const [isExistingUser, setIsExistingUser] = useState(false)
  const [loginDetails, setLoginDetails] = useState({receiveInsightEmails: isReceiveInsightEmails(locale)})
  const [loginError, setLoginError] = useState(null)

  function handleNext(loginDetails, isExisting ) {
    setIsExistingUser(isExisting)
    setLoginDetails(loginDetails)
    if (isExisting) {
      checkUserLogin({...loginDetails, isExisting}).then((response) => {
        if(response) {
          setLoginError(response)
        } else {
          setLoginError(null)
          setMoreDetailsView(true)
        }
      })
    } else {
      setMoreDetailsView(true)
    }

  }

  function handleBack() {
    setMoreDetailsView(false)
  }

  function handleCreate(values) {
    setIsPending(true)
    createLimitedAccount({...values, ...loginDetails, isExistingUser}).then((nextPage)=>{
      setIsPending(false)
      // there will no error scenario
      window.location.replace(nextPage)
    })
  }
  return (
    <form className="c-create-account-form c-form">
      <div className="o-grid  o-grid--gutters">
        <div className="o-grid__item">
          <h3>{title}</h3>
          <p>
            {description} <br/>
            <abbr className="c-form__required" title="Required">*</abbr>
            {t('Indicates required fields.')}
          </p>
          {!!loginError && <div>{t(loginError)}</div>}

          { moreDetailsView ?
            <MoreDetails isPending={isPending} onBack={handleBack} onCreate={handleCreate} locale={locale}/>
            :
            <LoginDetails onNext={handleNext} initialValues={loginDetails}/>
          }

        </div>
      </div>
    </form>

  )
}

CreateAccountForm.propTypes = {
  title: PropTypes.string.isRequired,
  description: PropTypes.string.isRequired,
}
