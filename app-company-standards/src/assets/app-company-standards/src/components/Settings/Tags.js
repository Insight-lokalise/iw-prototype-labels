import React, { Fragment, useContext } from "react";
import PropTypes from "prop-types";
import { t } from "@insight/toolkit-utils";

import ExistingTags from "./ExistingTags";
import TagEdit from "./TagEdit";
import { LanguageContext } from "../../lib";
import { Switch } from "../Shared";

// TODO: Switch component
export default function Tags({
  deleteTag,
  editSettings,
  editTag,
  language,
  settings,
  tagDictionary
}) {
  function toggleTags() {
    const { taggingEnabled } = settings;
    editSettings({ ...settings, taggingEnabled: !taggingEnabled });
  }

  function saveTag({ color, id, name }) {
    return editTag({ tag: { color, id, name }, id });
  }

  const { languages } = useContext(LanguageContext);
  return (
    <div>
      <div className="o-grid__item u-1/1 u-margin-bot">
        <h2>{t("Tag setup")}</h2>
      </div>
      <div className="o-grid__item u-1/1">
        <p>
          {t(
            "A tag consists of one or more keywords used to describe a category or product group. This visual labeling system allows an end user to filter and/or search in Company Standards based on the name of the tag. Tags are limited to 20 characters."
          )}
        </p>
      </div>
      <div className="o-grid__item o-grid__item--shrink">
        <Switch
          checked={settings.taggingEnabled}
          id={"tag-switch"}
          onChange={toggleTags}
          name={"tag-switch"}
          label={t("Enable tags")}
        />
      </div>
      {settings.taggingEnabled && (
        <Fragment>
          <TagEdit
            color={"none"}
            editTag={saveTag}
            languages={languages}
            name={{}}
          />
          <ExistingTags
            editTag={saveTag}
            deleteTag={deleteTag}
            language={language}
            languages={languages}
            tagDictionary={tagDictionary}
          />
        </Fragment>
      )}
    </div>
  );
}

Tags.propTypes = {
  deleteTag: PropTypes.func.isRequired,
  editSettings: PropTypes.func.isRequired,
  editTag: PropTypes.func.isRequired,
  language: PropTypes.string.isRequired,
  settings: PropTypes.shape({
    taggingEnabled: PropTypes.bool.isRequired
  }).isRequired,
  tagDictionary: PropTypes.objectOf(
    PropTypes.shape({
      color: PropTypes.string.isRequired,
      id: PropTypes.string.isRequired,
      name: PropTypes.objectOf(PropTypes.string).isRequired
    })
  )
};

Tags.defaultProps = {
  tagDictionary: {}
};
