import React from 'react';
import { act } from 'react-dom/test-utils';
import { mount } from 'enzyme';
import useTestData from '../useTestData';

describe('useEditorTabs', () => {
  let getTestDataFromLocalStorage;
  let setTestDataToLocalStorage;

  beforeEach(() => {
    getTestDataFromLocalStorage = jest.fn();
    setTestDataToLocalStorage = jest.fn();
  });

  const useTestWrapper = (value = {}) => {
    const TestComponent = () => <div hooked={useTestData({
      getTestDataFromLocalStorage,
      setTestDataToLocalStorage,
      draft: { id: 'foo' },
      ...value
    })}/>;
    return mount(<TestComponent/>);
  };

  const useHook = (wrapper) => wrapper.update().children().prop('hooked');

  it('fetches test data from storage on mount', () => {
    useHook(useTestWrapper());
    expect(getTestDataFromLocalStorage).toHaveBeenCalledWith({ id: 'foo', mode: 'draft' });
  });

  it('fetches testdata when mode change', () => {
    useHook(useTestWrapper({ isPublishedMode: true }));
    expect(getTestDataFromLocalStorage).toHaveBeenCalledWith({ id: 'foo', mode: 'published' });
  });

  it('fetches testdata when template ID change', () => {
    useHook(useTestWrapper({ draft: { id: 'foo2' }}));
    expect(getTestDataFromLocalStorage).toHaveBeenCalledWith({ id: 'foo2', mode: 'draft' });
  });

  it('updates local state when test data changes externally', () => {
    const templateTestData = { substitution_data: { name: 'foo' }};
    const { testData } = useHook(useTestWrapper({ templateTestData }));
    expect(testData).toEqual(templateTestData);
  });

  describe('syncTestDataInStorage', () => {
    it('updates local storage when local state is different', () => {
      const wrapper = useTestWrapper({ templateTestData: 'foo' });
      act(() => {
        useHook(wrapper).setTestData('bar');
      });
      const context = useHook(wrapper);
      context.syncTestDataInStorage();
      expect(setTestDataToLocalStorage).toHaveBeenCalled();
    });

    it('does not updates local storage when local state is unchanged', () => {
      const wrapper = useTestWrapper({ templateTestData: 'foo' });
      act(() => {
        useHook(wrapper).setTestData('foo');
      });
      const context = useHook(wrapper);
      context.syncTestDataInStorage();
      expect(setTestDataToLocalStorage).not.toHaveBeenCalled();
    });
  });

  describe('formattedTestData', () => {
    it('return parsed json', () => {
      const json = { foo: 'bar' };
      const { formattedTestData } = useHook(useTestWrapper({ templateTestData: JSON.stringify(json) }));
      expect(formattedTestData).toEqual(json);
    });
  });
});
