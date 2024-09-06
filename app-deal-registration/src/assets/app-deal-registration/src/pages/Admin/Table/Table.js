import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Button, Icon } from '@insight/toolkit-react'
import ReactTable from 'react-table'

import 'react-table/react-table.css'

import { downloadCSV } from '../helpers'
import { generateDataFromDeal, generateTableDataFromDeal, tableColumns } from './renderData'
import DownloadData from './DownloadData'

export default class Table extends Component {
	handleDealEdit = deal => {
		this.props.purpose.updatePurposeKey({ key: 'selectedDeal', value: deal })
		this.props.goToEdit()
	}

	handleDealPreview = deal => {
		// show preview fields
		this.props.showPreview(deal)
	}

	handleDownload = () => {
		const data = this.props.deals.map(generateTableDataFromDeal)
		downloadCSV(data)
	}

	renderRowData = () => {
		const data = this.props.deals.map(deal => {
			const base = generateDataFromDeal(deal)
			if (!base) return
			return {
				...base,
				edit: (
					<Button 
						className="c-admin-table__action"
						disabled={deal.legacy_id}
						onClick={() => this.handleDealEdit(deal)}
					>
						<Icon icon="create" size="small" />
					</Button>
				),
				preview: (
					<Button className="c-admin-table__action" onClick={() => this.handleDealPreview(deal)}>
						<Icon icon="eye" size="small" />
					</Button>
				)
			}
		}).filter(Boolean)
		return data
	}

	render() {
		const { deals } = this.props
		if (!deals.length > 0) {
			return null
		}

		return (
			<div className="c-admin-table">
				<DownloadData downloadData={this.handleDownload} />
				<ReactTable 
					className="c-admin-table__table"
					data={this.renderRowData()} 
					defaultPageSize={10}
					columns={tableColumns} 
				/>
			</div>
		)
	}
}
