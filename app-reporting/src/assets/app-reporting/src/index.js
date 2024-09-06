import React from 'react';
import { render } from 'react-dom';
import { t } from '@insight/toolkit-utils';
import { getTranslations, getUserInfo } from './api/index';
import Routes from './routes';
import { Locale } from '@insight/toolkit-react';
import { ReportingProvider } from './context/ReportingContext';
import { REACT_APP_REPORTING_ELEMENT_ID } from './constants';
import { REPORTING_TEXTS } from './texts';
// CSS
import './scss/index.scss';

const { REPORTING_MANAGEMENT_TITLE } = REPORTING_TEXTS;

function renderApp() {
  const root = document.getElementById(REACT_APP_REPORTING_ELEMENT_ID);

  Promise.all([
    getTranslations(),
    getUserInfo()
  ]).then(([
    translations,
    userInfo
  ]) => {
    document.title = t(REPORTING_MANAGEMENT_TITLE);
    const {userInformation} = userInfo || {};
    render(
      <Locale value={{userInformation}}>
        <ReportingProvider>
          <Routes />
        </ReportingProvider>
      </Locale>,
      root
    );
  });
}

renderApp();

if (module.hot) {
  module.hot.accept('./routes', renderApp);
}
