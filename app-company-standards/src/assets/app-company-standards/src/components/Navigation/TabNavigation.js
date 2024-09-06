import React from 'react'
import PropTypes from 'prop-types'
import { Tab, Tabs } from '@insight/toolkit-react'
import { t } from '@insight/toolkit-utils'
import { useHistory, useLocation } from 'react-router-dom'

import ROUTES from '../Shared/constants'
import CatalogActions from './CatalogActions'
// THE DUPLICATE TAB IS COMMENTED TO HIDE FROM COMPANY STANDARDS PILOT - PLEASE LEAVE IN PLACE
// import Duplicate from '../../containers/Settings/DuplicateContainer'

export default function TabNavigation({ isManagerView }, { router }) {
    const history = useHistory()
    const location = useLocation()
    const prepareTabs = () => {
        const catalog = {
            route: ROUTES.STANDARDS,
            id: 'general',
            name: t('Catalog'),
        }
        const settings = {
            route: ROUTES.SETTINGS,
            id: 'tags',
            name: t('Settings'),
        }
        const activity = {
            route: ROUTES.ACTIVITY_LOG,
            id: 'tags',
            name: t('Activity'),
        }
        const tabs = isManagerView ? [catalog, settings] : [catalog, activity, settings]
        return tabs.map(tab => (
            <Tab
                key={tab.id}
                onClick={() => history.push(tab.route)}
            >
                <span className='c-cs-tab__text'>{tab.name}</span>
            </Tab>
        ))
    }

    return (
        <div className="o-grid o-grid--justify-between u-padding-top-none">
            <Tabs className='o-grid__item'>
                {prepareTabs(isManagerView, router)}
            </Tabs>
            {location?.pathname === ROUTES.STANDARDS ? <CatalogActions /> : null}
        </div>
    )
}

TabNavigation.defaultProps = {
    isManagerView: false,
}

TabNavigation.propTypes = {
    isManagerView: PropTypes.bool,
}
