import React, { Component } from 'react'
import PropTypes from 'prop-types'
import Actions from './Actions'
import Header from './Header'
import Info from './Info'

export default class Item extends Component {
	handleEdit = () => {
		const { editItem, item } = this.props
		const id = item.formId || item.templateId
		editItem(item, id)
	}

	handlePreview = () => {
		this.props.previewItem(this.props.item)
	}

	makeActive = () => {
		const { item, setActive } = this.props
		const id = item.formId
			? { formId: item.formId }
			: { templateId: item.templateId }
		setActive({ ...id, ...item })
	}

	render() {
		const { isActivating, item } = this.props
		const id = item.formId || item.templateId
		const isLoading = isActivating === item.versionId

		return (
			<div className="c-list-item o-grid__item u-1/2">
				<Header
					id={id}
					isActive={item.isActive}
					versionId={item.versionId}
				/>
				<Info
					createDate={item.createDate}
					modifiedDate={item.modifiedDate}
				/>
				<Actions
					handleEdit={this.handleEdit}
					handlePreview={this.handlePreview}
					isActive={item.isActive}
					isLoading={isLoading}
					makeActive={this.makeActive}
				/>
			</div>
		)
	}
}
