import React, { Fragment, useState, useContext } from 'react'
import PropTypes from 'prop-types'
import { Button, Dropdown, Icon } from '@insight/toolkit-react'
import { t } from '@insight/toolkit-utils'
import { useDispatch } from "react-redux"
import Popover from "../Popover/Popover";

import ROUTES from '../Shared/constants'
import EditLink from '../Navigation/EditLink'
import Link from '../Navigation/Link'
import { UniversalMessageContext, MESSAGE_TYPES } from "../UniversalMessages";
import { useHistory } from "react-router-dom";
import { publishEntity, removeCategory, removeProductGroup, removeProductSet } from '../../duck'

export default function CatalogListItemActions({
  closeListItem,
  draft,
  id,
  categoryId,
  isManagerView,
  master,
  parents,
  shared,
}) {
  const shareFlag = true // window.flags && window.flags['GNA-11032-SHARE-LINK']
  const nestLevel = parents.length - 1
  const [isOpen, setIsOpen] = useState(false);
  const { setActiveMessage } = useContext(UniversalMessageContext);
  const history = useHistory();
  const dispatch = useDispatch();

  const deleteItem = () => {
    switch (parents.length) {
      case 1:
        dispatch(removeCategory({ id }))
        break
      case 2:
        dispatch(removeProductGroup({ id, parentId: categoryId }))
        break
      case 3:
        dispatch(removeProductSet({ id, parentId: parents[2] }))
        break
      default:
    }
  }

  const publishItem = publish => {
    switch (parents.length) {
      case 1:
        dispatch(publishEntity({ data: { draft: !publish, id }, type: 'category' }))
        break
      case 2:
        dispatch(publishEntity({ data: { draft: !publish, id }, type: 'productGroup' }))
        break
      case 3:
        dispatch(publishEntity({ data: { draft: !publish, id }, type: 'productSet' }))
        break
      default:
    }
  }

  const sharePathname = () => {
    switch (nestLevel) {
      case 0:
        return ROUTES.SHARE_CATEGORY(id)
      case 1:
        return ROUTES.SHARE_PRODUCT_GROUP(id)

      default:
        return undefined
    }
  }

  const duplicatePathname = () => {
    switch (nestLevel) {
      case 0:
        return ROUTES.DUPLICATE_CATEGORY(id)
      case 1:
        return ROUTES.DUPLICATE_PRODUCT_GROUP(id, categoryId)
      case 2:
        return ROUTES.DUPLICATE_PRODUCT_SET(id, categoryId)
      default:
        return undefined
    }
  }

  const popoverMsg = {
    0: t("All product groups associated with this category will be deleted. Are you sure you want to delete this category?"),
    1: t("All product sets associated with this product group will be deleted. Are you sure you want to delete this product group?"),
    2: t("Are you sure you want to delete this product set?"),
  };

  const activateDeleteAction = msg => {
    deleteItem().then(() => {
      setActiveMessage({
        text: msg,
        type: MESSAGE_TYPES.SUCCESS
      })
    }).catch(() => {
      setActiveMessage({
        text: t('An error occured. Please try again.'),
        type: MESSAGE_TYPES.ERROR
      })
    })
  }

  const handleDeleteItem = () => {
    const cMsg = t('Category deleted successfully')
    const pGMsg = t('Product group deleted successfully')
    const pSMsg = t('Product set deleted successfully')
    switch (nestLevel) {
      case 0:
        activateDeleteAction(cMsg)
        break
      case 1:
        activateDeleteAction(pGMsg)
        break
      case 2:
        activateDeleteAction(pSMsg)
        break
      default:
        break
    }
  }

  function handleShareNavigation() {
    history.push(sharePathname());
  }

  return (
    <Fragment>
      <Dropdown
        className="o-grid__item o-grid__item--center o-grid__item--shrink c-cs-actions__dropdown"
        icon="ellipsis-horizontal"
        color="link"
        id={`${id}-dropdown`}
        position="right"
        size="small"
      >
        <EditLink
          className="c-dropdown__item u-text-right"
          id={id}
          categoryId={categoryId} 
          nestLevel={nestLevel}
        >
          <span className="u-margin-right-tiny">{t("Edit")}</span>
          <Icon icon="create" />
        </EditLink>
        {nestLevel === 2 && master && (
          <EditLink
            className="c-dropdown__item u-text-right"
            id={id}
            categoryId={categoryId} 
            nestLevel={3}
          >
            <span className="u-margin-right-tiny">{t("Add/Edit products")}</span>
            <Icon icon="add" />
          </EditLink>
        )}
        {/* <Button color="link" className="c-dropdown__item u-text-right" isDisabled={true}>
          <span className="u-margin-right-tiny">{'Preview'}</span>
          <Icon icon="eye" />
        </Button> */}
        {draft ? (
          <Button
            color="link"
            className="c-dropdown__item u-text-right"
            isDisabled={!master}
            onClick={() => {
              publishItem(true);
              closeListItem();
            }}
          >
            <span className="u-margin-right-tiny">{t("Publish")}</span>
            <Icon icon="keypad" />
          </Button>
        ) : (
          <Button
            color="link"
            className="c-dropdown__item u-text-right"
            isDisabled={shared && !master}
            onClick={() => {
              publishItem(false);
              closeListItem();
            }}
          >
            <span className="u-margin-right-tiny">{t("Set to draft")}</span>
            <Icon icon="desktop" />
          </Button>
        )}
        {/* {nestLevel !== 2 && (
          <Button
            color="link"
            className="c-dropdown__item u-text-right"
            isDisabled
          >
            <span className="u-margin-right-tiny">{t("Share")}</span>
            <Icon icon="people" />
          </Button>
        )}
        <Button
          color="link"
          className="c-dropdown__item u-text-right"
          isDisabled={true}
        >
          <span className="u-margin-right-tiny">{t("Duplicate")}</span>
          <Icon icon="copy" />
        </Button> */}
        {nestLevel === 1 && !isManagerView && shareFlag && (
          <Button
            color="link"
            className="c-dropdown__item u-text-right"
            isDisabled={!master}
            onClick={handleShareNavigation}
          >
            <span className="u-margin-right-tiny">{t("Share")}</span>
            <Icon icon="people" />
          </Button>
        )}
        <Link
          className="c-dropdown__item u-text-right u-text-bold"
          to={{ pathname: duplicatePathname() }}
          disabled={nestLevel === 2 && !master}
        >
          <span className="u-margin-right-tiny">{t("Duplicate")}</span>
          <Icon icon="copy" />
        </Link>
        <Button
          color="link"
          className="c-dropdown__item u-text-right"
          onClick={() => setIsOpen(!isOpen)}
          isDisabled={nestLevel === 2 && !master}
        >
          <span className="u-margin-right-tiny">{t("Delete")}</span>
          <Icon icon="trashcan" />
        </Button>
      </Dropdown>
      <Popover isOpen={isOpen}>
        <div className="o-grid">
          <span className="c-popover__outer-arrow--up">
            <span className="c-popover__inner-arrow--up" />
          </span>
          <div className="o-grid__item u-1/1 u-font-size-small">
            <div className="o-grid c-cs-popover__message">
              <span>{popoverMsg[nestLevel]}</span>
            </div>
            <div className="o-grid o-grid--justify-around">
              <Button
                color="link"
                onClick={() => setIsOpen(false)}
              >
                {t('Cancel')}
              </Button>
              <Button color="link" onClick={handleDeleteItem}>
                {t('Delete')}
              </Button>
            </div>
          </div>
        </div>
      </Popover>
    </Fragment>
  );
}

CatalogListItemActions.propTypes = {
  closeListItem: PropTypes.func.isRequired,
  draft: PropTypes.bool.isRequired,
  id: PropTypes.string.isRequired,
  isManagerView: PropTypes.bool.isRequired,
  master: PropTypes.bool.isRequired,
  parents: PropTypes.arrayOf(PropTypes.oneOfType([PropTypes.number, PropTypes.string])).isRequired,
  shared: PropTypes.bool.isRequired,
}
