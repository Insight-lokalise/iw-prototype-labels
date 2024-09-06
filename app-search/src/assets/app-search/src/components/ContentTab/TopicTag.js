import React from "react";


const TopicsTag = ({tagName, onTopicChange}) => {
  return (
     <button
      className="c-tag-wrapper" 
      aria-label={`${tagName} Filter`}
      onClick={()=>{onTopicChange({group: 'allKeywords_ss', val: tagName })}}
    >
      <span className="c-tag-name u-text-bold">{tagName}</span>
     </button>
  );
}

export default TopicsTag