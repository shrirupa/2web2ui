import { mount } from 'enzyme';
import React from 'react';
import { DateFilter } from '../DateFilter';

describe('DateFilter', () => {
  const now = '2018-01-01T05:00:00Z';
  const subject = (props = {}) => mount(<DateFilter left signalOptions={{}} {...props} now={now} />);

  it('renders datepicker', () => {
    expect(subject().find('AppDatePicker').props()).toMatchSnapshot();
  });

  it('calls changeSignalOptions when dates changes', () => {
    const changeSignalOptions = jest.fn();
    const wrapper = subject({ changeSignalOptions });
    wrapper.find('AppDatePicker').prop('onChange')('update');
    expect(changeSignalOptions).toHaveBeenCalledWith('update');
  });

  it('sets dates with a relative range', () => {
    const wrapper = subject({ signalOptions: { relativeRange: '7days' }});
    expect(wrapper.find('AppDatePicker').prop('to').toString()).toMatch('Dec 31 2017');
    expect(wrapper.find('AppDatePicker').prop('from').toString()).toMatch('Dec 24 2017');
  });

  it('sets dates with a custom date', () => {
    const wrapper = subject({ signalOptions: { relativeRange: 'custom', from: new Date('2015-01-04T05:00:00Z'), to: new Date('2015-01-09T05:00:00Z') }});
    expect(wrapper.find('AppDatePicker').prop('to').toString()).toMatch('Jan 09 2015');
    expect(wrapper.find('AppDatePicker').prop('from').toString()).toMatch('Jan 04 2015');
  });
});
