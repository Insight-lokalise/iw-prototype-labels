import React, { Fragment } from 'react'
import PropTypes from "prop-types";
import { useDispatch, useSelector } from "react-redux";
import cn from 'classnames'
import { t } from "@insight/toolkit-utils";
import { Button, Dropdown, Field, Icon } from '@insight/toolkit-react'
import { Tag } from './Shared/Tags'
import {
  clearFilters,
  selector_allTags,
  selector_language,
  selector_isPinsEnabled,
  selector_taggingEnabled,
  selector_isSharedAccount,
  toggleFilter,
} from "../duck";

export default function FilterView({ rightJustify, isMiniListView }) {
  const dispatch = useDispatch()
  const { allTags: { pins, ...tags }, language, filtersCount, noFilters, isPinsEnabled, taggingEnabled, isSharedAccount } = useSelector(state => {
    const allTags = selector_allTags(state)
    const filtersCount = Object.values(allTags).filter(tag => tag.filterBy).length
    return ({
      allTags,
      language: selector_language(state),
      filtersCount,
      isPinsEnabled: selector_isPinsEnabled(state),
      taggingEnabled: selector_taggingEnabled(state),
      isSharedAccount: selector_isSharedAccount(state)
    })
  });
  const selectedFilterCount = pins.filterBy ? filtersCount + 1 : filtersCount + 0
  const filterText = selectedFilterCount > 0 ? `${filtersCount} ${t('filters applied')}` : t('No filters applied')
  const pinnedOption = () => (
    <div className='o-grid'>
      <div className="o-grid__item o-grid__item--shrink u-margin-right-small">
        <Icon icon="pin" />
      </div>
      <div className="o-grid__item o-grid__item--shrink">
        <span className="u-font-size-tiny">{t('Pinned')}</span>
      </div>
    </div>
  )

  return (
    <Fragment>
      {((Object.keys(tags).length > 0 && taggingEnabled) || !isSharedAccount) && (
        <Fragment>
          <span className={cn("o-grid__item o-grid__item--shrink u-margin-bot-none u-text-bold", { "u-text-right": rightJustify, "u-text-right u-margin-none": isMiniListView, "u-font-size-small": !isMiniListView})}>
            {t("Filter by")}
          </span>
          <Dropdown
            id={"filter-dropdown"}
            position="left"
            className="c-filter-view__dropdown o-grid__item o-grid__item--shrink"
            closeOnDropdownClick={false}
            dropdownMenuClassName="c-filter-view__dropdown-menu"
          >
            <div className="o-grid__item u-1/1 c-cs-filter_removefilter">
              <Button
                className="u-font-size-small"
                color="link"
                onClick={() => dispatch(clearFilters())}
              >
                {t("Remove filters")}
              </Button>
            </div>

            <div className="o-grid c-cs-filter_options">
              {isPinsEnabled && (
                <div className="c-dropdown__item o-grid__item u-1/1">
                  <Field
                    className="u-margin-bot-none"
                    checkboxLabel={pinnedOption()}
                    checked={pins.filterBy}
                    fieldComponent={"Checkbox"}
                    handleChange={() => dispatch(toggleFilter("pins"))}
                    name={"Pinned"}
                  />
                </div>
              )}
              {taggingEnabled
                ? Object.values(tags).map(({ color, filterBy, id, name }) => (
                    <div
                      key={id}
                      className="c-dropdown__item o-grid__item u-1/1"
                    >
                      <Field
                        className="u-margin-bot-none"
                        checkboxLabel={
                          <Tag
                            color={color}
                            hideText={false}
                            text={name[language] || name["en"]}
                          />
                        }
                        checked={filterBy}
                        fieldComponent={"Checkbox"}
                        handleChange={() => dispatch(toggleFilter(id))}
                        name={name[language] || name["en"]}
                        id={id}
                      />
                    </div>
                  ))
                : null}
            </div>
          </Dropdown>
          <p className="c-cs-filter__text u-font-size-tiny">{filterText}</p>
        </Fragment>
      )}
    </Fragment>
  );
}

FilterView.propTypes = {
  rightJustify: PropTypes.bool,
  isMiniListView: PropTypes.bool,
}

FilterView.defaultProps = {
  rightJustify: false,
  isMiniListView: false,
}

