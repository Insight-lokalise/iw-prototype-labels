import React from "react";
import { Image, TextEllipsis, Icon } from "@insight/toolkit-react";
import { t } from "@insight/toolkit-utils";
import TopicTag from "./TopicTag";

const iconMappings = {
  Podcast: "audio-icon",
  Video: "video-icon",
};

const ContentRowIcon = ({ articleType }) => {
  const icon = iconMappings[articleType];

  return icon ? (
    <div className="c-content-row-image-icon">
      <Icon icon={icon} />
    </div>
  ) : null;
};

export const ContentRowForSolAndSerTab = ({
  title,
  path,
  excerpt,
  articleType,
  id,
  imageUrl,
  topics,
  onTopicChange,
}) => {
  const tooltip = { position: "top" };
  const updatedPath = path?.includes(".html") ? path : `${path}.html`;

  return (
    <div className="o-grid c-content-row-wrapper" key={id}>
      <a className="o-grid__item u-1/3 c-content-row-image-wrapper" href={updatedPath}>
        <Image image={imageUrl} alt={title} className="c-content-row-image" />
        <ContentRowIcon articleType={articleType} />
      </a>
      <div className="o-grid__item">
        <a href={updatedPath} className="o-grid__item u-1/1 u-text-bold c-content-row-article-label">
          {t(`${articleType}`)}
        </a>
        <a href={updatedPath} className="c-content-row-data">
          <div className='o-grid__item u-1/1 article-title article-title-color' id='articleType'>
            <TextEllipsis length={120} className="u-text-bold" id={`articleType_${id}`} tooltip={tooltip}>
              {title}
            </TextEllipsis>
          </div>
          <div className="o-grid__item u-1/1 c-content-row-description">
            <TextEllipsis length={180}>
              {excerpt}
            </TextEllipsis>
          </div>
        </a>
        <div className="o-grid">
          {topics?.map((item) => (
            <TopicTag key={item} tagName={item} onTopicChange={onTopicChange} />
          ))}
        </div>
      </div>
    </div>
  )
};
