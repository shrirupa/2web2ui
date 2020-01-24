import formatFormValues from '../formatFormValues';
import cases from 'jest-in-case';

const emails = 'sparky@sparkpost.com, test@foo.com';
const emailAsArray = ['sparky@sparkpost.com', 'test@foo.com'];

const formData = {
  name: 'foo',
  metric: 'health_score',
  subaccounts: [-1],
  sending_ip: [],
  mailbox_provider: [],
  sending_domain: [],
  single_filter: { filter_type: 'none', filter_values: [] },
  source: 'raw',
  operator: 'lt',
  value: 80,
  emails,
  slack: '',
  webhook: '',
  muted: false,
};

const apiData = {
  name: 'foo',
  metric: 'health_score',
  subaccounts: [-1],
  filters: [],
  threshold_evaluator: {
    source: 'raw',
    operator: 'lt',
    value: 80,
  },
  channels: { emails: emailAsArray },
  muted: false,
};

const testCases = {
  'master and all subaccounts': {
    formData: { ...formData },
    apiData: { ...apiData },
  },
  'any subaccount': {
    formData: { ...formData, subaccounts: [-2] },
    apiData: { ...apiData, subaccounts: undefined, any_subaccount: true },
  },
  'defaults empty subaccount to -1': {
    formData: { ...formData, subaccounts: [] },
    apiData: { ...apiData, subaccounts: [-1], any_subaccount: undefined },
  },
  'select subaccounts': {
    formData: { ...formData, subaccounts: [0, 1] },
    apiData: { ...apiData, subaccounts: [0, 1] },
  },
  'single filter': {
    formData: {
      ...formData,
      single_filter: { filter_type: 'mailbox_provider', filter_values: ['a'] },
    },
    apiData: { ...apiData, filters: [{ filter_type: 'mailbox_provider', filter_values: ['a'] }] },
  },
  'single filter with no facet selected': {
    formData: { ...formData, single_filter: { filter_type: 'none', filter_values: [] } },
    apiData: { ...apiData },
  },
  'only sending Ip': {
    formData: { ...formData, metric: 'block_bounce_rate', sending_ip: ['a', 'b'] },
    apiData: {
      ...apiData,
      metric: 'block_bounce_rate',
      filters: [{ filter_type: 'sending_ip', filter_values: ['a', 'b'] }],
    },
  },
  'sending Ip, mailbox provider, and sending domain': {
    formData: {
      ...formData,
      metric: 'block_bounce_rate',
      sending_ip: ['a'],
      mailbox_provider: ['b'],
      sending_domain: ['c'],
    },
    apiData: {
      ...apiData,
      metric: 'block_bounce_rate',
      filters: [
        { filter_type: 'sending_ip', filter_values: ['a'] },
        { filter_type: 'mailbox_provider', filter_values: ['b'] },
        { filter_type: 'sending_domain', filter_values: ['c'] },
      ],
    },
  },
  'with slack and webhook channels': {
    formData: { ...formData, slack: 'target1', webhook: 'target2' },
    apiData: {
      ...apiData,
      channels: {
        emails: emailAsArray,
        slack: { target: 'target1' },
        webhook: { target: 'target2' },
      },
    },
  },
  'for blacklist alert': {
    formData: {
      name: 'foo',
      metric: 'blacklist',
      subaccounts: [], // default
      blacklist_provider: ['abuseat.org', 'new.spam.dnsbl.sorbs.net'],
      blacklist_resource: ['1.2.3.4', 'example.com'],
      emails,
      slack: '',
      webhook: '',
      muted: false,
    },
    apiData: {
      name: 'foo',
      metric: 'blacklist',
      any_subaccount: undefined,
      subaccounts: [-1],
      filters: [
        {
          filter_type: 'blacklist_provider',
          filter_values: ['abuseat.org', 'new.spam.dnsbl.sorbs.net'],
        },
        {
          filter_type: 'blacklist_resource',
          filter_values: ['1.2.3.4', 'example.com'],
        },
      ],
      threshold_evaluator: {},
      channels: { emails: emailAsArray },
      muted: false,
    },
  },
};

describe('formatFormValues', () => {
  cases(
    'should correctly transform the data for',
    ({ formData, apiData }) => {
      expect(formatFormValues(formData)).toEqual(apiData);
    },
    testCases,
  );
});
