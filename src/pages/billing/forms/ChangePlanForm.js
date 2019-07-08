/* eslint max-lines: ["error", 200] */
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { reduxForm, formValueSelector } from 'redux-form';
import { withRouter } from 'react-router-dom';
import qs from 'query-string';
import { fetch as fetchAccount, getPlans, getBillingInfo } from 'src/actions/account';
import { updateSubscription, getBillingCountries, verifyPromoCode, clearPromoCode } from 'src/actions/billing';
import billingCreate from 'src/actions/billingCreate';
import billingUpdate from 'src/actions/billingUpdate';
import { showAlert } from 'src/actions/globalAlert';
import { changePlanInitialValues } from 'src/selectors/accountBillingForms';
import {
  currentPlanSelector, canUpdateBillingInfoSelector, selectTieredVisiblePlans, selectAccountBilling
} from 'src/selectors/accountBillingInfo';
import { Panel, Grid } from '@sparkpost/matchbox';
import { Loading, PlanPicker, ApiErrorBanner } from 'src/components';
import Confirmation from '../components/Confirmation';
import CardSection from '../components/CardSection';
import promoCodeValidate from '../helpers/promoCodeValidate';
import { isAws, isSelfServeBilling } from 'src/helpers/conditions/account';
import { selectCondition } from 'src/selectors/accessConditionState';
import { not } from 'src/helpers/conditions';
import * as conversions from 'src/helpers/conversionTracking';
import AccessControl from 'src/components/auth/AccessControl';
import { prepareCardInfo } from 'src/helpers/billing';
import _ from 'lodash';

const FORMNAME = 'changePlan';

export class ChangePlanForm extends Component {

  state = {
    useSavedCC: null
  };

  componentDidMount() {
    this.props.getPlans();
    this.props.getBillingCountries();
    this.props.fetchAccount();
    this.props.getBillingInfo();
  }

  componentWillReceiveProps(nextProps) {
    // Null check to make sure this only runs once
    if (nextProps.canUpdateBillingInfo && this.state.useSavedCC === null) {
      this.setState({ useSavedCC: true });
    }
  }

  handleCardToggle = () => {
    this.setState({ useSavedCC: !this.state.useSavedCC });
  };

  onSubmit = (values) => {
    const { account, billing, updateSubscription, billingCreate, billingUpdate, showAlert, history, verifyPromoCode } = this.props;
    const oldCode = account.subscription.code;
    const newCode = values.planpicker.code;
    const isDowngradeToFree = values.planpicker.isFree;
    const selectedPromo = billing.selectedPromo;
    const newValues = values.card && !isDowngradeToFree
      ? { ...values, card: prepareCardInfo(values.card) }
      : values;
    let action = Promise.resolve({});
    if (!_.isEmpty(selectedPromo) && !isDowngradeToFree) {
      newValues.promoCode = selectedPromo.promoCode;
      action = verifyPromoCode({ promoCode: selectedPromo.promoCode , billingId: values.planpicker.billingId, meta: { promoCode: selectedPromo.promoCode }});
    }
    return action
      .then(({ discount_id }) => {
        newValues.discountId = discount_id;
        // decides which action to be taken based on
        // if it's aws account, it already has billing and if you use a saved CC
        if (this.props.isAws) {
          return updateSubscription({ code: newCode });
        } else if (account.billing) {
          return this.state.useSavedCC || isDowngradeToFree ? updateSubscription({ code: newCode, promoCode: selectedPromo.promoCode }) : billingUpdate(newValues);
        } else {
          return billingCreate(newValues); // creates Zuora account
        }
      })
      .then(() => history.push('/account/billing'))
      .then(() => {
        conversions.trackPlanChange({ allPlans: billing.plans, oldCode, newCode });
        return showAlert({ type: 'success', message: 'Subscription Updated' });
      });
  };

  onPlanSelect = (e) => {
    const { currentPlan, clearPromoCode } = this.props;
    if (currentPlan.code !== e.code) {
      clearPromoCode();
    }
  }

  render() {
    const { loading, canUpdateBillingInfo, submitting, currentPlan, selectedPlan, plans, isSelfServeBilling, billing, verifyPromoCode, error, account } = this.props;
    const { countries } = billing;
    if (error) {
      return (
        <ApiErrorBanner
          status='danger'
          message="We couldn't render the page. Reload to try again."
          reload={() => location.reload()}
          errorDetails={error.message}
        />
      );
    }

    if (loading) {
      return <Loading />;
    }

    // Manually billed accounts can submit without changing plan
    const disableSubmit = submitting ||
      (isSelfServeBilling && currentPlan.code === selectedPlan.code) ||
      // do not allow private, deprecated, etc. plans to enable billing
      (selectedPlan.status !== 'public' && selectedPlan.status !== 'secret') ||
      // can't submit while verifying promoCode
      billing.promoPending;

    return (
      <form onSubmit={this.props.handleSubmit(this.onSubmit)}>
        <Grid>
          <Grid.Column>
            <Panel>
              {!_.isEmpty(plans)
                ? <PlanPicker disabled={submitting} plans={plans} onChange={this.onPlanSelect}/>
                : null
              }
            </Panel>
            <AccessControl condition={not(isAws)}>
              <CardSection
                account={account}
                countries={countries}
                selectedPlan={selectedPlan}
                submitting={submitting}
                canUpdateBillingInfo={canUpdateBillingInfo}
                useSavedCC={this.state.useSavedCC}
                handleCardToggle={this.handleCardToggle}
              />
            </AccessControl>
          </Grid.Column>
          <Grid.Column xs={12} md={5}>
            <Confirmation
              verifyPromoCode={verifyPromoCode}
              selectedPromo={billing.selectedPromo}
              current={currentPlan}
              selected={selectedPlan}
              billingEnabled={isSelfServeBilling}
              disableSubmit={disableSubmit} />
          </Grid.Column>
        </Grid>
      </form>
    );
  }
}

const mapStateToProps = (state, props) => {
  const selector = formValueSelector(FORMNAME);
  const { code: planCode } = qs.parse(props.location.search);
  const plans = selectTieredVisiblePlans(state);
  const { account, loading } = selectAccountBilling(state);

  return {
    loading: loading || (_.isEmpty(plans) && state.billing.plansLoading),
    isAws: selectCondition(isAws)(state),
    account,
    billing: state.billing,
    canUpdateBillingInfo: canUpdateBillingInfoSelector(state),
    isSelfServeBilling: selectCondition(isSelfServeBilling)(state),
    plans,
    currentPlan: currentPlanSelector(state),
    selectedPlan: selector(state, 'planpicker') || {},
    initialValues: changePlanInitialValues(state, { planCode })
  };
};

const mapDispatchtoProps = { getBillingInfo, billingCreate, billingUpdate, updateSubscription, showAlert, getPlans, getBillingCountries, fetchAccount, verifyPromoCode, clearPromoCode };
const formOptions = { form: FORMNAME, enableReinitialize: true, asyncValidate: promoCodeValidate(FORMNAME), asyncChangeFields: ['planpicker'], asyncBlurFields: ['promoCode']};
export default withRouter(connect(mapStateToProps, mapDispatchtoProps)(reduxForm(formOptions)(ChangePlanForm)));
