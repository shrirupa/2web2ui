import React from 'react';
import { act } from 'react-dom/test-utils';
import { mount } from 'enzyme';
import useWindowEvent from './useWindowEvent';

describe('useWindowEvent', () => {
  const useTestWrapper = (event, handler) => {
    const TestComponent = () => <div hooked={useWindowEvent(event, handler)} />;
    return mount(<TestComponent />);
  };
  const useHook = (wrapper) => wrapper.update().children().prop('hooked');
  const subject = (...params) => useHook(useTestWrapper(...params)); // eslint-disable-line react-hooks/rules-of-hooks

  it('registers a window event handler', () => {
    jest.spyOn(window, 'addEventListener');
    const handler = jest.fn();
    act(() => {
      subject('click', handler);
    });
    expect(window.addEventListener).toHaveBeenCalledWith('click', handler);
  });

  it('unregisters handler on unmount', () => {
    jest.spyOn(window, 'removeEventListener');
    const handler = jest.fn();
    const wrapper = useTestWrapper('click', handler);
    wrapper.unmount();
    expect(window.removeEventListener).toHaveBeenCalledWith('click', handler);
  });
});
