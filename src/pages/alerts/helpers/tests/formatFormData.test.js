import { formatFromFormToApi, formatFromApiToForm } from '../formatFormData';
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
  single_filter: { filter_type: 'none', filter_values: []},
  email_addresses: emails,
  source: 'raw',
  operator: 'lt',
  value: 80,
  muted: false
};

const apiData = {
  name: 'foo',
  metric: 'health_score',
  subaccounts: [-1],
  filters: [],
  channels: { emails: emailAsArray },
  threshold_evaluator: {
    source: 'raw',
    operator: 'lt',
    value: 80
  },
  muted: false
};

const testCases =
    {
      'master and all subaccounts': {
        formData: { ...formData },
        apiData: { ...apiData }
      },
      'any subaccount': {
        formData: { ...formData, subaccounts: [-2]},
        apiData: { ...apiData, subaccounts: undefined, any_subaccount: true }
      },
      'defaults empty subaccount to -1': {
        formData: { ...formData, subaccounts: []},
        apiData: { ...apiData, subaccounts: [-1], any_subaccount: undefined }
      },
      'select subaccounts': {
        formData: { ...formData, subaccounts: [0,1]},
        apiData: { ...apiData, subaccounts: [0,1]}
      },
      'single filter': {
        formData: { ...formData, single_filter: { filter_type: 'mailbox_provider', filter_values: ['a']}},
        apiData: { ...apiData, filters: [{ filter_type: 'mailbox_provider', filter_values: ['a']}]}
      },
      'single filter with no facet selected': {
        formData: { ...formData, single_filter: { filter_type: 'none', filter_values: []}},
        apiData: { ...apiData }
      },
      'only sending Ip': {
        formData: { ...formData, metric: 'block_bounce_rate', sending_ip: ['a','b']},
        apiData: {
          ...apiData,
          metric: 'block_bounce_rate',
          filters: [{ filter_type: 'sending_ip', filter_values: ['a','b']}]}
      },
      'sending Ip, mailbox provider, and sending domain': {
        formData: { ...formData, metric: 'block_bounce_rate', sending_ip: ['a'], mailbox_provider: ['b'], sending_domain: ['c']},
        apiData: {
          ...apiData,
          metric: 'block_bounce_rate',
          filters: [
            { filter_type: 'sending_ip', filter_values: ['a']},
            { filter_type: 'mailbox_provider', filter_values: ['b']},
            { filter_type: 'sending_domain', filter_values: ['c']}
          ]
        }
      }
    };

describe('formatFromFormToApi', () => {
  cases('should correctly transform the data for', ({ formData, apiData }) => {
    expect(formatFromFormToApi(formData)).toEqual(apiData);
  }, testCases);
});

describe('formatFromApiToForm', () => {
  cases('should correctly transform the data for', ({ apiData, formData }) => {
    expect(formatFromApiToForm(apiData)).toEqual(formData);
  }, testCases);
});
