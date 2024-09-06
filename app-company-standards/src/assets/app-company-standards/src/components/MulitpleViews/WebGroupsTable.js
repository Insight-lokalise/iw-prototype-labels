import React from 'react'
import PropTypes from 'prop-types'
import { Button } from '@insight/toolkit-react'
import { t } from '@insight/toolkit-utils'

export default function WebGroupsTable({ entityType, hasCategories, listItemFunc, webGroupList }) {
  return (
    <div className="o-grid">
      <div className="o-grid__item u-1/1 u-padding-tiny u-border-bot">
        <div className="o-grid">
          <Button
            className="o-grid__item o-grid__item--shrink c-button--small u-margin-right u-invisible"
            color="primary"
          >
            {t('Shared')}
          </Button>
          <div className="o-grid__item o-grid__item--center u-text-bold">{t('Webgroup/Webgroup #')}</div>
          {hasCategories && <div className="o-grid__item o-grid__item--center u-text-bold">{t('Category name')}</div>}
        </div>
      </div>
      {webGroupList.length > 0 ? (
        webGroupList.map(listItemFunc)
      ) : (
        <div className="o-grid__item u-1/1 u-padding-tiny">
          <div className="o-grid">
            <Button
              className="o-grid__item o-grid__item--shrink c-button--small u-margin-right u-invisible"
              color="primary"
            />
            <div className="o-grid__item o-grid__item--center u-font-size-tiny">
              {entityType ?
                t(`This product group is not currently shared to any other web groups.`) :
                t('No web groups found. Find web groups by searching above')
              }
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

WebGroupsTable.propTypes = {
  entityType: PropTypes.oneOf([false, 'product group', 'category']).isRequired,
  hasCategories: PropTypes.bool,
  listItemFunc: PropTypes.func.isRequired,
  webGroupList: PropTypes.arrayOf(PropTypes.shape({})).isRequired,
}

WebGroupsTable.defaultProps = {
  hasCategories: false,
}
