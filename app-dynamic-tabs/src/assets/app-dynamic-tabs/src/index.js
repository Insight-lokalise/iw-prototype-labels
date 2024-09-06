import React from 'react'
import { render } from 'react-dom'
import { fetchTabsConfig } from 'api'
import { generateUniqueId, t } from '@insight/toolkit-utils';
import {DynamicTabs, Tab} from '@insight/toolkit-react'

import './scss/index.scss'
import ReactHtmlParser from "react-html-parser";

export function createDynamicTabsInstance(elementId,componentPath) {

  const element = document.getElementById(elementId);
  let AUTO_ROTATE_INTERVAL=5000;

  let getTabView = (tab,index) => {
    const { tabName, tabIcon, iconAltText } = tab;
    const icon = !!tabIcon?`<div><img class="app-dynamic-tabs--icon" alt="${iconAltText}" src="${tabIcon}"></div>`:"";
    const name=`<div>${icon}<div>${t(tabName)}</div></div>`;
    return name;
  }

  let getContentView = (tab,index) => {
    const { contentDescription, contentImage, imageAltText } = tab;
    let contentLayout= tab.contentDisplay=="image-left-text-right"?" app-dynamic-tabs--image-left":
      tab.contentDisplay=="text-left-image-right"?" app-dynamic-tabs--image-right":" app-dynamic-tabs--no-image"
    return `<div class="app-dynamic-tabs--content-layout${contentLayout}">
      <div class="app-dynamic-tabs--text">
        ${contentDescription}
      </div>
      <div class="app-dynamic-tabs--image">
        <img alt="${imageAltText}" src="${contentImage}">
      </div>
    </div>`;
  }

  fetchTabsConfig(componentPath).then((response) => {
    const config = response.data;
    const tabs = config.dynamicTabsList;
    const newTabs = tabs.map((tab,index) => {
      const id="dynamicTabs-"+config.uuid+"-tab-"+index;
      const name = getTabView(tab,index);
      const content = ReactHtmlParser(getContentView(tab,index));
      return {id: id, name, content};
    });
    const isAutoRotate = (config.autoRotate == "true");
    const layout = config.layout;
    const mobileLayout = config.mobileLayout;
    const isCarousel = (layout == "singleContentCarousel")
    const isVertical = (layout == "verticalLeftAlign")
    const tabsAlign = (layout == "horizontalLeftAligned"?"left":"center")
    const carouselOverlap = false;

    var renderContainer = () => {
      return render(<DynamicTabs className="ds-v1 app-dynamic-tabs"
        id={"dynamicTabs-"+config.uuid}
        autoRotate={isAutoRotate}
        autoRotateInterval={AUTO_ROTATE_INTERVAL}
        carousel={isCarousel}
        carouselOverlap={carouselOverlap}
        layout={layout}
        mobileLayout={mobileLayout}
        tabs={newTabs}
        tabsAlign={tabsAlign}
        vertical={isVertical}
      ></DynamicTabs>, element)
    }
    return renderContainer();
  });
}
