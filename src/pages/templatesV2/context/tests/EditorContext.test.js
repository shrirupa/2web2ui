import React from 'react';
import { mount, shallow } from 'enzyme';
import useRouter from 'src/hooks/useRouter';
import { EditorContextProvider } from '../EditorContext';

jest.mock('src/hooks/useRouter');

describe('EditorContext', () => {
  describe('EditorContextProvider', () => {
    const subject = ({ render = shallow, value = {}} = {}) => {
      useRouter.mockReturnValue({ requestParams: { id: 'test-template', subaccount: '123' }});

      return render(
        <EditorContextProvider
          value={{ getDraft: () => {}, getPublished: () => {}, listDomains: () => {}, listSubaccounts: () => {}, ...value }}
        >
          <div>Hello</div>
        </EditorContextProvider>
      );
    };

    it('renders children wrapped by a context provider', () => {
      expect(subject()).toMatchSnapshot();
    });

    it('sets provider value from props', () => {
      const value = { test: 'example' };
      const wrapper = subject({ value });

      expect(wrapper).toHaveProp('value', expect.objectContaining(value));
    });

    it('calls getDraft and getPublished on mount', () => {
      const getDraft = jest.fn();
      const getPublished = jest.fn();

      subject({
        render: mount, // for useEffect
        value: { getDraft, getPublished, getTestDataFromLocalStorage: jest.fn() }
      });

      expect(getDraft).toHaveBeenCalledWith('test-template', '123');
      expect(getPublished).toHaveBeenCalledWith('test-template', '123');
    });
  });
});
