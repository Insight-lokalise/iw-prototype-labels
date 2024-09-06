import React from "react";

import {t} from "@insight/toolkit-utils";
import Icon from "@insight/toolkit-react/lib/Icon/Icon";
import {Button, Image} from "@insight/toolkit-react";
import {handleLogout} from "api"

export default function LeftNavHeader(props) {
  const {account, userInformation:{b2bInfo, loginTypeId}, handleClick} = props
  if (!account) {return <></>}
  return (
    <header className="header">
      <Button
        aria-expanded="true"
        aria-label={t('Close account menu')}
        className="c-close-flyout"
        color="none"
        onClick={handleClick}
      >
        <Icon icon="arrow-left" />
      </Button>
      {account.companyLogo &&
        <p className="c-left-navigation-logo c-left-color companyLogo">
          <Image alt='' className="c-left-navigation-logo" image={account.logoLocation + account.companyLogo} /><br />
          {!(loginTypeId === 10) && <strong>{account.webGroupName}</strong>}
        </p>
      }

      <h2>{t('Account Tools')}</h2>
      <p>{t('welcomeBack')} {account.fullName}.</p>

      {!(b2bInfo.isB2B) &&
        <p>
          <Button
            className="c-button--primary"
            onClick={handleLogout}
          >
            {t('logout')}
          </Button>
        </p>
      }
    </header>
  )
}

