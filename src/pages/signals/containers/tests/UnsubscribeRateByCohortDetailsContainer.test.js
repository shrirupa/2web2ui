import { shallow } from 'enzyme';
import React from 'react';
import { WithUnsubscribeRateByCohortDetails } from '../UnsubscribeRateByCohortDetailsContainer';
import * as dateMock from 'src/helpers/date';

jest.mock('src/helpers/date');

describe('Signals Unsubscribe Rate by Cohort Details Container', () => {
  let wrapper;
  let props;
  const Component = () => <div>test</div>;

  beforeEach(() => {
    props = {
      component: Component,
      details: {
        data: []
      },
      facet: 'sending_domain',
      facetId: 'test.com',
      filters: {
        from: '2015-01-01',
        relativeRange: '14days',
        to: '2015-01-05'
      },
      getUnsubscribeRateByCohort: jest.fn(),
      selected: '2015-01-01',
      subaccountId: '101'
    };

    dateMock.getDateTicks.mockImplementation(() => [1,2]);
    wrapper = shallow(<WithUnsubscribeRateByCohortDetails {...props} />);
  });

  it('gets unsubscribe rate by cohort on mount correctly', () => {
    expect(wrapper).toMatchSnapshot();
    expect(props.getUnsubscribeRateByCohort).toHaveBeenCalledWith({
      facet: 'sending_domain',
      filter: 'test.com',
      from: '2015-01-01',
      relativeRange: '14days',
      subaccount: '101',
      to: '2015-01-05'
    });
  });

  it('gets unsubscribe rate by cohort when range is updated', () => {
    wrapper.setProps({ filters: { relativeRange: '30days' }});
    expect(props.getUnsubscribeRateByCohort).toHaveBeenCalledWith({
      facet: 'sending_domain',
      filter: 'test.com',
      relativeRange: '30days',
      subaccount: '101'
    });
  });

  it('gets unsubscribe rate by cohort when dates are updated', () => {
    wrapper.setProps({ filters: { relativeRange: 'custom', to: '2016-01-02', from: '2016-01-01' }});
    expect(props.getUnsubscribeRateByCohort).toHaveBeenCalledWith({
      facet: 'sending_domain',
      filter: 'test.com',
      from: '2016-01-01',
      relativeRange: 'custom',
      subaccount: '101',
      to: '2016-01-02'
    });
  });

  it('should not get unsubscribe rate when range isnt updated', () => {
    wrapper.setProps({ another: 'prop' });
    expect(props.getUnsubscribeRateByCohort).toHaveBeenCalledTimes(1);
  });
});
