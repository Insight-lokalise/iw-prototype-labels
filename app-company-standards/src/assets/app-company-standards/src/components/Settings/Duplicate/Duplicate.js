import React, { Fragment, useContext, useMemo, useReducer } from 'react'
import PropTypes from 'prop-types'
import { t } from '@insight/toolkit-utils'
import { Button, ButtonGroup, Icon } from '@insight/toolkit-react'

import { duplicateStandards } from '../../../api'
import { ModalContext, MODALS } from '../../Modals'
import FindWebGroup from '../../MulitpleViews/FindWebGroup'
import { createReducer } from '../../../lib'
import { MESSAGE_TYPES, UniversalMessageContext } from "../../UniversalMessages";


const initialState = {
  disableDuplicate: true,
  id: '',
  message: '',
  messageType: MESSAGE_TYPES.ERROR,
}

export default function Duplicate({ parentId }) {
  const reducer = useMemo(() => createReducer(initialState), [])
  const [state, dispatch] = useReducer(reducer, initialState)
  const { setActiveModal } = useContext(ModalContext)
  const { setActiveMessage } = useContext(UniversalMessageContext)

  function startDuplicate() {
    setActiveModal(MODALS.DUPLICATE, { onConfirm: runDuplicateStandards })
  }

  async function runDuplicateStandards() {
    try {
      await duplicateStandards({ sourceId: parentId, destinationId: state.id })
      dispatch({ type: 'RESET' })
      setActiveMessage({
        text: `${t('Duplication successfully initiated to webgroup:')} ${state.id}.`,
        type: MESSAGE_TYPES.SUCCESS,
      })
    } catch (e) {
      setActiveMessage({
        text: t('Duplication failed. Please try again later.'),
        type: MESSAGE_TYPES.ERROR,
      })
    }
  }

  function findWebGroup({ badId, id, name }) {
    dispatch({ type: 'RESET' })
    if (id === parentId) {
      dispatch({
        type: 'SET',
        payload: {
          message: (
            <Fragment>
              <Icon icon="information-circled" className="c-form__error-icon" />
              {t('Cannot duplicate to same webgroup.')}
            </Fragment>
          ),
          messageType: MESSAGE_TYPES.ERROR,
        }
      })
    } else if (badId) {
      dispatch({
        type: 'SET',
        payload: {
          message: (
            <Fragment>
              <Icon icon="information-circled" className="c-form__error-icon" />
              {`${t('Webgroup not found:')} ${badId}`}
            </Fragment>
          ),
          messageType: MESSAGE_TYPES.ERROR,
        }
      })
    } else {
      dispatch({
        type: 'SET',
        payload: {
          disableDuplicate: false,
          id,
          message: (
            <Fragment>
              <Icon icon="checkmark-circled" className="c-form__error-icon" />
              {`${name}/${id}`}
            </Fragment>
          ),
          messageType: MESSAGE_TYPES.SUCCESS,
        }
      })
    }
  }

  return (
    <div>
      <p>
        {t(
          'Duplicate will create a copy of this entire company standards to the selected web group. ' +
          'This will overwrite any existing Company Standards that have been created in the selected web group.'
        )}
      </p>
      <h2>{t('Duplicate to')}</h2>
      <div className="o-grid">
        <div className="o-grid__item u-1/1 u-1/2@tablet">
          <FindWebGroup handleFind={findWebGroup} message={state.message} messageType={state.messageType} />
        </div>
      </div>
      <hr />
      <ButtonGroup align="right">
        <Button color="primary" isDisabled={state.disableDuplicate} onClick={startDuplicate}>
          {t('Duplicate')}
        </Button>
      </ButtonGroup>
    </div>
  )
}

Duplicate.propTypes = {
  parentId: PropTypes.number.isRequired,
}
