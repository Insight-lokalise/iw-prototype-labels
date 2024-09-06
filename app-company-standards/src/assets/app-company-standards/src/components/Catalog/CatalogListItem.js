import React, { useContext, useState, useEffect } from "react";
import PropTypes from "prop-types";
import cn from "classnames";
import { Button, Icon, Image } from "@insight/toolkit-react";
import { t } from '@insight/toolkit-utils'
import { useSelector } from 'react-redux'

import { LanguageContext } from "../../lib";
import { DateDisplay, TagList } from "../Shared";
import InvisibleSpacer from "./InvisibleSpacer";
import EditLink from "../Navigation/EditLink";
import CatalogListItemActions from "./CatalogListItemActions";
import { selector_isManagerView } from "../../duck";

export default function CatalogListItem(props) {

  const [isExpanded, setIsExpanded] = useState(props.isExpanded);

  const { language } = useContext(LanguageContext);

  const isManagerView = useSelector(selector_isManagerView)

  useEffect(() => {
    setIsExpanded(props.isExpanded);
  }, [props.isExpanded]);

  const {
    block,
    children,
    draft,
    draggableProvided,
    id,
    imageUrl,
    isSharedChild,
    items,
    labConfigType,
    lastEditedBy,
    lastEditedDate,
    master,
    name = [],
    needsAttention,
    nestLevel,
    parents,
    shared,
    tags,
    categoryId,
  } = props;
  const blockActions = block && isManagerView
  const isFirstLevel = nestLevel === 0;
  const isSecondLevel = nestLevel === 1;
  const isNonConfig = labConfigType === "NONE" || labConfigType === "None";

  return (
    <div
      className={cn("o-grid", {
        "u-margin-bot-tiny": isFirstLevel
      })}
      ref={draggableProvided.innerRef}
      {...draggableProvided.draggableProps}
    >
      <div
        className={cn("o-grid__item u-1/2", {
          "u-background-color__gray u-border-top u-border-bot": isFirstLevel
        })}
      >
        <div className="o-grid o-grid--full-height o-grid--center">
          {nestLevel > 0 && (
            <InvisibleSpacer
              isSmall={nestLevel === 2}
              hasRightBorder={nestLevel === 1}
            />
          )}
          {nestLevel > 1 && (
            <InvisibleSpacer hasRightBorder={nestLevel === 2} />
          )}
          <div
            className={cn("o-grid__item", {
              "u-border-bot": nestLevel > isFirstLevel
            })}
          >
            <div className="o-grid o-grid--full-height o-grid--center">
              <div
                className={cn("o-grid__item o-grid__item--shrink o-box", {
                  "c-catalog-list-item__dnd-icon u-border-right": isFirstLevel,
                  "u-border-right": isSecondLevel,
                  "c-catalog-list-item__dnd-icon--is-expanded": !isFirstLevel
                })}
                {...draggableProvided.dragHandleProps}
              >
                <Icon icon="move" />
              </div>
              {nestLevel !== 2 && (
                <div className="o-grid__item o-grid__item--shrink o-grid__item--center u-padding-side-small">
                  <Button
                    color="none"
                    onClick={() => {
                      setIsExpanded(!isExpanded);
                    }}
                  >
                    {isExpanded ? (
                      <Icon icon="arrow-down" />
                    ) : (
                      <Icon icon="arrow-right" />
                    )}
                  </Button>
                </div>
              )}
              <div
                className={cn("o-grid__item", {
                  "c-catalog-list-item__p-set u-border-left": nestLevel === 2
                })}
              >
                <div className="o-grid o-grid--full-height">
                  {nestLevel !== 2 ? (
                    <div className="o-grid__item o-grid__item--center u-1/6 u-margin-right-tiny">
                      <Image
                        className="c-catalog-list-item__image"
                        image={imageUrl}
                        alt={name[language]}
                      />
                    </div>
                  ) : null}
                  <div className="o-grid__item">
                    <div className="o-grid o-grid--full-height">
                      <div className="o-grid__item o-grid__item--center u-1/1">
                        <div className="o-grid u-padding-left-small">
                          <EditLink
                            className="u-multiline-truncate"
                            id={id}
                            categoryId={categoryId}
                            nestLevel={nestLevel}
                          >
                            <span className="o-grid__item u-1/1 c-cs-product-group__name">
                              {name[language]}
                            </span>
                          </EditLink>
                          {nestLevel === 2 && (
                            <div className="o-grid__item u-1/1 u-font-size-tiny">
                              {`${items.length} ${t(`associated product${items.length > 1 ? 's' : ''}`)}${blockActions ? '' : ' | '}`}
                              { blockActions ? null : (
                                <EditLink id={id} categoryId={categoryId} nestLevel={3}>
                                  {t("Add/Edit products")}
                                </EditLink>
                              )}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div
        className={cn("o-grid__item u-1/2 u-border-right", {
          "u-background-color__gray u-border-top u-border-bot": isFirstLevel,
          "u-border-bot": nestLevel > isFirstLevel
        })}
      >
        <div
          className={cn("o-grid o-grid--full-height o-grid--justify-between", {
            "c-catalog-list-item__p-set": nestLevel === 2
          })}
        >
          <div className="o-grid__item o-grid__item--center u-1/6">
            {!isNonConfig && isSecondLevel && (
              <div className="o-grid o-grid--justify-center">
                <Icon icon="checkmark" />
              </div>
            )}
          </div>
          <div className="o-grid__item o-grid__item--center u-1/6 u-font-size-tiny u-padding-left-small">
            {draft ? t("Draft") : t("Published")}
            {!master && shared && (<><br />{t('Shared')}</>)}
          </div>
          <div className="o-grid__item o-grid__item--center u-1/6">
            <div className="o-grid o-grid--full-height">
              <div className="o-grid__item o-grid__item--center u-1/2">
                <TagList hideTagText tagOrder={tags} />
              </div>
              <div className="o-grid__item o-grid__item--center u-1/2">
                {needsAttention ? (
                  <div title={t('One or more products in the product set needs attention')}>
                    <Icon
                      icon="alert"
                      type="error"
                    />
                  </div>
                ) : null}
              </div>
            </div>
          </div>
          <div className="o-grid__item o-grid__item--center u-2/6">
            <div className="o-grid">
              <div className="o-grid__item o-grid__item--shrink u-font-size-tiny u-margin-left-small">
                {lastEditedBy}
              </div>
            </div>
            <div className="o-grid">
              <div className="o-grid__item o-grid__item--shrink u-font-size-tiny u-margin-left-small">
                <DateDisplay timestamp={lastEditedDate} />
              </div>
            </div>
          </div>
          <div className="o-grid__item u-1/6">
            {blockActions ? null : (
              <div className="o-grid o-grid--full-height o-grid--justify-right">
                <CatalogListItemActions
                  closeListItem={() => {
                    setIsExpanded(false);
                  }}
                  draft={draft}
                  id={id}
                  categoryId={categoryId}
                  isManagerView={isManagerView}
                  isSharedChild={isSharedChild}
                  master={master}
                  parents={parents}
                  shared={shared}
                />
              </div>
            )}
          </div>
        </div>
      </div>
      {isExpanded && children}
    </div>
  );
}

CatalogListItem.propTypes = {
  block: PropTypes.bool.isRequired,
  children: PropTypes.node,
  draft: PropTypes.bool.isRequired,
  draggableProvided: PropTypes.shape({
    draggableProps: PropTypes.object.isRequired,
    dragHandleProps: PropTypes.object.isRequired
  }).isRequired,
  id: PropTypes.string.isRequired,
  imageUrl: PropTypes.string,
  isExpanded: PropTypes.bool,
  isSharedChild: PropTypes.bool,
  labConfigType: PropTypes.oneOfType([PropTypes.string, PropTypes.bool]),
  lastEditedBy: PropTypes.string.isRequired,
  lastEditedDate: PropTypes.number.isRequired,
  master: PropTypes.bool.isRequired,
  name: PropTypes.objectOf(PropTypes.string).isRequired,
  needsAttention: PropTypes.bool.isRequired,
  nestLevel: PropTypes.number.isRequired,
  order: PropTypes.arrayOf(PropTypes.string),
  parents: PropTypes.arrayOf(
    PropTypes.oneOfType([PropTypes.number, PropTypes.string])
  ).isRequired,
  shared: PropTypes.bool.isRequired,
  tags: PropTypes.arrayOf(PropTypes.string)
};

CatalogListItem.defaultProps = {
  children: null,
  imageUrl: undefined,
  isExpanded: false,
  isSharedChild: false,
  labConfigType: false,
  order: [],
  tags: []
};
