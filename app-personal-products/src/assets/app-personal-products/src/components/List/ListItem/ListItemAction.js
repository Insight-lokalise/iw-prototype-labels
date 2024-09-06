import React, { Fragment } from 'react'
import PropTypes from 'prop-types'
import { t } from '@insight/toolkit-utils'

export default function ListItemActions({
	displayDescriptionShort,
	id,
	undoRemoveItem
}) {
	return (
		<Fragment>
			{`"${displayDescriptionShort}" ${t('This item has been deleted')}`}
			<button aria-label={t('Undo delete')} onClick={undoRemoveItem}>
				{t('Undo Delete')}
			</button>
		</Fragment>
	)
}

ListItemActions.propTypes = {
	displayDescriptionShort: PropTypes.string.isRequired,
	id: PropTypes.string.isRequired,
	undoRemoveItem: PropTypes.func.isRequired
}
