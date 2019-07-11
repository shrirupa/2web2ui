import React, { Component, Fragment } from 'react';
import { reduxForm } from 'redux-form';
import { connect } from 'react-redux';
import { Panel, Grid, Button } from '@sparkpost/matchbox';
import { showAlert } from 'src/actions/globalAlert';
import { CenteredLogo, Loading, PlanPicker } from 'src/components';
import { FORMS, ANALYTICS_CHOOSE_PLAN, ANALYTICS_ONBOARDING } from 'src/constants';
import Steps from './components/Steps';
import { getPlans } from 'src/actions/account';
import { getBillingCountries, verifyPromoCode, clearPromoCode } from 'src/actions/billing';
import billingCreate from 'src/actions/billingCreate';
import { choosePlanMSTP } from 'src/selectors/onboarding';
import PaymentForm from 'src/pages/billing/forms/fields/PaymentForm';
import BillingAddressForm from 'src/pages/billing/forms/fields/BillingAddressForm';
import promoCodeValidate from 'src/pages/billing/helpers/promoCodeValidate';
import { isAws } from 'src/helpers/conditions/account';
import { not } from 'src/helpers/conditions';
import AccessControl from 'src/components/auth/AccessControl';
import { prepareCardInfo } from 'src/helpers/billing';
import PromoCode from 'src/components/billing/PromoCode';
import { trackEvent } from 'src/helpers/analytics';

const NEXT_STEP = '/onboarding/sending-domain';

export class OnboardingPlanPage extends Component {
  componentDidMount() {
    this.props.getPlans();
    this.props.getBillingCountries();
  }

  componentDidUpdate(prevProps) {
    const { hasError, history } = this.props;

    // if we can't get plans or countries form is useless
    // they can pick plan later from billing
    if (!prevProps.hasError && hasError) {
      history.push(NEXT_STEP);
    }
  }

  onSubmit = (values) => {
    const { billingCreate, showAlert, history, billing, verifyPromoCode } = this.props;
    const selectedPromo = billing.selectedPromo;
    const newValues = values.card && !values.planpicker.isFree
      ? { ...values, card: prepareCardInfo(values.card) }
      : values;

    // no billing updates needed since they are still on free plan
    if (newValues.planpicker.isFree) {
      history.push(NEXT_STEP);
      return;
    }

    let action = Promise.resolve({});
    if (selectedPromo.promoCode && !values.planpicker.isFree) {
      const { promoCode } = selectedPromo;
      newValues.promoCode = promoCode;
      action = verifyPromoCode({ promoCode, billingId: values.planpicker.billingId, meta: { promoCode }});
    }

    // Note: billingCreate will update the subscription if the account is AWS
    return action
      .then(({ discount_id }) => {
        newValues.discountId = discount_id;
        return billingCreate(newValues);
      })
      .then(() => history.push(NEXT_STEP))
      .then(() => {
        trackEvent({ category: ANALYTICS_ONBOARDING, action: ANALYTICS_CHOOSE_PLAN, data: { plan_code: values.planpicker.code }});
        showAlert({ type: 'success', message: 'Added your plan' });
      });
  };

  renderCCSection = () => {
    const { billing, submitting, selectedPlan = {}} = this.props;

    if (selectedPlan.isFree) {
      return (
        <Panel.Section>
          <p>Full featured test account that includes:</p>
          <ul>
            <li>Limited sending volume for testing.</li>
            <li>Access to all of our powerful API features.</li>
            <li>30 days of free technical support to get you up and running.</li>
          </ul>
        </Panel.Section>
      );
    }

    return (
      <Fragment>
        <Panel.Section>
          <PaymentForm
            formName={FORMS.JOIN_PLAN}
            disabled={submitting}
          />
        </Panel.Section>
        <Panel.Section>
          <BillingAddressForm
            formName={FORMS.JOIN_PLAN}
            disabled={submitting}
            countries={billing.countries}
          />
        </Panel.Section>
      </Fragment>
    );
  }

  renderPromoCodeField() {
    const { billing } = this.props;
    const { selectedPromo = {}} = billing;
    return (
      <Panel.Section>
        <PromoCode
          selectedPromo={selectedPromo}
        />
      </Panel.Section>
    );
  }

  onPlanSelect = (e) => {
    const { currentPlan, clearPromoCode } = this.props;
    if (currentPlan !== e.code) {
      clearPromoCode();
    }
  }
  render() {
    const { loading, plans, submitting, selectedPlan = {}, billing } = this.props;

    if (loading) {
      return <Loading />;
    }
    const disableSubmit = submitting || billing.promoPending;

    const buttonText = submitting ? 'Updating Subscription...' : 'Get Started';

    return (
      <form onSubmit={this.props.handleSubmit(this.onSubmit)}>
        <CenteredLogo />
        <Grid>
          <Grid.Column>
            <Panel>
              <PlanPicker selectedPromo={billing.selectedPromo} disabled={disableSubmit} plans={plans} onChange={this.onPlanSelect}/>
              <AccessControl condition={not(isAws)}>
                {!selectedPlan.isFree && this.renderPromoCodeField()}
                {this.renderCCSection()}
              </AccessControl>
              <Panel.Section>
                <Button disabled={disableSubmit} primary={true} type='submit' size='large' fullWidth={true}>{buttonText}</Button>
              </Panel.Section>
              <Steps />
            </Panel>
          </Grid.Column>
        </Grid>
      </form>
    );
  }
}

const formOptions = { form: FORMS.JOIN_PLAN, enableReinitialize: true, asyncValidate: promoCodeValidate(FORMS.JOIN_PLAN), asyncChangeFields: ['planpicker'], asyncBlurFields: ['promoCode']};

export default connect(
  choosePlanMSTP(FORMS.JOIN_PLAN),
  { billingCreate, showAlert, getPlans, getBillingCountries, verifyPromoCode, clearPromoCode }
)(reduxForm(formOptions)(OnboardingPlanPage));
