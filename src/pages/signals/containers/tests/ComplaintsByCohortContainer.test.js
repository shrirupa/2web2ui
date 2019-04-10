import { shallow } from 'enzyme';
import React from 'react';
import { WithComplaintsByCohortDetails } from '../ComplaintsByCohortDetailsContainer';
import * as dateMock from 'src/helpers/date';

jest.mock('src/helpers/date');

describe('Signals Complaints by Cohort Details Container', () => {
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
      getComplaintsByCohort: jest.fn(),
      selected: '2015-01-01',
      subaccountId: '101'
    };

    dateMock.getDateTicks.mockImplementation(() => [1,2]);
    wrapper = shallow(<WithComplaintsByCohortDetails {...props} />);
  });

  it('gets complaints by cohort on mount correctly', () => {
    expect(wrapper).toMatchSnapshot();
    expect(props.getComplaintsByCohort).toHaveBeenCalledWith({
      facet: 'sending_domain',
      filter: 'test.com',
      from: '2015-01-01',
      relativeRange: '14days',
      subaccount: '101',
      to: '2015-01-05'
    });
  });

  it('gets complaints by cohort when range is updated', () => {
    wrapper.setProps({ filters: { relativeRange: '30days' }});
    expect(props.getComplaintsByCohort).toHaveBeenCalledWith({
      facet: 'sending_domain',
      filter: 'test.com',
      relativeRange: '30days',
      subaccount: '101'
    });
  });

  it('gets complaints by cohort when dates are updated', () => {
    wrapper.setProps({ filters: { relativeRange: 'custom', to: '2016-01-02', from: '2016-01-01' }});
    expect(props.getComplaintsByCohort).toHaveBeenCalledWith({
      facet: 'sending_domain',
      filter: 'test.com',
      from: '2016-01-01',
      relativeRange: 'custom',
      subaccount: '101',
      to: '2016-01-02'
    });
  });

  it('should not get complaints when range isnt updated', () => {
    wrapper.setProps({ another: 'prop' });
    expect(props.getComplaintsByCohort).toHaveBeenCalledTimes(1);
  });
});
