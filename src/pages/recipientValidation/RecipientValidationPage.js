import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { Page, Tabs, Panel, Modal, Button } from '@sparkpost/matchbox';
import ListForm from './components/ListForm';
import SingleAddressForm from './components/SingleAddressForm';
import ListResults from './components/ListResults';
import ApiDetails from './components/ApiDetails';
import { hasAccountOptionEnabled } from 'src/helpers/conditions/account';
import RVDisabledPage from './components/RVDisabledPage';
import ConditionSwitch, { Case, defaultCase } from 'src/components/auth/ConditionSwitch';
import RecipientValidationPriceModal from './components/RecipientValidationPriceModal';

import styles from './RecipientValidationPage.module.scss';

const tabs = [
  { content: <span className={styles.TabPadding}>List</span>, key: 'list' },
  { content: 'Single Address', key: 'single' },
  { content: 'API Integration', key: 'api' }
];

export class RecipientValidationPage extends Component {
  state = {
    selectedTab: this.props.tab || 0,
    showPriceModal: false
  };

  handleTabs(tabIdx) {
    const { history } = this.props;

    history.replace(`/recipient-validation/${tabs[tabIdx].key}`);
    this.setState({ selectedTab: tabIdx });
  }

  renderTabContent = (tabId) => {
    switch (tabId) {
      case 0:
        return <ListForm />;
      case 1:
        return <SingleAddressForm />;
      case 2:
        return <ApiDetails />;
      default:
        return null;
    }
  }

  handleModal = (showPriceModal = false) => this.setState({ showPriceModal });

  renderRecipientValidation = () => {
    const { selectedTab, showPriceModal } = this.state;

    return (
      <Page
        title='Recipient Validation'
        primaryArea={<Button size='large' onClick={() => this.handleModal(true)}>See Pricing</Button>}>
        <p className={styles.LeadText}>
          Recipient Validation is an easy, efficient way to verify that email addresses are valid
          before you send. We run each address through a series of checks to catch many common problems,
          including syntax errors and non-existent mailboxes, to drive better deliverability, cut down on
          fraud, and capture every opportunity.
        </p>
        <Tabs
          selected={selectedTab}
          connectBelow={true}
          tabs={tabs.map(({ content }, idx) => ({ content, onClick: () => this.handleTabs(idx) }))}
        />
        <Panel>
          {this.renderTabContent(selectedTab)}
        </Panel>
        {selectedTab === 0 && <ListResults/>}
        <Modal open={showPriceModal} onClose={() => this.handleModal()}>
          <RecipientValidationPriceModal onClose={() => this.handleModal()} />
        </Modal>
      </Page>
    );
  };

  render() {
    return (
      <ConditionSwitch>
        <Case condition={hasAccountOptionEnabled('recipient_validation')}>
          {this.renderRecipientValidation()}
        </Case>
        <Case condition={defaultCase}>
          <RVDisabledPage/>
        </Case>
      </ConditionSwitch>
    );
  }
}

const mapStateToProps = (state, props) => ({
  tab: tabs.findIndex(({ key }) => key === props.match.params.category) || 0
});

export default withRouter(connect(mapStateToProps)(RecipientValidationPage));
