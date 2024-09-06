import React, { useEffect } from 'react'
import { withRouter } from 'react-router-dom'

const ScrollToTop = ({ children, location: { pathname } }) => {
  useEffect(() => {
    window.scroll({
      top: 0,
      left: 0,
      behavior: 'auto',
    });
  }, [pathname]);

  return children || null;
};

export default withRouter(ScrollToTop);
