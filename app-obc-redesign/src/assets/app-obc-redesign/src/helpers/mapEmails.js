import React from 'react'
import { Button } from '@insight/toolkit-react'

export default function mapEmails (emails, deleteEmail) {
  return emails.map((email) => {
    return (
      <li key={email}>{email}
        <Button color="link" onClick={() => deleteEmail(email)} >Delete</Button>
      </li>
    )
  })
}
