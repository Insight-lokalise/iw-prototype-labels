import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Button } from '@insight/toolkit-react'
import { FilePond, registerPlugin } from 'react-filepond'
import ValidateSizePlugin from 'filepond-plugin-file-validate-size'

import 'filepond/dist/filepond.min.css'

registerPlugin(ValidateSizePlugin)

export default class File extends Component {
	static defaultProps = {
		validateSizeProps: {
			allowFileSizeValidation: true,
			maxFileSize: '5MB',
			maxTotalFileSize: '25MB'
		}
	}

	state = {
		accepted: [],
		rejected: []
	}

	onFileSubmit = () => {
		this.props.onFileSubmit(this.state.accepted)
	}

	onUpdateFiles = files => {
		this.setState({ accepted: files })
		if (this.props.onUpdateFiles) {
			this.props.onUpdateFiles(files)
		}
	}


	render() {
		const { accepted, rejected } = this.state
		const { allowMultiple, maxFiles, setUploader, showUpload, validateSizeProps } = this.props

		return (
			<div className="c-file-upload">
				<FilePond
					allowMultiple={allowMultiple}
					maxFiles={maxFiles}
					ref={setUploader}
					onupdatefiles={this.onUpdateFiles}
					{...validateSizeProps}
				>
					<p>Drop some files here, or click to upload</p>
				</FilePond>
				{showUpload && (
					<div className="c-file__submit">
						<Button color="primary" disabled={!this.state.accepted.length > 0} onClick={this.onFileSubmit}>
							Upload {this.state.accepted.length} files
						</Button>
					</div>
				)}
			</div>
		)
	}	
}
