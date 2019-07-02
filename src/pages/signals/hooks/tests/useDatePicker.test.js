import React from 'react';
import { mount } from 'enzyme';
import useDatePicker from '../useDatePicker';

describe('useDatePicker', () => {
  const now = Date.now();
  const useTestWrapper = (value = {}) => {
    const TestComponent = () => <div hooked={useDatePicker(value, { now })} />;
    return mount(<TestComponent />);
  };
  const useHook = (wrapper) => wrapper.update().children().prop('hooked');
  const subject = (params) => useHook(useTestWrapper(params)); // eslint-disable-line react-hooks/rules-of-hooks

  it('returns DatePicker state and helper', () => {
    expect(subject({ relativeRange: 'hour' })).toEqual(expect.objectContaining({
      dateRange: expect.objectContaining({
        relativeRange: 'hour',
        from: expect.any(Date),
        to: expect.any(Date)
      }),
      setDateRange: expect.any(Function)
    }));
  });
});
