import React from 'react';
import { BillingSummaryPage } from '../SummaryPage';
import { shallow } from 'enzyme';

describe('Page: BillingSummaryPage', () => {
  let wrapper;
  let props;

  beforeEach(() => {
    props = {
      account: {
        subscription: {}
      },
      billingInfo: {},
      currentPlan: { code: '10.23k-1018', billingId: 'guuuiiiiiid' },
      loading: false,
      sendingIps: {
        list: []
      },
      fetchAccount: jest.fn(),
      getPlans: jest.fn(),
      getSendingIps: jest.fn(),
      getInvoices: jest.fn()
    };
    wrapper = shallow(<BillingSummaryPage {...props} />);
  });

  it('should render correctly when not loading', () => {
    expect(wrapper).toMatchSnapshot();
  });

  it('should render correctly when loading', () => {
    wrapper.setProps({ loading: true });
    expect(wrapper).toMatchSnapshot();
  });

  it('should get plans, sending ips, invoices, and account on mount', () => {
    expect(props.getPlans).toHaveBeenCalledTimes(1);
    expect(props.fetchAccount).toHaveBeenCalledWith({ include: 'billing' });
    expect(props.getSendingIps).toHaveBeenCalledTimes(1);
    expect(props.getInvoices).toHaveBeenCalledTimes(1);
  });

});
