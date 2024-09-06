import React, {Fragment} from 'react'
import PropTypes from "prop-types";

import { renderLoginWithYourExistingAccount, renderRecoverUsernamePassword } from 'api'
import { t } from '@insight/toolkit-utils'
import { FieldError, HelpText } from "@insight/toolkit-react/lib/Form/Components/Decorators";

export function EmailHelpText ({isExistingUser}) {
  const tryAnotherEmail = t('Try another email address')
  const emailAlreadyRegisteredError = t('This email has already been registered. You can:')
  const emailAlreadyRegisteredInOtherRegionError = t('You already have an account with Insight in a different region. You can...')
  const tryLoginFromOtherRegion = t('Enter you username and password for your account in the other region')
  return (
    <Fragment>
      <FieldError showErrorIcon>
        {isExistingUser? emailAlreadyRegisteredError: emailAlreadyRegisteredInOtherRegionError}
      </FieldError>
      <HelpText>
        <ul className="c-create-account-list">
          <li className="c-create-account-list__item">{tryAnotherEmail}</li>
          { isExistingUser ?
            <Fragment>
              <li className="c-create-account-list__item">{renderLoginWithYourExistingAccount()}</li>
              <li className="c-create-account-list__item">{renderRecoverUsernamePassword()}</li>
            </Fragment>
            :
            <li className="c-create-account-list__item">{tryLoginFromOtherRegion}</li>
          }
        </ul>
      </HelpText>
    </Fragment>

  )
}

EmailHelpText.propTypes = {
  isExistingUser: PropTypes.bool.isRequired,
}
