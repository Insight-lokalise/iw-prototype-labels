import React, { useCallback, useEffect, useRef, useState } from 'react'
import PropTypes from 'prop-types'
import { useSelector } from 'react-redux'
import {Accordion, Button, Modal} from '@insight/toolkit-react'

import { Form } from '@components'
import { FieldContext, FieldProvider, useBuilderContext } from '../../context'
import FieldDisplay from './FieldDisplay'
import ConfirmationDeleteModal from './ConfirmationDeleteModal'

export default function FieldWrapper({ getItemProps, id }) {
    const initialField = useSelector(state => state.builder.inputs[id])
    const { isConditional, name, sets } = initialField

    const formRef = useRef(null)
    const setFormRef = form => { formRef.current = form }
    const { dispatcher, fields } = useBuilderContext()
    const [openModal, setIsopenModal] = useState(false)
    const [fieldName, setfieldName] = useState('')
    
    useEffect(() => {
        const unsubscribe = fields.registerField(id, formRef.current)
        return () => unsubscribe()
        // Should probably unregister on unmount.. but keep the value in the state..
        // Meaning tracking the mounted status of this component
    }, [id])

    const addSet = e => dispatcher.addSet(id)
    const removeInput = e => dispatcher.removeInput(id)
    const showModal = field => {
      setIsopenModal(true)
      setfieldName(field)
    }
    const closeModal = e => setIsopenModal(false)

    return (
        <div>
          {openModal &&
            <ConfirmationDeleteModal
              closeModal={closeModal}
              fieldName={fieldName}
              removeInput={removeInput}
            />
          }
          <FieldProvider isConditional={isConditional} name={name}>
              <FieldContext.Consumer>
                  {({ fieldName }) => (
                      <Accordion.Item
                          {...getItemProps()}
                          extraAction={<Button color="link" icon="trashcan" onClick={() => showModal(fieldName)} />}
                          id={id}
                          label={fieldName || 'nameless field'}
                      >
                          <Form formRef={setFormRef} initialValues={initialField}>
                              <FieldDisplay
                                  addSet={addSet}
                                  dispatcher={dispatcher}
                                  id={id}
                                  sets={sets}
                              />
                          </Form>
                      </Accordion.Item>
                  )}
              </FieldContext.Consumer>
          </FieldProvider>
        </div>
    )
}

FieldWrapper.propTypes = {
    getItemProps: PropTypes.func.isRequired,
    id: PropTypes.string.isRequired
}
