import React, { useContext, useEffect } from 'react'
import { Breadcrumbs, Icon } from '@insight/toolkit-react'
import { getCurrentLocale, t } from '@insight/toolkit-utils'
import { PDPContext } from '../../context'

export const ProductBreadcrumb = () => {
  const { product } = useContext(PDPContext)
  const locale = getCurrentLocale('insight_locale')
  const { referrer } = document
  const matchConditions = ['search.html', '/shop/category', '/shop/partner']
  const fromSearchPage = matchConditions.some(matchCondition => referrer.includes(matchCondition))
  const schemaOrgSite = "https://schema.org";

  document.title = product?.descriptions?.shortDescription

  const setAttributes = (el, attrs) => {
     for(let key in attrs) {
        el.setAttribute(key, attrs[key]);
     }
   }

  const addSeoAttributes = () => {
    const breadCrumbs = document.getElementsByClassName('c-breadcrumbs__list')[0];
    if (breadCrumbs !== undefined) {
        setAttributes(breadCrumbs, {itemtype:`${schemaOrgSite}/BreadcrumbList`,itemscope:true});
        document.querySelectorAll('.c-breadcrumbs__list li').forEach((li, index)=>{
            setAttributes(li, {itemprop:'itemListElement',itemtype:`${schemaOrgSite}/ListItem`,itemscope:true});
            const anchorTag = li.getElementsByTagName("a")[0];
            const spanTag = li.getElementsByTagName("span")[0];
            if (anchorTag !== undefined){
                anchorTag.setAttribute("itemprop","item");
            }
            if (spanTag !== undefined) {
                spanTag.setAttribute("itemprop","name");
            }
            const meta = document.createElement("meta");
            setAttributes(meta, {itemprop:"position", content: index+1} );
            li.appendChild(meta);
        });
    }
  }

  useEffect(()=>{
    addSeoAttributes();
  },[])

  return (
    <div className="c-breadcrumbs-container">
      {fromSearchPage && (
        <div className='c-breadcrumbs-container__back-to-results'>
          <a href={referrer}><Icon icon="arrow-left" />{t('Back to results')} </a>
          <span className="c-seperator">|</span>
        </div>
      )}
      <Breadcrumbs>
        <Breadcrumbs.Item href="/">{t('Home')}</Breadcrumbs.Item>
        <Breadcrumbs.Item href={`/${locale}/shop.html`}>{t('Shop')}</Breadcrumbs.Item>
        <Breadcrumbs.Item current>
          {product?.descriptions?.shortDescription}
        </Breadcrumbs.Item>
      </Breadcrumbs>
    </div>
  )
}

export default ProductBreadcrumb
