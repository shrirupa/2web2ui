import { formatContactData } from 'src/helpers/billing';
import { fetch as fetchAccount, getBillingInfo } from './account';
import { list as getSendingIps } from './sendingIps';
import { isAws, isAccountUiOptionSet } from 'src/helpers/conditions/account';
import sparkpostApiRequest from 'src/actions/helpers/sparkpostApiRequest';
import zuoraRequest from 'src/actions/helpers/zuoraRequest';

/**
 * Updates plan
 * @param {string} code
 */
export function updateSubscription({ code, bundle = code, promoCode, meta = {} }) {
  const getBillingAction = () => getBillingInfo();
  const fetchAccountAction = () =>
    fetchAccount({ include: 'usage', meta: { onSuccess: getBillingAction } });

  return (dispatch, getState) =>
    isAccountUiOptionSet('account_feature_limits')(getState()) //TODO: Remove this + first action
      ? dispatch(
          sparkpostApiRequest({
            type: 'UPDATE_SUBSCRIPTION',
            meta: {
              method: 'PUT',
              url: isAws(getState())
                ? '/v1/account/aws-marketplace/subscription'
                : '/v1/billing/subscription/bundle',
              data: {
                promo_code: promoCode,
                [isAws(getState()) ? 'code' : 'bundle']: bundle,
              },
              ...meta,
              onSuccess: meta.onSuccess ? meta.onSuccess : fetchAccountAction,
            },
          }),
        )
      : dispatch(
          sparkpostApiRequest({
            type: 'UPDATE_SUBSCRIPTION',
            meta: {
              method: 'PUT',
              url: isAws(getState())
                ? '/v1/account/aws-marketplace/subscription'
                : '/v1/account/subscription',
              data: {
                promo_code: promoCode,
                code,
              },
              ...meta,
              onSuccess: meta.onSuccess ? meta.onSuccess : fetchAccountAction,
            },
          }),
        );
}

export function syncSubscription({ meta = {} } = {}) {
  return sparkpostApiRequest({
    type: 'SYNC_SUBSCRIPTION',
    meta: {
      method: 'POST',
      url: '/v1/account/subscription/check',
      ...meta,
    },
  });
}

export function syncBillingSubscription({ meta = {} } = {}) {
  return sparkpostApiRequest({
    type: 'SYNC_BILLING_SUBSCRIPTION',
    meta: {
      method: 'POST',
      url: '/v1/billing/subscription/check',
      ...meta,
    },
  });
}

/**
 * attempts to collect payments (like when payment method is updated) to make sure pending payments are charged
 */
export function collectPayments({ meta = {} }) {
  return sparkpostApiRequest({
    type: 'COLLECT_PAYMENTS',
    meta: {
      method: 'POST',
      url: '/v1/account/billing/collect',
      ...meta,
    },
  });
}

/**
 * For updating billing info via our API (e.g. contact info)
 * @param {Object} data
 */
export function updateBillingContact(data) {
  const action = sparkpostApiRequest({
    type: 'UPDATE_BILLING_CONTACT',
    meta: {
      method: 'PUT',
      url: '/v1/account/billing',
      data: formatContactData(data),
    },
  });

  return dispatch =>
    dispatch(action)
      .then(() => dispatch(fetchAccount({ include: 'usage' })))
      .then(() => dispatch(getBillingInfo()));
}

export function verifyPromoCode({ promoCode, billingId, meta = {} }) {
  return sparkpostApiRequest({
    type: 'VERIFY_PROMO_CODE',
    meta: {
      method: 'GET',
      url: `v1/account/subscription/promo-codes/${promoCode}`,
      params: {
        billing_id: billingId,
      },
      ...meta,
    },
  });
}

export function consumePromoCode({ promoCode, billingId, meta = {} }) {
  return sparkpostApiRequest({
    type: 'CONSUME_PROMO_CODE',
    meta: {
      method: 'POST',
      url: `v1/account/subscription/promo-codes/${promoCode}`,
      params: {
        billing_id: billingId,
      },
      ...meta,
    },
  });
}

export function clearPromoCode() {
  return { type: 'REMOVE_ACTIVE_PROMO' };
}

// Used to get cors information to make requests to Zuora
export function cors({ meta = {}, context, data = {} }) {
  const type = `CORS_${context.toUpperCase().replace('-', '_')}`;
  return sparkpostApiRequest({
    type,
    meta: {
      method: 'POST',
      url: '/v1/billing/cors-data',
      params: { context },
      data,
      ...meta,
    },
  });
}

export function updateCreditCard({ data, token, signature, meta = {} }) {
  return zuoraRequest({
    type: 'ZUORA_UPDATE_CC',
    meta: {
      method: 'POST',
      url: '/payment-methods/credit-cards',
      data,
      headers: { token, signature },
      ...meta,
    },
  });
}

export function addDedicatedIps({ ip_pool, isAwsAccount, quantity }) {
  const url = isAwsAccount
    ? '/v1/account/aws-marketplace/add-ons/dedicated_ips'
    : '/v1/account/add-ons/dedicated_ips';
  const action = {
    type: 'ADD_DEDICATED_IPS',
    meta: {
      method: 'POST',
      url,
      data: {
        ip_pool,
        quantity: parseInt(quantity),
      },
    },
  };

  return dispatch => dispatch(sparkpostApiRequest(action)).then(() => dispatch(getSendingIps())); // refresh list
}

export function createZuoraAccount({ data, token, signature, meta = {} }) {
  return zuoraRequest({
    type: 'ZUORA_CREATE',
    meta: {
      method: 'POST',
      url: '/accounts',
      data,
      headers: { token, signature },
      ...meta,
    },
  });
}

/**
 * Gets countries for billing forms
 */
export function getBillingCountries() {
  return sparkpostApiRequest({
    type: 'GET_COUNTRIES_BILLING',
    meta: {
      method: 'GET',
      url: '/v1/account/countries',
      params: {
        filter: 'billing',
      },
    },
  });
}

export function getBundles() {
  return sparkpostApiRequest({
    type: 'GET_BUNDLES',
    meta: {
      method: 'GET',
      url: '/v1/billing/bundles',
    },
  });
}

export function getPlans() {
  return sparkpostApiRequest({
    type: 'GET_NEW_PLANS',
    meta: {
      method: 'GET',
      url: '/v1/billing/plans',
    },
  });
}

export function getSubscription() {
  return sparkpostApiRequest({
    type: 'GET_SUBSCRIPTION',
    meta: {
      method: 'GET',
      url: '/v1/billing/subscription',
    },
  });
}

export function updateBillingSubscription(data) {
  return sparkpostApiRequest({
    type: 'UPDATE_BILLING_SUBSCRIPTION',
    meta: {
      method: 'PUT',
      url: '/v1/billing/subscription',
      data,
    },
  });
}
