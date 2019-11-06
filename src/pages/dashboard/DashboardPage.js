import React, { Component } from 'react';

import { Page } from '@sparkpost/matchbox';
import { UsageReport } from 'src/components';
import Tutorial from './components/Tutorial';
import VerifyEmailBanner from 'src/components/verifyEmailBanner/VerifyEmailBanner';
import { FreePlanWarningBanner } from 'src/pages/billing/components/Banners';
import { hasGrants } from 'src/helpers/conditions';
import { AccessControl } from 'src/components/auth';
import { isAccountUiOptionSet } from 'src/helpers/conditions/account';
import { GettingStartedGuide } from './components/GettingStartedGuide';

export class DashboardPage extends Component {

  displayTutorial = (isMessageOnboardingSet) => {
    if (isMessageOnboardingSet) { return <GettingStartedGuide/>; }

    return <AccessControl condition={hasGrants('api_keys/manage', 'templates/modify', 'sending_domains/manage')}>
      <Tutorial {...this.props} />
    </AccessControl>;

  }

  render() {
    const { accountAgeInDays, currentUser, account } = this.props;

    //Shows banner if within 14 days of plan to downgrade

    return (
      <Page title='Dashboard'>
        {currentUser.email_verified === false && (
          <VerifyEmailBanner verifying={currentUser.verifyingEmail} />
        )}
        <FreePlanWarningBanner account={account} accountAgeInDays={accountAgeInDays} ageRangeStart={16}/>
        <UsageReport/>
        {this.displayTutorial(isAccountUiOptionSet('messaging_onboarding'))}
      </Page>
    );
  }
}

export default DashboardPage;
