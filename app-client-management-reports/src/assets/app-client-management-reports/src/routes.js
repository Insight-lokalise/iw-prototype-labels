import React from 'react'
import { BrowserRouter, Route } from 'react-router-dom'
import { Button } from '@insight/toolkit-react'
import ClientManagementReports from './components/ClientManagementReports'
import LastLoginReport from './components/LastLoginReport'
import RepOwnerReport from "./components/RepOwnerReport";
import { jumpToClientManagementTool } from 'api'
import { Locale } from "@insight/toolkit-react"
import IconSymbols from '@insight/toolkit-react/lib/Icon/IconSymbols'

//default locale to en_US for now till this app is localized if needed
export default function RouteComponent() {
	return (		
		<div className='ds-v1 app-client-management-reports'>
			<Locale value={{locale: "en_US"}}>
				<IconSymbols />
				<BrowserRouter basename="/insightweb/webGroupList">
				<div>
          <Route exact path="/clientManagementReports" component={ClientManagementReports} />
					<Route exact path="/lastLoginReport" component={LastLoginReport} />
          <Route exact path="/repOwnReport" component={RepOwnerReport} />
				</div>
				</BrowserRouter>
      <Button onClick={jumpToClientManagementTool} color="link">Back to client management tool</Button>
			</Locale>
		</div>
	)
}
