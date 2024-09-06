import React, { useEffect, useState, useMemo } from 'react'
import { Tooltip } from '@insight/toolkit-react'
import { t } from '@insight/toolkit-utils'
import {
    FILTER_BY_PRODUCT,
    FILTER_PRODUCT_CHECKBOX_SERIALNUM_ASSETTAG,
    FILTER_PRODUCT_CHECKBOX_PARTNER_DATA,
} from './static/FieldValues/FieldValues'
import { DigitalSerialNumber, IncludeInsightPartnerData } from './tooltips'
import { MultiCheckBox } from '../../lib/MultiCheckbox'
import {FILTER_PRODUCTS} from '../../constants';
const FilterProducts = ({ reportsData }) => {
    const {
        categories_flag,
        partnerdata_flag,
        productype_flag,
        subcategoires_flag,
        manufacturers_flag,
        serialnum_assettag_flag,
    } = reportsData

    const hasProductFilters =
        categories_flag ||
        subcategoires_flag ||
        productype_flag ||
        manufacturers_flag
    const hasCheckBox = serialnum_assettag_flag || partnerdata_flag

    if (!(hasProductFilters || hasCheckBox)) {
        return null
    }
    const [selectedFilter, setSelectedFilter] = useState([])
    const [filterProduct, setFilterProduct] = useState([])
    const [filterProductCheckBox, setFilterProductCheckBox] = useState([])
    useEffect(() => {
        // Initialize the selected filter and filter product
        const mapFilters = Object.keys(FILTER_BY_PRODUCT)
            .map((key) => key)
            .map((filter) => {
                if (reportsData[filter]) {
                    return {
                        [filter]: [...reportsData[filter]],
                    }
                }
                return null
            })
        const removeNullFilters = mapFilters?.filter((filter) => filter !== null)
        if (removeNullFilters.length === 0) return
        const filters = removeNullFilters?.reduce((filterA, filterB) => {
            const key = Object.keys(filterB)[0]
            filterA[key] = filterB[key]
            return filterA
        })
        const updatedFilters = subcategoires_flag
            ? { ...filters, subCategories: [] }
            : filters
        setFilterProduct(updatedFilters)
        const selectedFilters = removeNullFilters.reduce((a, b) => {
            const key = Object.keys(b)[0]
            a[key] = []
            return a
        }, {})
        const updatedSelectedFilters = subcategoires_flag
            ? { ...selectedFilters, subCategories: [] }
            : selectedFilters
        setSelectedFilter(updatedSelectedFilters)
    }, [reportsData])

    const updateFiltersHandler = (filterType, value) => {
        const isSelected = selectedFilter[filterType]?.includes(value)
        const selectCategories = filterType === FILTER_PRODUCTS.CATEGORIES
        const selectSubCategories = filterType === FILTER_PRODUCTS.SUB_CATEGORIES
        const filterName = (option) =>
            selectSubCategories
                ? option.cartegoryName + '-' + option.name
                : option.name
        const selectAll = value === FILTER_PRODUCTS.ALL

        if (isSelected) {
            setSelectedFilter({
                ...selectedFilter,
                [filterType]: selectAll
                    ? []
                    : selectedFilter[filterType].filter((filter) => filter !== value),
                ...(selectCategories && selectAll && { subCategories: [] }),
            })
            if (selectCategories) {
                setFilterProduct({
                    ...filterProduct,
                    subCategories: selectAll
                        ? []
                        : filterProduct.subCategories.filter(
                            (subcategory) => subcategory.cartegoryName !== value
                        ),
                })
            }
        } else {
            setSelectedFilter({
                ...selectedFilter,
                [filterType]: selectAll
                    ? [
                        ...filterProduct[filterType].map((filter) => filterName(filter)),
                        value,
                    ]
                    : selectedFilter[filterType].concat(value),
            })
            if (selectCategories) {
                setFilterProduct({
                    ...filterProduct,
                    subCategories: selectAll
                        ? filterProduct.categories
                            .map((category) => category.subCategories)
                            .flat()
                        : filterProduct.categories
                            .filter(
                                (category) =>
                                    selectedFilter.categories.includes(category.name) ||
                                    value === category.name
                            )
                            .map((cat) => cat.subCategories)
                            .flat(),
                })
            }
        }
    }

    const memoizeCheckboxGroup = useMemo(
        () => (filterType) =>
        (
            <div className="c-new-reports-category c-new-reports-input-group c-multi-checkbox">
                <div className="c-new-reports-input-group__title">
                    {t(FILTER_BY_PRODUCT[filterType])}
                </div>
                <MultiCheckBox
                    groupName={FILTER_BY_PRODUCT[filterType]}
                    options={filterProduct[filterType]}
                    selected={selectedFilter}
                    setSelected={updateFiltersHandler}
                    filterType={filterType}
                />
            </div>
        ),
        [selectedFilter, filterProduct]
    )

    const mapFilters =
        selectedFilter &&
        Object.keys(selectedFilter)?.map((filter) => memoizeCheckboxGroup(filter))
    const selectCheckbox = (checkboxValue) => {
        setFilterProductCheckBox((prev) => {
            return prev.includes(checkboxValue)
                ? prev.filter((item) => item !== checkboxValue)
                : [...prev, checkboxValue]
        })
    }
    const mapCheckBox = hasCheckBox && (
        <div class="c-new-reports-category c-new-reports-input-group">
            <fieldset class="c-form__element">
                <div class="c-form__control">
                    {serialnum_assettag_flag && (
                        <div class="c-checkbox__container">
                            <input
                                class="c-checkbox"
                                name={FILTER_PRODUCT_CHECKBOX_SERIALNUM_ASSETTAG.name}
                                type="checkbox"
                                value={FILTER_PRODUCT_CHECKBOX_SERIALNUM_ASSETTAG.value}
                                id={FILTER_PRODUCT_CHECKBOX_SERIALNUM_ASSETTAG.value}
                                checked={filterProductCheckBox?.includes(
                                    FILTER_PRODUCT_CHECKBOX_SERIALNUM_ASSETTAG.value
                                )}
                                onChange={() =>
                                    selectCheckbox(
                                        FILTER_PRODUCT_CHECKBOX_SERIALNUM_ASSETTAG.value
                                    )
                                }
                            />
                            <label
                                class="c-form__label c-form__label--checkbox"
                                for={FILTER_PRODUCT_CHECKBOX_SERIALNUM_ASSETTAG.value}
                            >
                                {FILTER_PRODUCT_CHECKBOX_SERIALNUM_ASSETTAG.checkboxLabel}
                                <Tooltip content={DigitalSerialNumber()}>
                                    <span className="c-tooltip-report">?</span>
                                </Tooltip>
                            </label>
                        </div>
                    )}
                    {partnerdata_flag && (
                        <div class="c-checkbox__container">
                            <input
                                class="c-checkbox"
                                name={FILTER_PRODUCT_CHECKBOX_PARTNER_DATA.name}
                                type="checkbox"
                                value={FILTER_PRODUCT_CHECKBOX_PARTNER_DATA.value}
                                id={FILTER_PRODUCT_CHECKBOX_PARTNER_DATA.value}
                                checked={filterProductCheckBox?.includes(
                                    FILTER_PRODUCT_CHECKBOX_PARTNER_DATA.value
                                )}
                                onChange={() =>
                                    selectCheckbox(FILTER_PRODUCT_CHECKBOX_PARTNER_DATA.value)
                                }
                            />
                            <label
                                class="c-form__label c-form__label--checkbox"
                                for={FILTER_PRODUCT_CHECKBOX_PARTNER_DATA.value}
                            >
                                {FILTER_PRODUCT_CHECKBOX_PARTNER_DATA.checkboxLabel}
                                <Tooltip content={IncludeInsightPartnerData()}>
                                    <span className="c-tooltip-report">?</span>
                                </Tooltip>
                            </label>
                        </div>
                    )}
                </div>
            </fieldset>
        </div>
    )
    return (
        <div className="c-new-reports-container">
            {hasProductFilters && (
                <>
                    <div className="o-grid o-grid--center o-grid--justify-end">
                        <div className="o-grid__item u-1/1">
                            <h2>{t(FILTER_BY_PRODUCT.header)}</h2>
                        </div>
                    </div>
                    <div className="o-grid">{mapFilters}</div>
                </>
            )}

            {hasCheckBox && <div className="o-grid">{mapCheckBox}</div>}
        </div>
    )
}

export default FilterProducts
