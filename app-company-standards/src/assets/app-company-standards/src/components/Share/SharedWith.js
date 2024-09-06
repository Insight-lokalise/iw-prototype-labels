import React, { useContext } from 'react'
import PropTypes from 'prop-types'
import { Button } from '@insight/toolkit-react'
import { t } from '@insight/toolkit-utils'

import { LanguageContext } from '../../lib'
import WebGroupsTable from '../MulitpleViews/WebGroupsTable'

export default function ShareWith(props) {
  const { language } = useContext(LanguageContext)

  return (
    <div className="o-grid">
      <h2 className="o-grid__item u-1/1 u-margin-bot-none">{t('Shared with:')}</h2>
      <p className="o-grid__item u-1/1 u-margin-bot u-font-size-tiny">
        {t("You can manually unshare any existing sharing below by clicking 'Unshare', or by editing a shared product group directly.")}
      </p>
      <div className="o-grid__item u-1/1 u-margin-bot">
        <WebGroupsTable
          entityType={props.entityType}
          hasCategories={props.hasCategories}
          webGroupList={props.currentlySharedWebGroups}
          listItemFunc={webGroup => (
            <div key={webGroup.id} className="o-grid__item u-1/1 u-padding-tiny u-border-bot">
              <div className="o-grid">
                <Button
                  className="o-grid__item o-grid__item--shrink c-button--small u-margin-right"
                  color="primary"
                  onClick={props.handleUnshare({
                    categoryId: webGroup.categoryId,
                    id: webGroup.id,
                    name: webGroup.name,
                  })}
                >
                  {t('Unshare')}
                </Button>
                <div className="o-grid__item o-grid__item--center">{`${webGroup.name} / ${webGroup.id}`}</div>
                {props.hasCategories && (
                  <div className="o-grid__item o-grid__item--center">{`${webGroup.categoryName[language]}`}</div>
                )}
              </div>
            </div>
          )}
        />
      </div>
    </div>
  )
}

ShareWith.propTypes = {
  currentlySharedWebGroups: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.number.isRequired,
      name: PropTypes.string.isRequired,
    })
  ).isRequired,
  entityType: PropTypes.oneOf(['product group', 'category']).isRequired,
  handleUnshare: PropTypes.func.isRequired,
  hasCategories: PropTypes.bool.isRequired,
}
