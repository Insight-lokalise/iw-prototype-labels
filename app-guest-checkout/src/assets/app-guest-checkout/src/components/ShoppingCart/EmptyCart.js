import React  from 'react'
import {t} from "@insight/toolkit-utils/lib/labels";
import Button from "@insight/toolkit-react/lib/Button/Button";

const EmptyCart = ({locale}) => {
  return (
    <div className="c-empty-cart">
      {t('There are no items in your cart.')}
      <div className="c-empty-cart__help-links">
        <Button
          color="link"
          size="small"
          href={`/content/insight-web/${locale}/shop/hardware.html`}
        >
          {t("Shop all hardware")}
        </Button>
        <Button
          color="link"
          size="small"
          href={`/content/insight-web/${locale}/shop/software.html`}
        >
          {t("Shop all software")}
        </Button>
        <Button
          color="link"
          size="small"
          href={`/content/insight-web/${locale}/shop/partner.html`}
        >
          {t("Shop all brands")}
        </Button>
        </div>

    </div>
  )
}

export default EmptyCart
