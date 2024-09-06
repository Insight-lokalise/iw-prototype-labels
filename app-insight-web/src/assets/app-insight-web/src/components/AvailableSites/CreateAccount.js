import React from 'react'
import Button from "@insight/toolkit-react/lib/Button/Button"
import { t } from '@insight/toolkit-utils'

import { getCreateAccountRoute } from 'api'

export default function CreateAccount() {
  const createAccountRoute = getCreateAccountRoute()
  return(
    <div className='c-create-account'>
      <h4 className='u-jp-font-weight-override'>{t('Create an account on this site and proceed with your shopping experience.')}</h4>
      <Button
        className='u-text-center'
        fullWidth
        color="primary"
        href={createAccountRoute}
      >
        {t('Create an account')}
      </Button>
    </div>
  )
}
