import { formatInputDate, getRelativeDates } from 'src/helpers/date';
import setSubaccountHeader from './helpers/setSubaccountHeader';
import sparkpostApiRequest from './helpers/sparkpostApiRequest';
import moment from 'moment';

// order_by param values do not match field names, so we have to translate here
const ORDER_BY_MAPPING = {
  current_engaged_recipients: 'c_14d',
  current_health_score: 'health_score',
  current_relative_engaged_recipients: 'perc',
  current_relative_trap_hits: 'perc',
  current_trap_hits: 'trap_hits'
};

const signalsActionCreator = ({ dimension, type }) => ({
  facet = '',
  filter,
  from,
  limit,
  offset,
  order,
  orderBy,
  relativeRange,
  subaccount,
  to
}) => {
  let dates = { from, to };

  if (relativeRange !== 'custom') {
    dates = getRelativeDates(relativeRange, { now: moment().subtract(1, 'day') });
  }

  let order_by;

  // note, to order by subaccount, only pass order direction and do not set order_by
  if (orderBy && orderBy !== 'sid') {
    order_by = ORDER_BY_MAPPING[orderBy] || orderBy;
  }

  if (facet === 'sid') {
    facet = '';
    subaccount = filter;
    filter = '';
  }

  return sparkpostApiRequest({
    type,
    meta: {
      method: 'GET',
      headers: setSubaccountHeader(subaccount),
      url: `/v1/signals/${dimension}/${facet}`,
      showErrorAlert: false,
      params: {
        filter,
        from: formatInputDate(dates.from),
        limit,
        offset,
        order,
        order_by,
        to: formatInputDate(dates.to)
      }
    }
  });
};

export const getEngagementRecency = signalsActionCreator({
  dimension: 'cohort-engagement',
  type: 'GET_ENGAGEMENT_RECENCY'
});

export const getEngagementRateByCohort = signalsActionCreator({
  dimension: 'eng-cohort',
  type: 'GET_ENGAGEMENT_RATE_BY_COHORT'
});

export const getUnsubscribeRateByCohort = signalsActionCreator({
  dimension: 'unsub-cohort',
  type: 'GET_UNSUBSCRIBE_RATE_BY_COHORT'
});

export const getComplaintsByCohort = signalsActionCreator({
  dimension: 'fbl-cohort',
  type: 'GET_COMPLAINTS_BY_COHORT'
});

export const getHealthScore = signalsActionCreator({
  dimension: 'health-score',
  type: 'GET_HEALTH_SCORE'
});

export const getCurrentHealthScore = signalsActionCreator({
  dimension: 'health-score',
  type: 'GET_CURRENT_HEALTH_SCORE'
});

export const getSpamHits = signalsActionCreator({
  dimension: 'spam-hits',
  type: 'GET_SPAM_HITS'
});

export const getInjections = ({
  from,
  relativeRange,
  to
}) => {

  let dates = { from, to };

  if (relativeRange !== 'custom') {
    dates = getRelativeDates(relativeRange, { now: moment().subtract(1, 'day') });
  }

  return sparkpostApiRequest({
    type: 'GET_INJECTIONS',
    meta: {
      method: 'GET',
      headers: {},
      url: '/v1/signals/injections',
      showErrorAlert: false,
      params: {
        from: formatInputDate(dates.from),
        to: formatInputDate(dates.to)
      }
    }
  });
};
