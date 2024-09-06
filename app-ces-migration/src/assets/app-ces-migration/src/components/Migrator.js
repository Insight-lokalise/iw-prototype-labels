import React, { Component } from 'react'

import MigrationHeader from './MigrationHeader'
import MigrationTabs from './MigrationTabs'

export default class Migrator extends Component {
	render() {
		return <div className='app-ces-migration'>
      <MigrationHeader />
      <div className='o-wrapper'>
        <MigrationTabs />
      </div>
    </div>
	}
}
