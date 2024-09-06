import { createAction } from '@state/helpers'
import {
    ADD_GROUP,
    ADD_INPUT,
    ADD_SET,
    INIT_BUILDER,
    REMOVE_GROUP,
    REMOVE_INPUT,
    REMOVE_SET,
    SELECT_GROUP,
    UPDATE_FIELDS,
    UPDATE_GROUP,
    UPDATE_LAYOUTS,
    UPDATE_STYLES
} from './types'

export const addGroup = createAction(ADD_GROUP)
export const addInput = createAction(ADD_INPUT)
export const addSet = createAction(ADD_SET)

export const initBuilder = createAction(INIT_BUILDER)

export const removeGroup = createAction(REMOVE_GROUP)
export const removeInput = createAction(REMOVE_INPUT)
export const removeSet = createAction(REMOVE_SET)

export const selectGroup = createAction(SELECT_GROUP)

export const updateFields = createAction(UPDATE_FIELDS)
export const updateGroup = createAction(UPDATE_GROUP)
export const updateLayouts = createAction(UPDATE_LAYOUTS)
export const updateStyles = createAction(UPDATE_STYLES)
