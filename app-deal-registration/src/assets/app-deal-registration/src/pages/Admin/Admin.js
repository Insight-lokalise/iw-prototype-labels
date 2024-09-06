import React, { createRef, Component } from 'react'
import { getPreviewFields } from 'api'
import PropTypes from 'prop-types'
import Search from './Search/Search'
import Table from './Table/Table'
import Preview from './Preview/Preview'

import 'react-day-picker/lib/style.css'

export default class Admin extends Component {
	previewNode = createRef()

	state = {
		deals: [],
		selectedDeal: '',
		selectedIsLegacy: false,
		showNoResults: false,
		showPreview: false
	}

	clearSearch = () => {
		this.setState({ deals: [], showPreview: false })
	}

	goToEdit = () => {
		this.props.history.push('/edit')
	}

	hideOtherSections = () => {
		this.setState({
			deals: [],
			selectedDeal: '',
			selectedIsLegacy: false,
			showNoResults: false,
			showPreview: false
		})
	}

	setDeals = deals => {
		this.setState({ deals, showNoResults: false })
	}

	showNoResults = () => {
		this.setState({ showNoResults: true })
	}

	showPreview = async deal => {
		const selected = await getPreviewFields(deal.id)
		if (selected) {
			this.setState({
				selectedDeal: selected,
				selectedIsLegacy: !!(deal.legacy_id),
				showPreview: true
			}, () => {
				const rect = this.previewNode.current.getBoundingClientRect()
				window.scrollTo({
					behavior: 'smooth',
					left: 0,
					top: rect.bottom
				})
			})
		}
	}

	updateDeal = payload => {
		this.setState(({ deals }) => {
			let updatedDeal
			const newDeals = deals.map(deal => {
				if (deal.id === payload.id) {
					updatedDeal = { ...deal, ...payload }
					return updatedDeal
				}
				return deal
			})
			return {
				deals: newDeals,
				selectedDeal: updatedDeal,
				showPreview: false
			}
		})
		window.scrollTo({
			behavior: 'smooth',
			left: 0,
			top: 0
		})
	}

	render() {
		const { deals, selectedDeal, selectedIsLegacy, showNoResults, showPreview } = this.state

		return (
			<div className="c-admin">
				<Search clearSearch={this.clearSearch} hideOtherSections={this.hideOtherSections} setDeals={this.setDeals} showNoResults={this.showNoResults} />
				{showNoResults && (
					<div className="c-admin__empty">
						<p>There are no deals for that search. Try again</p>
					</div>
				)}
				<Table deals={deals} goToEdit={this.goToEdit} purpose={this.props.purpose} showPreview={this.showPreview} />
				{selectedDeal && (
					<Preview deal={selectedDeal} selectedIsLegacy={selectedIsLegacy} previewNode={this.previewNode} updateDeal={this.updateDeal} visible={showPreview} />
				)}
			</div>
		)
	}
}
