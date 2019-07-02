import React from 'react';
import { act } from 'react-dom/test-utils';
import { mount } from 'enzyme';
import useFieldValueOnReturn from '../useFieldValueOnReturn';
import useWindowEvent from 'src/hooks/useWindowEvent';
import { onEnter } from 'src/helpers/keyEvents';

jest.mock('src/helpers/keyEvents');
jest.mock('src/hooks/useWindowEvent');

describe('useFieldValueOnReturn', () => {
  const useTestWrapper = (value, handler) => {
    const TestComponent = () => <div hooked={useFieldValueOnReturn(value, handler)} />;
    return mount(<TestComponent />);
  };
  const useHook = (wrapper) => wrapper.update().children().prop('hooked');
  const subject = (...params) => useHook(useTestWrapper(...params)); // eslint-disable-line react-hooks/rules-of-hooks

  beforeEach(() => {
    onEnter.mockImplementation((arg) => arg);
  });

  it('returns a value and event handlers', () => {
    expect(subject('', jest.fn())).toEqual(expect.objectContaining({
      value: '',
      onChange: expect.any(Function),
      onFocus: expect.any(Function),
      onBlur: expect.any(Function)
    }));
  });

  it('tracks value on change', () => {
    const hook = useTestWrapper('', jest.fn());
    const { onChange } = useHook(hook);
    act(() => {
      onChange({ target: { value: 'a' }});
    });
    const { value } = useHook(hook);
    expect(value).toEqual('a');
  });

  it('calls callback when return key is hit and focussed', () => {
    const callback = jest.fn();
    const hook = useTestWrapper('value', callback);
    const { onFocus } = useHook(hook);
    act(() => {
      onFocus();
    });
    onEnter.mock.calls[1][0]({ target: { blur: jest.fn() }});
    expect(callback).toHaveBeenCalledWith('value');
  });

  it('blurs control when enter key is hit', () => {
    const callback = jest.fn();
    const hook = useTestWrapper('value', callback);
    const { onFocus } = useHook(hook);
    act(() => {
      onFocus();
    });
    const blur = jest.fn();
    onEnter.mock.calls[1][0]({ target: { blur }});
    expect(blur).toHaveBeenCalledTimes(1);
  });

  it('registers a window keydown event handler', () => {
    subject('', jest.fn());
    expect(useWindowEvent).toHaveBeenCalledWith('keydown', expect.any(Function));
  });
});
