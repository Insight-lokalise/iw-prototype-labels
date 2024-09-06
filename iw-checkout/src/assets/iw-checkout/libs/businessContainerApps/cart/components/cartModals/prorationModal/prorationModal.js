import React from 'react'
import PropTypes from 'prop-types'
import moment from 'moment'

import { t } from '@insight/toolkit-utils/lib/labels'
import DatePicker from '@insight/toolkit-react/lib/DatePicker/DatePicker'

// do not move
const today = moment()
// do not move

const ProrationModal = (props) => {

	const startDate = props.startDate
	const baseDate = props.contractStartDate !== null ? moment(props.contractStartDate) : today
	const maxDate = props.showPurchaseTypeLinkOnUI ? today : moment().add({ months: 5, years: 6 })
	const minDate = props.showPurchaseTypeLinkOnUI ? moment().subtract(30, 'days') : baseDate

	const deployDateText = 'Deploy date: '
	const descriptionText = 'Description'
	const licenseTypeText = 'Select a license type:'
	const messageText = ' Modifying deploy date will adjust pricing based on the months remaining.'
	const mfrPartNumberText = 'Mfr #'
	const newLicenseText = 'New'
	const unpaidLicenseText = 'Unpaid'
	const qtyText = 'Qty'

	let selectedPurchaseType = props.selectedPurchaseType.toUpperCase()

	function handleDateChange(date) {
		props.onDateChange(date)
	}

	function handleTypeChange(type) {
		props.onTypeChange(type.target.value)
	}

	return (
		<section className="proration-modal">
			<div className="row is-collapse-child proration-modal__message">
				<div className="column">
					<div className="row align-middle row__gutter--tiny collapse">
						<div className="columns shrink">
							<span className="ion-alert-circled proration-modal__icon proration-modal__icon--message"></span>
						</div>
						<div className="columns">
							<span className="proration-modal__text">{t(messageText)}</span>
						</div>
					</div>
				</div>
			</div>

			{props.showPurchaseTypeLinkOnUI ?
				<div className="row align-middle proration-modal__deploy-date">
					<div className="column small-12 medium-6 medium-text-right">
						<p className="proration-modal__text--deploy">{t(licenseTypeText)}</p>
					</div>
					<div className="column small-12 medium-6">
						<div
							className="proration-modal__date-picker"
							onChange={handleTypeChange}
						>
							<input type="radio" name="licenseType" id="newLicense" defaultChecked={selectedPurchaseType === 'NEW'} value="New"/><label htmlFor="newLicense">{t(newLicenseText)}</label>
							<input type="radio" name="licenseType" id="unpaidLicense" defaultChecked={selectedPurchaseType === 'UNPAID'} value="Unpaid"/><label htmlFor="unpaidLicense">{t(unpaidLicenseText)}</label>
						</div>
					</div>
				</div> :
				null
			}

			{selectedPurchaseType === 'NEW' ?
				null :
				<div className="row align-middle proration-modal__deploy-date">
					<div className="column small-12 medium-6 medium-text-right">
						<p className="proration-modal__text--deploy">{t(deployDateText)}</p>
					</div>
					<div className="column small-12 medium-6">
						<div className="proration-modal__date-picker">
							<DatePicker
								selected={startDate.toDate()}
								maxDate={maxDate.toDate()}
								minDate={minDate.toDate()}
								onChange={handleDateChange}
							/>
						</div>
					</div>
				</div>
			}
			<div className="row">
				<div className="column">
					<table className="proration-modal__table">
						<thead>
							<tr>
								<th className="proration-modal__qty-column proration-modal__table-header">{t(qtyText)}</th>
								<th className="proration-modal__mfr-column proration-modal__table-header">{t(mfrPartNumberText)}</th>
								<th className="proration-modal__description-column proration-modal__table-header">{t(descriptionText)}</th>
							</tr>
						</thead>
						<tbody>
							<tr>
								<td className="proration-modal__table-body">{props.quantity}</td>
								<td className="proration-modal__table-body">{props.mfrPartNumber}</td>
								<td className="proration-modal__table-body">{props.description}</td>
							</tr>
						</tbody>
					</table>
				</div>
			</div>
		</section>
	)
}


ProrationModal.propTypes = {
	onDateChange: PropTypes.func.isRequired,
	onTypeChange: PropTypes.func.isRequired,
	contractStartDate: PropTypes.number,
	description: PropTypes.string.isRequired,
	mfrPartNumber: PropTypes.string.isRequired,
	prorationType: PropTypes.string,
	selectedPurchaseType: PropTypes.string.isRequired,
	showPurchaseTypeLinkOnUI: PropTypes.bool.isRequired,
	startDate: PropTypes.object.isRequired,
	quantity: PropTypes.number.isRequired,
}

export default ProrationModal
