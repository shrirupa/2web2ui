import React from 'react';
import { mount } from 'enzyme';
import useCollectionWithCursor from '../useCollectionWithCursor';

describe('useCollectionWithCursor', () => {
  const useTestWrapper = (...args) => {
    const TestComponent = () => <div hooked={useCollectionWithCursor(...args)} />;
    return mount(<TestComponent />);
  };
  const useHook = (wrapper) => wrapper.update().children().prop('hooked');

  it('returns collection props', () => {
    const wrapper = useTestWrapper({ page: 1, perPage: 10, loadItems: jest.fn().mockResolvedValue([]), onLoadError: jest.fn() });
    const hookResult = useHook(wrapper);
    expect(hookResult).toEqual(expect.objectContaining({
      loading: true,
      items: null,
      totalCount: 0,
      page: 1,
      perPage: 10
    }));
  });

  it.skip('sets collection props after loading', () => {
  });

  it.skip('sets total count after loading', () => {
  });

  it.skip('sets has more flag after loading', () => {
  });

  it.skip('uses initial settings on first load', () => {
  });

  it.skip('loads after changing page', () => {
  });

  it.skip('loads after changing per page', () => {
  });

  it.skip('loads after changing filters', () => {
  });

  it.skip('resets page after changing filters', () => {
  });
});
