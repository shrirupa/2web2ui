import { shallow } from 'enzyme';
import React from 'react';
import { WithHealthScoreDetails } from '../HealthScoreDetailsContainer';
import * as dateMock from 'src/helpers/date';
import _ from 'lodash';

jest.mock('src/helpers/date');

describe('Signals Health Score Details Container', () => {
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
      getSpamHits: jest.fn(),
      getHealthScore: jest.fn(),
      selected: '2015-01-01',
      subaccountId: '101'
    };

    dateMock.getDateTicks.mockImplementation(() => [1,2]);
    wrapper = shallow(<WithHealthScoreDetails {...props} />);
  });

  it('gets health score and spam hits on mount correctly', () => {
    expect(wrapper).toMatchSnapshot();
    const options = {
      facet: 'sending_domain',
      filter: 'test.com',
      from: '2015-01-01',
      relativeRange: '14days',
      subaccount: '101',
      to: '2015-01-05'
    };
    expect(props.getSpamHits).toHaveBeenCalledWith(options);
    expect(props.getHealthScore).toHaveBeenCalledWith(options);
  });

  it('gets health score and spam hits when range is updated', () => {
    const options = {
      facet: 'sending_domain',
      filter: 'test.com',
      relativeRange: '30days',
      subaccount: '101'
    };
    wrapper.setProps({ filters: { relativeRange: '30days' }});
    expect(props.getSpamHits).toHaveBeenCalledWith(options);
    expect(props.getHealthScore).toHaveBeenCalledWith(options);
  });

  it('gets health score when dates are updated', () => {
    wrapper.setProps({ filters: { relativeRange: 'custom', to: '2016-01-02', from: '2016-01-01' }});
    const options = {
      facet: 'sending_domain',
      filter: 'test.com',
      from: '2016-01-01',
      relativeRange: 'custom',
      subaccount: '101',
      to: '2016-01-02'
    };
    expect(props.getSpamHits).toHaveBeenCalledWith(options);
    expect(props.getHealthScore).toHaveBeenCalledWith(options);
  });

  it('should not get health score and spam hits when range isnt updated', () => {
    jest.clearAllMocks();
    wrapper.setProps({ another: 'prop' });
    expect(props.getSpamHits).toHaveBeenCalledTimes(0);
    expect(props.getHealthScore).toHaveBeenCalledTimes(0);
  });

  it('should shorten chart gap if data is long', () => {
    wrapper.setProps({ details: { data: _.range(16).map((n) => n) }});
    expect(wrapper.prop('gap')).toEqual(0.2);
  });
});
