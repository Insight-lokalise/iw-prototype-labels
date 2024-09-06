import React from 'react'
import { render } from 'react-dom'
import { AppProvider } from './context/AppProvider'

import App from './components/App'
import './scss/index.scss'

function renderApp() {
	const root = document.getElementById('react-app-obc-redesign');
	render(
    <AppProvider>
      <App />
    </AppProvider>,
		root
	)
}

renderApp()

// OBC:
// 	rolfes
// SMB-WEB group
//
// Branch:  gc_final
// Docker: ECQ (QA)
//
// ProjectQA:
// 	vvegsana/Insight11
//
//
// Feature to add:
// 	·         Prepopulate saved data on load
// ·         Ability to Change soldTo
//
// UI Changes:
// 	·         Ask Raju about local ftp params
// Right now it is always using ftp remote for API save
//
// ftp:
// 	server: exioimgqa02.ext.insight.com
// username: webimg
// password: upload_1
// port: 21
// sftp:
// 	server: sftp.insight.com:/obc
// username: bhuser
// password: bh12@417!
// 	port: 22
//
// ·         Catalog save change elementId back to catalogId
//