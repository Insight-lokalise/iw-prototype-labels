import React from "react";
import PropTypes from "prop-types";
import { TagPinContainer } from "./Shared";

export default function CatalogListViewHeaders({
  category: { id, tags },
  isMiniListView
}) {
  return (
    <TagPinContainer
      showPin={id}
      pinOptions={{ id }}
      showTags={tags}
      tagOptions={{
        iconContainerClassName: "c-cs-mini-list__tags",
        layout: "horizontal",
        tagOrder: tags,
        isMiniListView
      }}
    />
  );
}

CatalogListViewHeaders.propTypes = {
  isMiniListView: PropTypes.bool.isRequired,
  category: PropTypes.shape({
    id: PropTypes.string.isRequired,
    tags: PropTypes.arrayOf(PropTypes.string).isRequired
  }).isRequired
};
