import React, { Component } from 'react'
import PropTypes from 'prop-types'
import moment from 'moment'

import { t } from '@insight/toolkit-utils/lib/labels'
import { IWModal } from '../../../iw-components'

import { ProrationModal } from './cartModals'
import Date from '@insight/toolkit-react/lib/Date/Date'
import { formatUTCDate } from '../helpers'

const prorationText = 'The price displayed has been prorated based on the remaining agreement period.'
const deployDateText = 'Deploy date:'
const changeText = 'Change'
const copyText = 'Copy to all'
const licenseTypeText = 'License type:'
const emptyString = ''

class Proration extends Component {
    constructor(props) {
        super(props)
        this.state = {
			purchaseType: this.props.cartItemPurchaseType,
			showProrationModal: false,
			startDate: moment(this.props.prorationDeployDate),
		}
    }

    componentDidUpdate(prevProps, prevState) {
		prevState.startDate = moment(this.props.prorationDeployDate)
		prevState.purchaseType = this.props.cartItemPurchaseType
	}


    handleCopyProrationToAll = () => {
		this.props.copyProrationToAll(this.props.prorationDeployDate, this.props.programID, this.state.purchaseType)
	};

    handleDateChangeInProrationModal = date => {
		this.setState({
			startDate: moment(date),
		})
	};

    handleTypeChangeInProrationModal = type => {
		if (type === 'New') {
			this.setState({
				purchaseType: type,
				startDate: moment(),
			})
		} else {
			this.setState({
				purchaseType: type,
			})
		}
	};

    hideProrationModal = () => {
		this.setState({
			showProrationModal: false,
		})
	};

    saveProrationUsageDate = () => {
		const childMaterialIDKeyValue = this.props.bundleParentMaterialIDKey === '0' ? 0 : this.props.materialIDKey
		const materialIDKeyValue = this.props.bundleParentMaterialIDKey === '0' ? this.props.materialIDKey : this.props.bundleParentMaterialIDKey
		const contractMaterialIdsList = []
		const requestPayload = { contractMaterialIdsList: contractMaterialIdsList }
		const proratableDateObject = formatUTCDate(this.state.startDate)
		const dateInfo = {
					contractId: this.props.contractID,
					childMaterialIDKey: childMaterialIDKeyValue,
					materialIDKey: materialIDKeyValue,
					proratableDate: moment(this.state.startDate).date().toString(),
					proratableMonth: moment(this.state.startDate).month().toString(),
					proratableYear: moment(this.state.startDate).year().toString(),
					proratableDateObject: proratableDateObject,
		}

		if (this.state.purchaseType !== emptyString) {
			dateInfo.cartItemPurchaseType = this.state.purchaseType
		}

		contractMaterialIdsList.push(dateInfo)

		this.props.saveProrationUsageDate(requestPayload)
	};

    showProrationModal = () => {
		this.setState({
			showProrationModal: true,
		})
	};


    render() {
		return (
			<div className="row expanded">
				<div className="columns flex-child-auto cart__table-col--desc text-left">
					<div className="cart-item__proration small-negative-left-margin">
						{ this.props.priceProrated &&
							<div><p className="proration__text">{t(prorationText)}</p></div>
						}
						{ this.props.showProrationDeployDate &&
							<div className="row proration__deploy-details collapse">
								<span className="column flex-child-shrink">{t(deployDateText)}&nbsp;</span>
								<span className="column proration__deploy-details--text">
									<div className="proration__deploy-details--date">
										<Date date={this.props.prorationDeployDate}/>
									</div>
									{ (this.props.showProrationDeployDateLink && !this.props.isReadOnly) &&
										<span className="hide-for-print">
											<span
												className="prortation__link-text prortation__link-text--change"
												onClick={this.showProrationModal}
											>
												{t(changeText)}
											</span>
											{ this.props.showCopyToAllLink &&
												<span
													className="prortation__link-text prortation__link-text--copy"
													onClick={this.handleCopyProrationToAll}
												>
													{t(copyText)}
												</span>
											}
										</span>
									}
								</span>
							</div>
						}
						{ this.props.cartItemPurchaseType !== emptyString &&
							<div className="row proration__deploy-details collapse">
								<div className="column flex-child-shrink">{t(licenseTypeText)}</div>
								<div className="column proration__deploy-details--text">
									<div className="proration__deploy-details--date">{this.props.cartItemPurchaseType}</div>
									{ (this.props.showPurchaseTypeLinkOnUI && !this.props.isReadOnly) &&
										<span className="hide-for-print">
											<span
												className="prortation__link-text prortation__link-text--change"
												onClick={this.showProrationModal}
											>
												{changeText}
											</span>
											{ this.props.showCopyToAllLink &&
												<span
													className="prortation__link-text prortation__link-text--copy"
													onClick={this.handleCopyProrationToAll}
												>
													{copyText}
												</span>
											}
										</span>
									}
								</div>
							</div>
						}
						<IWModal
							backdropClassName='iw-dialog iw-dialog-backdrop'
							showIf={this.state.showProrationModal}
							title={t('Deploy date')}
							cancelBtnText={t('Cancel')}
							confrimBtnText={t('Apply')}
							onHide={this.hideProrationModal}
							onConfirm={this.saveProrationUsageDate}
						>
							<ProrationModal
								onDateChange={this.handleDateChangeInProrationModal}
								onTypeChange={this.handleTypeChangeInProrationModal}
								contractStartDate={this.props.contractStartDate}
								description={this.props.description}
								mfrPartNumber={this.props.mfrPartNumber}
								prorationType={this.props.prorationType}
								selectedPurchaseType={this.state.purchaseType}
								showPurchaseTypeLinkOnUI={this.props.showPurchaseTypeLinkOnUI}
								startDate={this.state.startDate}
								quantity={this.props.quantity}
							/>
						</IWModal>
					</div>
				</div>
			</div>
		)
	}
}


Proration.propTypes = {
	bundledItem: PropTypes.bool.isRequired,
	bundleParentMaterialIDKey: PropTypes.string.isRequired,
	cartItemPurchaseType: PropTypes.string.isRequired,
	cartItemPurchaseTypeFromSAPUnEditable: PropTypes.bool.isRequired,
	contractID: PropTypes.string.isRequired,
	contractStartDate: PropTypes.number,
	description: PropTypes.string.isRequired,
	isReadOnly: PropTypes.bool.isRequired,
	mfrPartNumber: PropTypes.string.isRequired,
	materialIDKey: PropTypes.string.isRequired,
	priceProrated: PropTypes.bool.isRequired,
	programID: PropTypes.string,
	prorationDeployDate: PropTypes.number,
	prorationType: PropTypes.string,
	showCopyToAllLink: PropTypes.bool.isRequired,
	showProrationDeployDate: PropTypes.bool.isRequired,
	showProrationDeployDateLink: PropTypes.bool.isRequired,
	showPurchaseTypeLinkOnUI: PropTypes.bool.isRequired,
	quantity: PropTypes.number.isRequired,
	// actions
	copyProrationToAll: PropTypes.func.isRequired,
	saveProrationUsageDate: PropTypes.func.isRequired,
}


export default Proration
