import React from "react";
import { t } from "@insight/toolkit-utils/lib/labels";
import Breadcrumbs from "@insight/toolkit-react/lib/Breadcrumbs/Breadcrumbs";
import { Link } from "react-router-dom";

const Breadcrumb = ({ breadcrumb, key, match, routeName }) => {
  const renderBreadcrumb = (name, url) => {
    if (name === routeName && match.params.orderNumber) {
      return (
        <>
          {t(name)} #{match.params.orderNumber}
        </>
      );
    }

    if (name === routeName) {
      return <>{t(name)}</>;
    }

    return <Link to={name === routeName ? "#" : url}>{t(name)}</Link>;
  };

  return (
    <div data-testid="breadcrumb">
      <Breadcrumbs key={key}>
        <Breadcrumbs.Item href={self.origin}>{t("Home")}</Breadcrumbs.Item>
        {breadcrumb.map(({ name, url }, bkey) => (
          <Breadcrumbs.Item key={bkey}>
            {renderBreadcrumb(name, url)}
          </Breadcrumbs.Item>
        ))}
      </Breadcrumbs>
    </div>
  );
};

export default Breadcrumb;
