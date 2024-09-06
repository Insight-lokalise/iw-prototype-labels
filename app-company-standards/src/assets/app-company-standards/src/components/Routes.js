import React, { useContext } from 'react'
import PropTypes from 'prop-types'
import { Route, Redirect } from 'react-router-dom'
import { t } from '@insight/toolkit-utils';

import { UniversalMessageContext } from "./UniversalMessages";
import { Search } from './Search'
import ActivityLogContainer from '../containers/ActivityLogContainer'
import AddEditProductsContainer from '../containers/AddEditProductsContainer'
import Catalog from './Catalog/Catalog'
import CreateCategoryContainer from '../containers/CreateCategoryContainer'
import CreateProductGroupContainer from '../containers/CreateProductGroupContainer'
import CreateProductSetContainer from '../containers/CreateProductSetContainer'
import DuplicateContainer from '../containers/DuplicateContainer'
import EditCategoryContainer from '../containers/EditCategoryContainer'
import EditProductGroupContainer from '../containers/EditProductGroupContainer'
import EditProductSetContainer from '../containers/EditProductSetContainer'
import Settings from './Settings/Settings'
import ShareContainer from '../containers/ShareContainer'
import ScrollToTop from '../lib/ScrollToTop'
import ROUTES from './Shared/constants'

export const ENTITY_TYPES = {
  CATEGORY: 'CATEGORY',
  PRODUCT_GROUP: 'PRODUCT_GROUP',
  PRODUCT_SET: 'PRODUCT_SET',
}

export default function Routes({ isManagerView, webGroupId }) {
  const { setActiveMessage } = useContext(UniversalMessageContext);
  return (
    <div>
      <Route render={ScrollToTop} />
      <Route
        exact
        path={ROUTES.STANDARDS}
        render={({ location }) => (
          <Catalog
            searchPath={{ pathname: ROUTES.SEARCH, search: `?wId=${webGroupId}` }}
            preselectionState={location.state}
          />
        )}
      />
      <Route exact path={ROUTES.ACTIVITY_LOG} render={({ location }) => {
        return (
          (isManagerView && location.pathname.endsWith(t('activity'))) ? <Redirect to={BASE_ROUTE} /> : <ActivityLogContainer />
        )
      }} />
      <Route exact path={ROUTES.SETTINGS} render={() => <Settings isManagerView={isManagerView} />} />
      <Route
        exact
        path={ROUTES.CREATE_CATEGORY}
        render={({ history }) => (
          <CreateCategoryContainer
            isManagerView={isManagerView}
            navigateOnSubmit={preselectionState => {
              history.push({ pathname: ROUTES.CREATE_PRODUCT_GROUP(preselectionState.categoryId), search: `?wId=${webGroupId}` }, preselectionState)
            }}
          />
        )}
      />
      <Route
        exact
        path={ROUTES.CREATE_PRODUCT_GROUP()}
        render={({ history, match }) => (
          <CreateProductGroupContainer
            isManagerView={isManagerView}
            navigateOnSubmit={preselectionState => {
              history.push({ pathname: ROUTES.CREATE_PRODUCT_SET(preselectionState.productGroupId), search: `?wId=${webGroupId}` }, preselectionState)
            }}
            parentId={match.params.id}
          />
        )}
      />
      <Route
        exact
        path={ROUTES.CREATE_PRODUCT_SET()}
        render={({ history, match }) => (
          <CreateProductSetContainer
            isManagerView={isManagerView}
            categoryId={match.params.catId}
            navigateOnSubmit={preselectionState => {
              history.push({ pathname: ROUTES.ADD_EDIT_PRODUCTS(preselectionState.productSetId), search: `?wId=${webGroupId}` }, preselectionState)
            }}
            parentId={match.params.id}
          />
        )}
      />
      <Route
        exact
        path={ROUTES.EDIT_CATEGORY()}
        render={({ match }) => (
          <EditCategoryContainer
            categoryId={match.params.id}
            isManagerView={isManagerView}
            navigateOnSubmit={() => { }}
          />
        )}
      />
      <Route
        exact
        path={ROUTES.EDIT_PRODUCT_GROUP()}
        render={({ history, match }) => (
          <EditProductGroupContainer
            isManagerView={isManagerView}
            productGroupId={match.params.id}
            categoryId={match.params.catId}
            navigateOnSubmit={preselectionState => {
              history.push({ pathname: `${ROUTES.EDIT_PRODUCT_GROUP(preselectionState.categoryId, preselectionState.productGroupId)}`, search: `?wId=${webGroupId}` }, preselectionState)
            }}
          />
        )}
      />
      <Route
        exact
        path={ROUTES.EDIT_PRODUCT_SET()}
        render={({ match }) => (
          <EditProductSetContainer
            isManagerView={isManagerView}
            productSetId={match.params.id}
            categoryId={match.params.catId}
            navigateOnSubmit={() => { }}
          />
        )}
      />
      <Route
        exact
        path={ROUTES.ADD_EDIT_PRODUCTS()}
        render={({ match }) => (
          <AddEditProductsContainer
            isManagerView={isManagerView}
            productSetId={match.params.id}
            categoryId={match.params.catId}
            navigateOnSubmit={() => { }}
          />
        )}
      />
      <Route
        exact
        path={ROUTES.SHARE_CATEGORY()}
        render={({ match }) => <ShareContainer id={match.params.id} viewType={ENTITY_TYPES.CATEGORY} />}
      />
      <Route
        exact
        path={ROUTES.SHARE_PRODUCT_GROUP()}
        render={({ match }) => <ShareContainer id={match.params.id} viewType={ENTITY_TYPES.PRODUCT_GROUP} />}
      />
      <Route
        exact
        path={ROUTES.DUPLICATE_CATEGORY()}
        render={({ history, match }) => (
          <DuplicateContainer
            id={match.params.id}
            messenger={setActiveMessage}
            navigateOnSubmit={preselectionState => {
              history.push({ pathname: ROUTES.STANDARDS, search: `?wId=${webGroupId}` }, preselectionState)
            }}
            viewType={ENTITY_TYPES.CATEGORY}
          />
        )}
      />
      <Route
        exact
        path={ROUTES.DUPLICATE_PRODUCT_GROUP()}
        render={({ history, match }) => (
          <DuplicateContainer
            id={match.params.id}
            categoryId={match.params.catId}
            messenger={setActiveMessage}
            navigateOnSubmit={preselectionState => {
              history.push({ pathname: ROUTES.STANDARDS, search: `?wId=${webGroupId}` }, preselectionState)
            }}
            viewType={ENTITY_TYPES.PRODUCT_GROUP}
          />
        )}
      />
      <Route
        exact
        path={ROUTES.DUPLICATE_PRODUCT_SET()}
        render={({ history, match }) => (
          <DuplicateContainer
            id={match.params.id}
            categoryId={match.params.catId}
            messenger={setActiveMessage}
            navigateOnSubmit={preselectionState => {
              history.push({ pathname: ROUTES.STANDARDS, search: `?wId=${webGroupId}` }, preselectionState)
            }}
            viewType={ENTITY_TYPES.PRODUCT_SET}
          />
        )}
      />
      <Route exact path={ROUTES.SEARCH} component={Search} />
    </div>
  )
}

Routes.propTypes = {
  webGroupId: PropTypes.number.isRequired,
}
