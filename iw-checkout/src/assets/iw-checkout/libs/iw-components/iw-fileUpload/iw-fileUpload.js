import React, {Component} from 'react'
import PropTypes from 'prop-types'

import { t } from '@insight/toolkit-utils/lib/labels'
import { FieldErrorMessage, FieldLabel } from './../iw-form/formSFCs'
import { IWAnchor } from '../../../libs/iw-components'

const allowedFileTypes = [
    'txt', 'csv', 'doc', 'docx',
    'msg', 'odt', 'rtf', 'zip',
    'wpd', 'wps', 'pps',
    'ppt', 'pptx', 'mpp',
    'xls', 'xlsb', 'xlr',
    'xlsx', 'pdf', 'jpeg',
    'gif', 'png', 'bmp',
]

function validateFile(allowedFileTypes, { size, name }) {
    let errors = []
    const fileNameArray = name.split('.')
    const fileType = fileNameArray[fileNameArray.length - 1]
    if (size > 5 * 1024 * 1024) {
        errors.push(`${t('File size is more than 5 MB')}`)
    } else if (!allowedFileTypes.includes(fileType)) {
        errors.push(`${t('File type not supported')}`)
    }
    return errors
}

export class IWFileUpload extends Component {
    constructor(props) {
        super(props)
        this.state = {
            showError: false,
            errors: [],
        }
    }

    handleButtonClick = () => {
        this.openFileInput()
    };

    handleButtonKey = e => {
        if (e.key === 'Enter') {
            this.openFileInput()
        }
    };

    handleFileUpload = event => {
        const file = event.target.files[0]
        const errors = validateFile(allowedFileTypes, file)
        if (errors.length > 0) {
            this.setState({
                showError: true,
                errors,
            })
        } else {
            // valid file , initiate file upload
            // expect a upload method from props
            // this.refs.file.getDOMNode().files[0];
            this.setState({
                showError: false,
                errors: [],
            })
            this.props.handleFileSubmit(this.refs.fileUpload.files[0])
        }
    };

    openFileInput() {
        // Manually trigger the "click" event on the hidden input
        if (this.refs.fileUpload) {
            this.refs.fileUpload.click()
        }
    }

    render() {
        const { label, hideLabel = false, required = false, name, isUploadPending, uploadedFileName } = this.props
        const chooseFileText = t('Choose a file...')
        const uploadingFileText = t('Uploading file...')
        const removeFileText = t('Remove the attachment.')
        const maximumFileSizeText = t('Maximum file size 5 MB')
        const error = this.state.errors.join(',') || ''

        return (
            <div>
                <FieldLabel htmlFor="fileUpload" className="form__label--readonly" label={label} hideLabel={hideLabel} required={required}
                    name={name} showHelpIcon tooltip={<UploadHelp />} tooltipClass='iw-tooltippy__content--large'/>
                <input id="fileUpload" type="file" ref="fileUpload" name="fileUpload"
                    className="show-for-sr" onChange={this.handleFileUpload}/>
                <div className="row row__gutter--tiny collapse align-middle form__file-wrapper">
                    <div className="columns">
                        <p 
                            className="button expanded hollow small no-margin-bot form__file"
                            onClick={this.handleButtonClick}
                            onKeyDown={this.handleButtonKey}
                            tabIndex="0"
                        >
                            {uploadedFileName || (isUploadPending ?
                                <span><i className="ion ion-load-d"></i>{uploadingFileText}</span>
                                :
                                <span><i className="ion ion-ios-upload-outline"></i>{chooseFileText}</span>
                            )}
                        </p>
                    </div>
                    { uploadedFileName &&
                        <div className="columns shrink">
                            <IWAnchor className="ion--right ion-close" title={removeFileText} onClick={this.props.handleDeleteFile}>
                                <span className="show-for-sr">{removeFileText}</span>
                            </IWAnchor>
                        </div>
                    }
                </div>
                <div className="form__help-text">{maximumFileSizeText}</div>
                <FieldErrorMessage showError={this.state.showError} messageText={error}/>
            </div>
        )
    }
}

function UploadHelp() {
    return (
        <div>
            <p>{t('Files can be up to 5MB in size and one of the following types:')}</p>
            <ul>
                <li>Zip (.zip)</li>
                <li>Text (.csv, .txt, .doc, .docx, .msg, .odt, .rtf, .wpd, .wps)</li>
                <li>Data (.pps, .ppt, .pptx, .mpp)</li>
                <li>Spreadsheet (.xlsb, .xlx, .xir, .xlsx)</li>
                <li>Page layout (.pdf)</li>
                <li>Image (.jpeg, .gif, .png, .bmp)</li>
            </ul>
        </div>
    )
}

IWFileUpload.propTypes = {
    label: PropTypes.string.isRequired,
    hideLabel: PropTypes.bool,
    required: PropTypes.bool,
    name: PropTypes.string.isRequired,
    handleFileSubmit: PropTypes.func.isRequired,
    handleDeleteFile: PropTypes.func,
    isUploadPending: PropTypes.bool,
    uploadedFileName: PropTypes.string,
}
