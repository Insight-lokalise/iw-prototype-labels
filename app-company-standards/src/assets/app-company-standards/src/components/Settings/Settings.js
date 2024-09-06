import React from 'react'
import { t } from '@insight/toolkit-utils'

import GeneralSettings from '../../containers/Settings/SettingsContainer'
import TagEdit from '../../containers/Settings/TagEditContainer'
// THE DUPLICATE TAB IS COMMENTED TO HIDE FROM COMPANY STANDARDS PILOT - PLEASE LEAVE IN PLACE
// import Duplicate from '../../containers/Settings/DuplicateContainer'

export default function Settings({ isManagerView }) {
  return (
    <div className="o-box u-padding-top-none">
      <h2 className={'c-settings-tab__title u-text-bold'}>{t('Settings')}</h2>
      <GeneralSettings isManagerView={isManagerView} />
      <TagEdit />
    </div>
  )
}

const prepareTabs = (isAdmin) => {
  const general = {
    className: 'c-cs-settings-tab c-button--link',
    content: <GeneralSettings />,
    id: 'general',
    name: t('General'),
  }
  const tags = {
    className: 'c-cs-settings-tab c-button--link',
    content: <TagEdit />,
    id: 'tags',
    name: t('Tags'),
  }
  // THE DUPLICATE TAB IS COMMENTED TO HIDE FROM COMPANY STANDARDS PILOT - PLEASE LEAVE IN PLACE
  // const duplicate = {
  //   className: 'c-cs-settings-tab c-button--link u-show@tablet',
  //   content: <Duplicate />,
  //   id: 'duplicate',
  //   name: t('Duplicate'),
  // }
  const tabs = [general, tags]
  // THE DUPLICATE TAB IS COMMENTED TO HIDE FROM COMPANY STANDARDS PILOT - PLEASE LEAVE IN PLACE
  // if (isAdmin) tabs.push(duplicate)
  return tabs
}
