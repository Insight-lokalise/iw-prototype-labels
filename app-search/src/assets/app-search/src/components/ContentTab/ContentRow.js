import React from 'react'
import {t} from '@insight/toolkit-utils'

const addHtmlExtension = (path) => {
  return path?.includes('.html') ? path : `${path}.html`;
}

export const ContentRow = ({title, articleDate, path, excerpt, articleType, id, newContentRowUI = false}) => {
  const renderNewContentRow = () => {
    
    return (
      <div className="row" key={id}>
        <div className="medium-12">
          <a className="article-title-content-row title" href={addHtmlExtension(path)}>
            {title}
          </a>
          <p className="u-margin-bot-small">{excerpt}</p>
          <span className="article-label u-margin-bot">
            {t(`${articleType} / ${articleDate}`)}
          </span>
        </div>
      </div>
    )
  }

  const renderContentRow = () => {
    return (
      <div className="row" key={id}>
        <div className="medium-12">
          <a className="title" href={addHtmlExtension(path)}>{title}</a>
          <span className="article-label">
            {t(`${articleType} / ${articleDate}`)}
          </span>
          <span className="article-link">
            <a aria-lable="Read more" href={addHtmlExtension(path)}>
              {path}
            </a>
          </span>
          <p className="article-content">{excerpt}</p>
        </div>
      </div>
    )
  }

  return newContentRowUI ? renderNewContentRow() : renderContentRow();
}
