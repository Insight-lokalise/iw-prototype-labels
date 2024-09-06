import React from 'react'
import {TabManager, Panel} from '@insight/toolkit-react'

import MigrationToolTab from './MigrationToolTab'
import ReportsTab from './ReportsTab'
import CreationTab from "./CreationTab"

const MigrationTabs = () =>  {
  const migrationToolTab = {
    content: <MigrationToolTab  />,
    id: 'Migrator',
    name: 'Migration tool',
    className: 'c-migration-tool__tab',
    'data-testid': 'migration-tab',
  }
  const reportsTab = {
    content: <ReportsTab  />,
    id: 'Reports',
    name: 'CES Reports',
    className: 'c-ces-reports__tab',
    'data-testid': 'reports-tab',
  }
  const webGroupCreationTab = {
    content: <CreationTab  key='webGroup' isWebGrp />,
    id: 'Webgroup',
    name: 'Webgroup creation',
    className: 'c-ces-webgroup__tab',
    'data-testid': 'webgroup-tab',
  }
  const userCreationTab = {
    content: <CreationTab key='user' isWebGrp={false} />,
    id: 'User',
    name: 'User creation',
    className: 'c-ces-user__tab',
    'data-testid': 'user-tab',
  }
  const tabs = [migrationToolTab, reportsTab, webGroupCreationTab, userCreationTab]
  return <div className='c-migration-tabs'>
    <Panel className='c-panel-border'>
      <Panel.Body>
        <TabManager className="c-migration__tabs" tabs={tabs} />
      </Panel.Body>
    </Panel>

  </div>
}

export default MigrationTabs
