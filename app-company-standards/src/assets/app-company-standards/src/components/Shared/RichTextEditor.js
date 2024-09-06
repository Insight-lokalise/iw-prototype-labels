import React, { useCallback, useState } from 'react'
import ReactQuill from 'react-quill'
import PropTypes from 'prop-types'
import cn from 'classnames'
import { t } from "@insight/toolkit-utils";
import { HelpText, Label } from '@insight/toolkit-react/lib/Form/Components/Decorators'

import { dateFormat } from "./DateDisplay";

const modules = {
  toolbar: [
    ['bold', 'italic'],
    [{ 'list': 'bullet' }, { 'list': 'ordered' }],
    ['link'],
    [{ 'color': [] }, { 'size': [] }]
  ]
}

export default function RichTextEditor({ content, disabled, id, label, lastEditedBy, lastEditedDate, maxLength, onChange }) {
  const [length, setLength] = useState(0)
  const quillRef = useCallback(node => {
    if (node !== null) {
      setLength(node.getEditor().getLength() - 1)
    }
    return node
  }, [])

  function handleChange(newContent, delta, source, editor) {
    const textLength = editor.getLength() - 1
    const allowEdit = maxLength - textLength >= 0
    setLength(textLength)
    onChange(newContent, allowEdit)
  }

  return (
    <div className="o-grid">
      <Label id={id}>{label}</Label>
      <div className="o-grid__item u-1/1">
        <ReactQuill
          onChange={handleChange}
          modules={modules}
          readOnly={disabled}
          ref={quillRef}
          defaultValue={content}
          className={cn('c-cs-admin-rte', { 'c-cs-admin-rte-disabled': disabled })}
        />
      </div>
      <div className="o-grid__item u-1/1">
        <div className="o-grid">
          <div className="o-grid__item u-1/2">
            {lastEditedBy && lastEditedDate && (
              <HelpText id={`${id}-help`}>
                {`${t("Last modified by")} ${lastEditedBy} ${t(
                  "on"
                )} ${dateFormat(lastEditedDate)}`}
              </HelpText>
            )}
          </div>
          <div className="o-grid__item u-1/2">
            <div className="o-grid o-grid--justify-right">
              {maxLength &&
                (maxLength - length >= 0 ? (
                  <div className="o-grid__item u-1/1">
                    <small className="c-character-counter u-font-size-tiny">
                      <strong>{disabled ? 'X' : maxLength - length}</strong>
                      {` ${t("characters remaining")}`}
                    </small>
                  </div>
                ) : (
                  <div className="o-grid__item u-1/1">
                    <small className="c-character-counter u-font-size-tiny">
                      {`${t('Max number of characters')} ${maxLength} ${t('exceeded.')}`}
                    </small>
                  </div>
                ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

RichTextEditor.propTypes = {
  content: PropTypes.string,
  disabled: PropTypes.bool,
  id: PropTypes.string.isRequired,
  label: PropTypes.string,
  lastEditedBy: PropTypes.string,
  lastEditedDate: PropTypes.number,
  maxLength: PropTypes.number,
  onChange: PropTypes.func.isRequired,
}

RichTextEditor.defaultProps = {
  content: '',
  disabled: false,
  label: '',
  lastEditedBy: undefined,
  lastEditedDate: undefined,
  maxLength: 0,
}
