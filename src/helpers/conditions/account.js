import { any, all } from './compose';
import _ from 'lodash';

export const onPlan = planCode => ({ accountPlan }) => accountPlan.code === planCode;
export const onZuoraPlan = ({ accountPlan }) => Boolean(accountPlan.billingId);
export const onPlanWithStatus = status => ({ accountPlan }) => accountPlan.status === status;
export const onServiceLevel = level => ({ account }) => account.service_level === level;
export const isEnterprise = any(onPlan('ent1'), onServiceLevel('enterprise'));
export const hasStatus = status => ({ account }) => account.status === status;
export const hasStatusReasonCategory = category => ({ account }) =>
  account.status_reason_category === category;
export const isSuspendedForBilling = all(hasStatus('suspended'), hasStatusReasonCategory('100.01'));
export const subscriptionSelfServeIsTrue = ({ account }) =>
  _.get(account, 'subscription.self_serve', false);
const SELF_SERVE_ACCOUNT_TYPES = ['active', 'inactive', 'none'];
export const isBillingSubscriptionSelfServe = ({ subscription }) => {
  return _.includes(SELF_SERVE_ACCOUNT_TYPES, _.get(subscription, 'type'));
};
export const isAws = ({ account }) => _.get(account, 'subscription.type') === 'aws';
export const isManuallyBilled = ({ account }) => _.get(account, 'subscription.type') === 'manual';
export const isCustomBilling = ({ account }) => _.get(account, 'subscription.custom', false);
export const isSelfServeBilling = any(subscriptionSelfServeIsTrue, isAws);
export const hasOnlineSupport = ({ account }) => _.get(account, 'support.online', false);
export const hasUiOption = option => ({ account }) => _.has(account.options, `ui.${option}`);
export const isAccountUiOptionSet = (option, defaultValue) => ({ account }) => {
  if (option === 'account_feature_limits') return true; //Added as part of turning on the feature flag, this will be removed soon.
  return Boolean(_.get(account.options, `ui.${option}`, defaultValue));
};
export const isSubscriptionPending = ({ account }) => Boolean(account.pending_subscription);
export const hasAccountOptionEnabled = option => ({ account }) =>
  Boolean(_.get(account.options, option, false));
export const getAccountUiOptionValue = option => ({ account }) =>
  _.get(account.options, `ui.${option}`);
