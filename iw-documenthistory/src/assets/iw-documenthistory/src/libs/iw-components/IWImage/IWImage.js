import React, { useState } from "react";
import PropTypes from "prop-types";
import FallbackImage from "@insight/toolkit-react/lib/Image/FallbackImage.js";

/**
 * A component that wraps a <img> tag.
 * Enforces an alt attribute and defaults to a fallback image.
 *
 * TODO:
 *  - Lazy load
 *  - Display a loading icon while the image is loading
 *
 * @param {props} { src, ...rest } alt is required.
 */
export function IWImage({ src, ...rest }) {
  const [error, setError] = useState(false);

  if (!src || src === "image.not.available" || error) {
    return (
      <picture>
        <FallbackImage />
      </picture>
    );
  }
  return <img src={src} onError={() => setError(true)} {...rest} />;
}

IWImage.propTypes = {
  src: PropTypes.string,
  alt: PropTypes.string.isRequired,
};
