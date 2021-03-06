import { shallow } from 'enzyme';
import React from 'react';
import { FilterFields } from '../FilterFields';
import * as alertFormHelper from '../../../helpers/alertForm';

describe('Filter Fields Component', () => {
  const props = {
    blacklists: [],
    blacklistMonitors: [],
    metric: 'health_score',
    disabled: false,
    single_filter: { filter_type: 'none', filter_values: [] },
    ipPools: [{ id: 'ip Pool 1' }],
    ipPoolsLoading: false,
    sendingDomains: [{ domain: 'my@domain' }],
    sendingDomainsLoading: false,
    sendingIps: [{ external_ip: '192.168.1.1' }],
    listBlacklists: jest.fn(),
    listMonitors: jest.fn(),
    listPools: jest.fn(),
    listSendingDomains: jest.fn(),
    listSendingIps: jest.fn(),
    change: jest.fn(),
    myFilter: ['random value'],
  };

  const subject = options => shallow(<FilterFields {...props} {...options} />);

  it('gets filter options when mounted', () => {
    subject();
    expect(props.listBlacklists).toHaveBeenCalled();
    expect(props.listMonitors).toHaveBeenCalled();
    expect(props.listPools).toHaveBeenCalled();
    expect(props.listSendingDomains).toHaveBeenCalled();
    expect(props.listSendingIps).toHaveBeenCalled();
  });

  it('renders single type filter', () => {
    jest
      .spyOn(alertFormHelper, 'getFormSpec')
      .mockImplementationOnce(() => ({ filterType: 'single' }));
    const wrapper = subject();
    expect(wrapper.find({ name: 'single_filter.filter_values' })).toExist();
    expect(wrapper.find({ name: 'single_filter.filter_type' })).toExist();
    expect(wrapper.find('Field')).toHaveLength(2);
  });

  it('renders multi type filter', () => {
    jest.spyOn(alertFormHelper, 'getFormSpec').mockImplementationOnce(() => ({
      filterType: 'multi',
      filterOptions: [{ label: 'My Filter', value: 'myFilter' }],
    }));
    const wrapper = subject();
    expect(wrapper.find({ name: 'myFilter' })).toExist();
    expect(wrapper.find('Field')).toHaveLength(1);
  });

  it('should hide filtering by IP address when the account has no IP addresses', () => {
    jest.spyOn(alertFormHelper, 'getFormSpec').mockImplementationOnce(() => ({
      filterType: 'multi',
      filterOptions: [{ label: 'My Sending IPs', value: 'sending_ip' }],
    }));
    const wrapper = subject({
      sendingIps: [],
    });

    expect(wrapper.find({ name: 'sending_ip' })).not.toExist();
    expect(wrapper.find('Field')).toHaveLength(0);
  });

  it('should show filtering by IP address when the account has IP addresses', () => {
    jest.spyOn(alertFormHelper, 'getFormSpec').mockImplementationOnce(() => ({
      filterType: 'multi',
      filterOptions: [{ label: 'My Sending IPs', value: 'sending_ip' }],
    }));
    const wrapper = subject({
      sendingIps: [{ external_ip: '192.168.1.1' }],
    });

    expect(wrapper.find({ name: 'sending_ip' })).toExist();
    expect(wrapper.find('Field')).toHaveLength(1);
  });

  it('reset single filter value when single filter facet changes', () => {
    const wrapper = subject();
    wrapper.find({ name: 'single_filter.filter_type' }).simulate('change', 'mailbox_provider');
    expect(props.change).toHaveBeenCalled();
  });

  describe('for blacklists', () => {
    const blackListFilters = (props = {}) =>
      subject({
        ...props,
        metric: 'blacklist',
        blacklists: [{ code: 'abuseat.org' }, { code: 'spamhaus.org' }],
        blacklistMonitors: [
          { resource: '0.0.0.0' },
          { resource: '1.2.3.4' },
          { resource: 'example.com' },
          { resource: 'test.example.com' },
        ],
      });

    it('displays only blacklist codes', () => {
      const wrapper = blackListFilters();
      expect(wrapper.find({ name: 'provider' })).toHaveProp('results', [
        'abuseat.org',
        'spamhaus.org',
      ]);
    });

    it('displays only blacklist resources', () => {
      const wrapper = blackListFilters();
      expect(wrapper.find({ name: 'resource' })).toHaveProp('results', [
        '0.0.0.0',
        '1.2.3.4',
        'example.com',
        'test.example.com',
      ]);
    });

    it('disables provider field when loading options', () => {
      const wrapper = blackListFilters({ blacklistsPending: true });
      expect(wrapper.find({ name: 'provider' })).toHaveProp('disabled', true);
    });

    it('disables resource field when loading options', () => {
      const wrapper = blackListFilters({ blacklistMonitorsPending: true });
      expect(wrapper.find({ name: 'resource' })).toHaveProp('disabled', true);
    });
  });
});
