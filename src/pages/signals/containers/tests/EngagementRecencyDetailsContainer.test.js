import { shallow } from 'enzyme';
import React from 'react';
import { WithEngagementRecencyDetails } from '../EngagementRecencyDetailsContainer';
import * as dateMock from 'src/helpers/date';
import _ from 'lodash';

jest.mock('src/helpers/date');

describe('Signals Engagement Recency Details Container', () => {
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
      getEngagementRecency: jest.fn(),
      selected: '2015-01-01',
      subaccountId: '101'
    };

    dateMock.getDateTicks.mockImplementation(() => [1,2]);
    wrapper = shallow(<WithEngagementRecencyDetails {...props} />);
  });

  it('gets engagement recency on mount correctly', () => {
    expect(wrapper).toMatchSnapshot();
    expect(props.getEngagementRecency).toHaveBeenCalledWith({
      facet: 'sending_domain',
      filter: 'test.com',
      from: '2015-01-01',
      relativeRange: '14days',
      subaccount: '101',
      to: '2015-01-05'
    });
  });

  it('gets engagement recency when range is updated', () => {
    wrapper.setProps({ filters: { relativeRange: '30days' }});
    expect(props.getEngagementRecency).toHaveBeenCalledWith({
      facet: 'sending_domain',
      filter: 'test.com',
      relativeRange: '30days',
      subaccount: '101'
    });
  });

  it('gets engagement recency when dates are updated', () => {
    wrapper.setProps({ filters: { relativeRange: 'custom', to: '2016-01-02', from: '2016-01-01' }});
    expect(props.getEngagementRecency).toHaveBeenCalledWith({
      facet: 'sending_domain',
      filter: 'test.com',
      from: '2016-01-01',
      relativeRange: 'custom',
      subaccount: '101',
      to: '2016-01-02'
    });
  });

  it('should not get engagement recency when range isnt updated', () => {
    wrapper.setProps({ another: 'prop' });
    expect(props.getEngagementRecency).toHaveBeenCalledTimes(1);
  });

  it('should shorten chart gap if data is long', () => {
    wrapper.setProps({ details: { data: _.range(16).map((n) => n) }});
    expect(wrapper.prop('gap')).toEqual(0.2);
  });
});
