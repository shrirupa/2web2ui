import React from 'react';
import { AuthenticationGate, SuspensionAlerts } from 'src/components/auth';
import { CookieConsent, GlobalAlertWrapper, BoomerangBanner, SiftScience } from 'src/components';
import VisualWebsiteOptimizer from './components/vwo/VisualWebsiteOptimizer';
import Poll from 'src/context/Poll';
import Support from 'src/components/support/Support';
import GoogleTagManager from 'src/components/googleTagManager/GoogleTagManager';
import Pendo from 'src/components/pendo/Pendo';
import Layout from 'src/components/layout/Layout';
import ErrorBoundary from 'src/components/errorBoundaries/ErrorBoundary';
import AppRoutes from 'src/components/appRoutes';
import GlobalBanner from 'src/context/GlobalBanner';

import config from 'src/config';

import { BrowserRouter } from 'react-router-dom';

const reloadApp = () => {
  window.location.reload(true);
};

const App = ({ RouterComponent = BrowserRouter }) => (
  <ErrorBoundary onCtaClick={reloadApp} ctaLabel="Reload Page">
    <Poll>
      <RouterComponent>
        <div>
          {config.siftScience && <SiftScience config={config.siftScience} />}
          <BoomerangBanner />
          {config.gtmId && <GoogleTagManager id={config.gtmId} />}
          <Pendo />
          <VisualWebsiteOptimizer />
          <AuthenticationGate />
          <SuspensionAlerts />
          <CookieConsent />
          <GlobalBanner>
            <Layout>
              <AppRoutes />
            </Layout>
          </GlobalBanner>
          <Support />
          <GlobalAlertWrapper />
        </div>
      </RouterComponent>
    </Poll>
  </ErrorBoundary>
);

export default App;
