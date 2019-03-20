import { shallow } from 'enzyme';
import React from 'react';
import { WithEngagementRateByCohortDetails } from '../EngagementRateByCohortDetailsContainer';
import * as dateMock from 'src/helpers/date';

jest.mock('src/helpers/date');

describe('Signals Engagement Rate by Cohort Details Container', () => {
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
        relativeRange: '14days'
      },
      getEngagementRateByCohort: jest.fn(),
      selected: '2015-01-01',
      subaccountId: '101'
    };

    dateMock.getDateTicks.mockImplementation(() => [1,2]);
    wrapper = shallow(<WithEngagementRateByCohortDetails {...props} />);
  });

  it('gets engagement rate by cohort on mount correctly', () => {
    expect(wrapper).toMatchSnapshot();
    expect(props.getEngagementRateByCohort,).toHaveBeenCalledWith({
      facet: 'sending_domain',
      filter: 'test.com',
      relativeRange: '14days',
      subaccount: '101'
    });
  });

  it('gets engagement rate by cohort when range is updated', () => {
    wrapper.setProps({ filters: { relativeRange: '30days' }});
    expect(props.getEngagementRateByCohort,).toHaveBeenCalledWith({
      facet: 'sending_domain',
      filter: 'test.com',
      relativeRange: '30days',
      subaccount: '101'
    });
  });

  it('should not get engagement recency when range isnt updated', () => {
    wrapper.setProps({ another: 'prop' });
    expect(props.getEngagementRateByCohort).toHaveBeenCalledTimes(1);
  });
});