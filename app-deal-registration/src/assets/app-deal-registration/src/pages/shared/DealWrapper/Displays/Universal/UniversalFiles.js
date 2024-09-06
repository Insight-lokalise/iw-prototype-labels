import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Button } from '@insight/toolkit-react'
import { uploadFileAttachment } from 'api'

import { File } from 'components'

const mapNamesFromFiles = ({ fileAttachments = [] }) => {
  return fileAttachments.map(item => {
		const split = item.split('/')
		return split[split.length - 1]
	}).filter(Boolean)
}

export default class UniversalFiles extends Component {
	state = {
		uploadedFiles: mapNamesFromFiles(this.props)
	}
	uploader = null

	onFileSubmit = async files => {
		const response = await uploadFileAttachment(files)
		const names = response.map(item => {
			const split = item.split('/')
			return split[split.length - 1]
		})

		this.setState(({ uploadedFiles }) => ({
			uploadedFiles: [
				...uploadedFiles,
				...names
			]
		}))

		this.props.emitter.emit('add-toast', {
			color: 'success',
			id: 'upload-file-success',
			text: <p>Files uploaded successfully</p>
		})

		files.forEach(file => {
			this.uploader.removeFile(file)
		})

		this.props.updateFiles(response)
	}

	removeFile = file => {
		if (this.props.fileAttachments) {
			const files = this.props.fileAttachments.filter(item => {
				const split = item.split('/')
				return split[split.length - 1] !== file
			})
			this.props.updateFiles(files)
		}
		this.setState(({ uploadedFiles }) => ({
			uploadedFiles: uploadedFiles.filter(name => name !== file)
		}))
	}

	setUploader = instance => {
		this.uploader= instance
	}

	render() {
		const { uploadedFiles } = this.state

		return (
			<div className="c-deal-group c-deal-group__files">
				<div className="c-deal-group__header">
					<h5>File Attachments</h5>
				</div>
				<div className="c-deal-group__inputs c-deal-group__inputs-file">
					<File
						allowMultiple={true}
						maxFiles={5}
						onFileSubmit={this.onFileSubmit}
						setUploader={this.setUploader}
						showUpload={true}
					/>
					<div className="c-deal-group__uploaded-files">
						<h4>Uploaded Files</h4>
						{uploadedFiles.length > 0 && uploadedFiles.map(file => (
							<div key={file}>
								<Button color="link" onClick={() => this.removeFile(file)}>Remove</Button>
								<p>{file}</p>
							</div>
						))}
					</div>
				</div>
			</div>
		)
	}
}
