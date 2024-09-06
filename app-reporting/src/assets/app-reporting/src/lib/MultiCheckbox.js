import React, { useState, useEffect } from 'react'
import { Field, Button, Icon } from '@insight/toolkit-react'
import { t } from '@insight/toolkit-utils'
import { CREATE_REPORT } from '../texts'
import { ALL_OPTIONS } from '../components/NewReports/static/FieldValues/FieldValues'
const { SEARCH_FOR_FIELDS, NO_RESULTS_FOUND } = CREATE_REPORT
import { FILTER_PRODUCTS } from '../constants'
export const MultiCheckBox = ({
    options,
    selected,
    setSelected,
    groupName,
    filterType,
}) => {
    const [filterOptions, setFilterOptions] = useState(null)
    const [allOptions, setAllOptions] = useState([])
    const isSubCategory = filterType === FILTER_PRODUCTS.SUB_CATEGORIES
    const hasOptions = allOptions.length > 0
    const checkboxDisabled = allOptions.length <= 1 && allOptions[0]?.value === FILTER_PRODUCTS.ALL
    const updateAllOption = ALL_OPTIONS.map((option) => ({
        checkboxLabel: option?.description || option?.name || option?.value,
        id: option?.value + '-' + filterType,
        checked: selected[filterType].includes(option?.value),
        value: option?.value,
    }))
    const updateOptions = (opt) => {
        const optionID = (item) =>
            isSubCategory
                ? item.cartegoryName + '-' + item.name
                : item?.value || item?.name
        return opt.map((option) => ({
            checkboxLabel: option?.description || option?.name || option?.value,
            id: optionID(option),
            checked: selected[filterType].includes(optionID(option)),
            value: isSubCategory
                ? option.cartegoryName + '-' + option.name
                : option?.name,
        }))
    }
    // setups the initial options before passing it to the Field component
    useEffect(() => {
        setAllOptions([...updateAllOption, ...updateOptions(options)])
    }, [options, selected])

    // filters the options based on the search input
    useEffect(() => {
        if (filterOptions === null || filterOptions === '') {
            setAllOptions([...updateAllOption, ...updateOptions(options)])
            return
        }
        setAllOptions(
            updateOptions(
                options.filter(
                    (option) =>
                        option?.description
                            ?.toLowerCase()
                            ?.includes(filterOptions?.toLowerCase()) ||
                        option?.name?.toLowerCase()?.includes(filterOptions?.toLowerCase())
                )
            )
        )
    }, [filterOptions, selected])

    return (
        <div class="c-form__element">
            <div class="c-form__control">
                <div class="c-select-container c-select-container--block">
                    <div className="o-grid">
                        <div className="o-grid__item ">
                            <Field
                                fieldComponent="Text"
                                name="search"
                                type="search"
                                placeholder={t(SEARCH_FOR_FIELDS)}
                                onChange={(e) => setFilterOptions(e.target.value)}
                                value={filterOptions}
                            />
                        </div>
                        <div className="o-grid__item o-grid__item--shrink">
                            <Button
                                className="c-multi-checkbox__search-button"
                                color="subtle"
                                onClick={() => { }}
                            >
                                <Icon icon="search" title={t(groupName)} />
                            </Button>
                        </div>
                    </div>
                    {hasOptions ? (
                        <Field
                            fieldComponent="CheckboxGroup"
                            name={groupName}
                            options={allOptions}
                            onChange={(e) => setSelected(filterType, e.target.value)}
                            disabled={checkboxDisabled}
                        />
                    ) : (
                        <div className="c-multi-checkbox__no-results">
                            {t(NO_RESULTS_FOUND)} "{filterOptions}"
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}
