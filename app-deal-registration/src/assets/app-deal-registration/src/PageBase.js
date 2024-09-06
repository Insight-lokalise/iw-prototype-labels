import React, { memo, Fragment } from 'react'
import PropTypes from 'prop-types'
import { IconSymbols, Modal } from '@insight/toolkit-react'

import { ModalRoot, Toasts } from '@components'
import { DisplayProvider, ErrorsProvider, EventsProvider, PurposeProvider } from '@context'

export default function PageBase({ children }) {
	return (
		<div className="c-app-container">
			<DisplayProvider>
				<ErrorsProvider>
					<PurposeProvider>
						<EventsProvider>
								<IconSymbols />
								<ModalRoot />
								<Toasts />
								{children}
						</EventsProvider>
					</PurposeProvider>
				</ErrorsProvider>
			</DisplayProvider>
		</div>
	)
}

PageBase.propTypes = {
	children: PropTypes.node.isRequired
}
