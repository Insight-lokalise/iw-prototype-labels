import React from 'react'

import {Header} from '@insight/toolkit-react'

const MigrationHeader = () =>  {
    return <div className='c-migration-header'>
      <Header>
        <Header.Top>
          <Header.Top.Right>
            <Header.Top.Nav>
              <Header.Top.Item href="/insightweb/webGroupList">Back to CMT</Header.Top.Item>
            </Header.Top.Nav>
          </Header.Top.Right>
        </Header.Top>
        <Header.Bottom>
          <Header.Logo href="#" />
        </Header.Bottom>
      </Header>
    </div>
}

export default MigrationHeader
