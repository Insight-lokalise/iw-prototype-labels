import React, { Component } from 'react'
import PropTypes from 'prop-types'

import { t } from '@insight/toolkit-utils/lib/labels'
import { fetchCountries } from './../../models/Address/address'
import { IWSelectField } from './'


export class IWCountryField extends Component {
    constructor() {
        super()
        this.state = {
            countriesList: [],
        }
    }

    componentDidMount() {
        Promise.all([
            fetchCountries(),
        ])
            .then(([countries]) => {
                this.setState({
                    ...this.state,
                    countriesList: countries,
                })
            })
    }

    render() {
        const mappedCountries = this.state.countriesList.map(country => {
            return {
                displayName: country.country,
                value: country.countryCode,
            }
        })
        return (
            <IWSelectField
                optionsArrayOrFunction={mappedCountries}
                {...this.props}
            />
        )
    }
}


IWCountryField.propTypes = {
    label: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    placeholder: PropTypes.string.isRequired,
    required: PropTypes.bool,
    readOnly: PropTypes.bool,
}


IWCountryField.defaultProps = {
    label: 'Country',
    name: 'country',
    placeholder: t('Select a country'),
}
