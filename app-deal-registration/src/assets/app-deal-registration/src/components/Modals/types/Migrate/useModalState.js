import { useReducer, useState } from 'react'

function reducer(state, { payload, type }) {
    switch (type) {
        case 'RESET': {
            return {
                ...state,
                currentlySelected: '',
                error: undefined,
                isLoading: false,
                migrationType: '',
                response: undefined
            }
        }
        case 'SET_ERROR': {
            return { ...state, error: payload, isLoading: false }
        }
        case 'SET_LOADING': {
            return { ...state, error: undefined, isLoading: true }
        }
        case 'SET_MIGRATION_TYPE': {
            return { ...state, migrationType: payload }
        }
        case 'SET_RESPONSE': {
            return { ...state, error: undefined, isLoading: false, response: payload }
        }
        case 'SET_SELECTED': {
            return { ...state, currentlySelected: payload }
        }
        default: {
            return state
        }
    }
}

export default function useModalState() {
    return useReducer(reducer, {
        currentlySelected: '',
        error: undefined,
        isLoading: false,
        migrationType: '',
        response: undefined
    })
}