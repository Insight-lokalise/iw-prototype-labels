import React, { useEffect, useRef, useState } from 'react'
import PropTypes from 'prop-types'
import { Button } from '@insight/toolkit-react'

import { uploadFileAttachment } from '@api'
import { File } from '@components'

export default function Files({ passedValues = [], registerHandler }) {
    const { existingFiles, parsedFiles } = passedValues.reduce((acc, file) => {
        const split = file.split('/')
        acc.existingFiles.push(file)
        acc.parsedFiles.push(split[split.length - 1])
        return acc
    }, { existingFiles: [], parsedFiles: []})
    
    const [uploadedFiles, setUploadedFiles] = useState(parsedFiles)
    const currentFiles = useRef(existingFiles)

    const getUploaded = () => {
        return currentFiles.current
    }

    useEffect(() => {
        registerHandler(() => ({
            isFormValid: true,
            key: 'fileAttachments',
            passedValues: getUploaded()
        }))
    }, [])
    
    const uploader = useRef(null)
    const setUploader = instance => uploader.current = instance

    const onFileSubmit = async files => {
        const response = await uploadFileAttachment(files)
        const names = response.map(item => {
            const split = item.split('/')
            return split[split.length - 1]
        })

        currentFiles.current = currentFiles.current.concat(response)
        setUploadedFiles(prev => [...prev, ...names])

        // Display toast
        files.forEach(file => {
            uploader.current.removeFile(file)
        })
    }

    const removeFile = file => {
        if (uploadedFiles.length > 0) {
            const files = uploadedFiles.filter(item => {
                const split = item.split('/')
                return split[split.length -1] !== file
            })
            // updateFiles
        }
        setUploadedFiles(prev => prev.filter(name => name !== file))
    }

    return (
        <div className="c-deal__files">
            <div className="c-deal__files-header">
                <h4>File Attachment</h4>
            </div>
            <div className="c-deal__files-input">
                <File
                    allowMultiple
                    maxFiles={5}
                    onFileSubmit={onFileSubmit}
                    setUploader={setUploader}
                    showUpload
                />
                <div className="c-deal__files-uploaded">
                    <h5>Uploaded Files</h5>
                    {uploadedFiles.length > 0 && uploadedFiles.map(file => (
                        <div key={file}>
                            <Button color="link" onClick={() => removeFile(file)}>Remove</Button>
                            <p>{file}</p>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}
