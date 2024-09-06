import React from 'react'
import { Button, Icon } from '@insight/toolkit-react'

export default function AccessDenied() {
  return (
    <div className="c-accessDenied">
      <h4>
        <Icon icon="close-circled" type="error" />&nbsp;
        You do not have access to this application. Please contact your Admin or try
        <Button color="link" onClick={handleLogin}>Login</Button>
      </h4>
    </div>
  )
}

const handleLogin = () => {
  window.location.href = '/login'
}
