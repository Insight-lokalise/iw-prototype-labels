import React, { Fragment } from 'react'
import { BrowserRouter } from 'react-router-dom'

import { Header } from '@components'

import PageBase from './PageBase'
import Routes from './Routes'

export default function App() {
	return (
		<PageBase>
			<BrowserRouter>
				<Fragment>
					<Header />
					<Routes />
				</Fragment>
			</BrowserRouter>
		</PageBase>
	)
}

