import React from 'react'

import { t } from '@insight/toolkit-utils'
import { Button } from '@insight/toolkit-react'

export default function Admin(props) {
  const { account, goToHashLink } = props
  const adminObject = [
    {
      title: account?.adminObj?.approvalManagement ? 'approvalManagement' : ``,
      href: `/insightweb/ar/approvalpath`,
    },
    {
      title: account?.adminObj?.manageStandards ? 'manageStandards' : ``,
      onClick: () => goToHashLink('/insightweb/search#manageStandards'),
    },
    {
      title: account?.adminObj?.manageStandardsNew ? 'manageStandards' : ``,
      href: `/insightweb/standards-manager`,
    },
    {
      title: account?.adminObj?.stars ? 'stars' : ``,
      href: `/insightweb/stars`,
    },
    {
      title: account?.adminObj?.userManagement ? 'userManagement' : ``,
      href: `/insightweb/userManagement`,
    },
    {
      title: account?.adminObj?.roles ? 'roles' : ``,
      href: `/insightweb/rolesAndPermissions`,
    },
  ]
  return adminObject.map((admin) => {
    if (admin?.title) {
      return (
        <li>
          <Button {...admin}>{t(admin.title)}</Button>
        </li>
      )
    }
  })
}
