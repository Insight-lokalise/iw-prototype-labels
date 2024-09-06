import React from 'react'
import ReactQuill from 'react-quill'
import PropTypes from 'prop-types'
import { Label } from '@insight/toolkit-react/lib/Form/Components/Decorators'
import { useCreateTnCContext } from '@context'
import { t } from 'api'

const modules = {
  toolbar: [
    [{ 'font': [] }],
    ['bold', 'italic','underline'],
    [{ 'size': ['small', false, 'large', 'huge'] }],
    [{ 'list': 'bullet'}, { 'list': 'ordered' }],
    [{ 'script': 'sub'}, { 'script': 'super' }],
    [{ 'align': [] }],
    [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
    ['link'],
    [{'color': []}]
  ]
}

export default function RichTextEditor({content, id, onChange, name }) {

  const { previewView } = useCreateTnCContext()

  function handleChange(newContent) {
    onChange(newContent)
  }

  return (
    <div className='o-grid u-margin-bot'>
      <Label id={id} required>{ previewView ? t('Terms and Conditions') : t('Content') }:</Label>
      <div className='o-grid__item u-1/1'>
        <ReactQuill
          onChange={handleChange}
          modules={previewView ? { toolbar: false } : modules}
          defaultValue={content}
          name={name}
          readOnly = { previewView }
          value={content}
        />
      </div>
    </div>
  )
}

RichTextEditor.propTypes = {
  content: PropTypes.string,
  id: PropTypes.string.isRequired,
  name: PropTypes.string,
  onChange: PropTypes.func.isRequired,
}

RichTextEditor.defaultProps = {
  content: '',
  name: '',
}
