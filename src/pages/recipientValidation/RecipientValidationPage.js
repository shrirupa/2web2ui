import React, { useState, useEffect, useCallback } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { Page, Tabs, Panel, Button } from '@sparkpost/matchbox';
import { Launch } from '@sparkpost/matchbox-icons';
import { reduxForm } from 'redux-form';
import _ from 'lodash';
import { prepareCardInfo, isProductOnSubscription } from 'src/helpers/billing';
import { rvAddPaymentFormInitialValues } from 'src/selectors/recipientValidation';
import { selectIsSelfServeBilling } from 'src/selectors/accountBillingInfo';
import { getBillingInfo } from 'src/actions/account';
import addRVtoSubscription, { resetAddRVtoSubscription } from 'src/actions/addRVtoSubscription';
import { getSubscription as getBillingSubscription } from 'src/actions/billing';
import { Loading } from 'src/components/loading/Loading';
import JobsTableCollection from './components/JobsTableCollection';
import { ListTab } from './components/ListForm';
import { SingleAddressTab } from './components/SingleAddressForm';
import ApiDetails from './components/ApiDetails';
import styles from './RecipientValidationPage.module.scss';
import ValidateSection from './components/ValidateSection';
import { FORMS } from 'src/constants';
import RVPriceModal from './components/RVPriceModal';
const FORMNAME = FORMS.RV_ADDPAYMENTFORM;

const tabs = [
  { content: <span className={styles.TabPadding}>List</span>, key: 'list' },
  { content: 'Single Address', key: 'single' },
  { content: 'API Integration', key: 'api' },
];

export function RecipientValidationPage(props) {
  const {
    getBillingInfo,
    getBillingSubscription,
    billing,
    addRVtoSubscriptionloading,
    addRVtoSubscriptionsuccess,
    addRVtoSubscriptionerror,
    billingLoading,
    valid,
    submitting,
    isRVonSubscription,
    addRVFormValues,
    tab,
    history,
    reset,
    handleSubmit,
  } = props;
  const [useSavedCC, setUseSavedCC] = useState(Boolean(billing.credit_card));
  const [selectedTab, setSelectedTab] = useState(tab || 0);
  const [showPriceModal, setShowPriceModal] = useState(false);
  const redirectToNextStep = useCallback(
    formValues => {
      switch (selectedTab) {
        case 1:
          history.push(`/recipient-validation/single/${formValues.address}`);
          break;
        case 2:
          history.push(`/account/api-keys/create`);
          break;
        default:
          break;
      }
    },
    [selectedTab, history],
  );

  useEffect(() => {
    getBillingInfo();
  }, [getBillingInfo]);
  useEffect(() => {
    getBillingSubscription();
  }, [getBillingSubscription]);
  useEffect(() => {
    setUseSavedCC(Boolean(billing.credit_card));
  }, [billing, billing.credit_card]);

  useEffect(() => {
    if (!addRVtoSubscriptionloading && addRVtoSubscriptionsuccess && !addRVtoSubscriptionerror)
      redirectToNextStep(addRVFormValues);
  }, [
    addRVFormValues,
    addRVtoSubscriptionerror,
    addRVtoSubscriptionloading,
    addRVtoSubscriptionsuccess,
    redirectToNextStep,
  ]);
  useEffect(() => {
    resetAddRVtoSubscription();
  }, []);

  const handleTabs = tabIdx => {
    history.replace(`/recipient-validation/${tabs[tabIdx].key}`);
    setSelectedTab(tabIdx);
    reset();
  };

  const handleToggleCC = val => setUseSavedCC(!val);

  const renderTabContent = tabId => {
    switch (tabId) {
      case 0:
        return <ListTab handleSubmit={handleSubmit} reset={reset} />;
      case 1:
        return <SingleAddressTab />;
      case 2:
        return <ApiDetails formname={FORMNAME} />;
      default:
        return null;
    }
  };

  const onSubmit = formValues => {
    const { addRVtoSubscription, isRVonSubscription, isManuallyBilled } = props;

    if (isRVonSubscription && (useSavedCC || isManuallyBilled)) {
      return redirectToNextStep(formValues);
    }

    const values = formValues.card
      ? { ...formValues, card: prepareCardInfo(formValues.card) }
      : formValues;

    return addRVtoSubscription({
      values,
      updateCreditCard: !useSavedCC,
      isRVonSubscription: isRVonSubscription,
    });
  };

  const handleModal = (showPriceModal = false) => setShowPriceModal(showPriceModal);

  if (addRVtoSubscriptionloading) return <Loading />;
  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Page
        title="Recipient Validation"
        primaryArea={
          <Button size="large" onClick={() => handleModal(true)}>
            See Pricing
          </Button>
        }
      >
        <p className={styles.LeadText}>
          Recipient Validation is an easy, efficient way to verify that email addresses are valid
          before you send. We run each address through a series of checks to catch many common
          problems, including syntax errors and non-existent mailboxes, to drive better
          deliverability, cut down on fraud, and capture every opportunity.
        </p>
        <Panel>
          <div className={styles.TabsWrapper}>
            <Tabs
              selected={selectedTab}
              connectBelow={true}
              tabs={tabs.map(({ content }, idx) => ({
                content,
                onClick: () => handleTabs(idx),
              }))}
            />
            {selectedTab === 2 && (
              <div className={styles.TagWrapper}>
                <Button
                  flat
                  external
                  to="https://developers.sparkpost.com/api/recipient-validation/"
                >
                  API Docs
                  <Launch className={styles.LaunchIcon} />
                </Button>
              </div>
            )}
          </div>
          <Panel.Section>{renderTabContent(selectedTab)}</Panel.Section>
        </Panel>
        {selectedTab === 0 && <JobsTableCollection />}
        {(selectedTab === 1 || selectedTab === 2) && !billingLoading && (
          <ValidateSection
            credit_card={billing.credit_card}
            submitButtonName={selectedTab === 2 ? 'Create API Key' : 'Validate'}
            submitDisabled={!valid || submitting}
            formname={FORMNAME}
            handleCardToggle={handleToggleCC}
            defaultToggleState={!useSavedCC}
            isProductOnSubscription={isRVonSubscription}
          />
        )}
        <RVPriceModal isOpen={showPriceModal} handleOpen={handleModal} />
      </Page>
    </form>
  );
}

const mapStateToProps = (state, props) => ({
  tab: tabs.findIndex(({ key }) => key === props.match.params.category) || 0,
  account: state.account,
  billing: state.account.billing || {},
  billingLoading: state.account.billingLoading,
  isRVonSubscription: isProductOnSubscription('recipient_validation')(state),
  initialValues: rvAddPaymentFormInitialValues(state),
  isManuallyBilled: !selectIsSelfServeBilling(state),
  addRVtoSubscriptionloading: state.addRVtoSubscription.addRVtoSubscriptionloading,
  addRVFormValues: state.addRVtoSubscription.formValues,
  addRVtoSubscriptionerror: state.addRVtoSubscription.addRVtoSubscriptionerror,
  addRVtoSubscriptionsuccess: state.addRVtoSubscription.addRVtoSubscriptionsuccess,
});

const formOptions = { form: FORMNAME, enableReinitialize: true };
export default withRouter(
  connect(mapStateToProps, {
    getBillingInfo,
    addRVtoSubscription,
    resetAddRVtoSubscription,
    getBillingSubscription,
  })(reduxForm(formOptions)(RecipientValidationPage)),
);
