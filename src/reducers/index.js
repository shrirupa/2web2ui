import { combineReducers } from 'redux';
import { reducer as form } from 'redux-form';

import acceptedReport from './acceptedReport';
import accessControlReady from './accessControlReady';
import account from './account';
import apiKeys from './api-keys';
import auth from './auth';
import billing from './billing';
import bounceReport from './bounceReport';
import delayReport from './delayReport';
import engagementReport from './engagementReport';
import rejectionReport from './rejectionReport';
import currentUser from './currentUser';
import globalAlert from './globalAlert';
import ipPools from './ipPools';
import messageEvents from './messageEvents';
import metrics from './metrics';
import recipientLists from './recipientLists';
import reportFilters from './reportFilters';
import sendingDomains from './sendingDomains';
import sendingIps from './sendingIps';
import subaccounts from './subaccounts';
import summaryChart from './summaryChart';
import support from './support';
import suppressions from './suppressions';
import templates from './templates';
import users from './users';
import tfa from './tfa';
import tfaBackupCodes from './tfaBackupCodes';
import trackingDomains from './trackingDomains';
import webhooks from './webhooks';

const appReducer = combineReducers({
  acceptedReport,
  accessControlReady,
  account,
  auth,
  billing,
  bounceReport,
  delayReport,
  engagementReport,
  rejectionReport,
  apiKeys,
  currentUser,
  form,
  ipPools,
  globalAlert,
  metrics,
  messageEvents,
  reportFilters,
  recipientLists,
  sendingDomains,
  sendingIps,
  subaccounts,
  support,
  summaryChart,
  suppressions,
  templates,
  tfa,
  tfaBackupCodes,
  trackingDomains,
  users,
  webhooks
});

/**
 * Resets state to initial values on log out
 */
export default (state, action) => {
  if (action.type === 'LOGOUT') {
    state = undefined;
  }

  return appReducer(state, action);
};
