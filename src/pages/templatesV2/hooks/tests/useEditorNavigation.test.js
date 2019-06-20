import React from 'react';
import { act } from 'react-dom/test-utils';
import { mount } from 'enzyme';
import useRouter from 'src/hooks/useRouter';
import useEditorNavigation from '../useEditorNavigation';

jest.mock('src/hooks/useRouter');

describe('useEditorNavigation', () => {
  const useTestWrapper = ({ routerState } = {}) => {
    useRouter.mockReturnValue({
      requestParams: { id: 'test-template' },
      ...routerState
    });

    const TestComponent = () => <div hooked={useEditorNavigation()}/>;
    return mount(<TestComponent/>);
  };
  const useHook = (wrapper) => wrapper.update().children().prop('hooked');

  it('returns first link by default', () => {
    const wrapper = useTestWrapper();

    expect(useHook(wrapper))
      .toEqual(expect.objectContaining({ currentNavigationIndex: 0, currentNavigationKey: 'content' }));
  });

  it('returns matched link', () => {
    const wrapper = useTestWrapper({
      routerState: {
        requestParams: {
          id: 'test-template',
          navKey: 'settings'
        }
      }
    });

    expect(useHook(wrapper))
      .toEqual(expect.objectContaining({ currentNavigationIndex: 1, currentNavigationKey: 'settings' }));
  });

  describe('redirections', () => {
    let historyPush;
    beforeEach(() => {
      historyPush = jest.fn();
    });

    afterEach(() => {
      historyPush.mockReset();
    });

    const subject = (wrapper) => {
      act(() => {
        useHook(wrapper).setNavigation('settings');
      });
    };
    const routeState = (overrides = {}) => ({
      routerState: {
        history: { push: historyPush },
        requestParams: { id: 'test-template', ...overrides }
      }
    });

    it('redirects when link is clicked (draft)', () => {
      subject(useTestWrapper(routeState()));
      expect(historyPush).toHaveBeenCalledWith('/templatesv2/edit/test-template/draft/settings');
    });

    it('redirects with subaccount id (draft)', () => {
      subject(useTestWrapper(routeState({ subaccount: 102 })));
      expect(historyPush).toHaveBeenCalledWith('/templatesv2/edit/test-template/draft/settings?subaccount=102');
    });

    it('redirects when link is clicked (published)', () => {
      subject(useTestWrapper(routeState({ version: 'published' })));
      expect(historyPush).toHaveBeenCalledWith('/templatesv2/edit/test-template/published/settings');
    });

    it('redirects with subaccount id (published)', () => {
      subject(useTestWrapper(routeState({ version: 'published', subaccount: 102 })));
      expect(historyPush).toHaveBeenCalledWith('/templatesv2/edit/test-template/published/settings?subaccount=102');
    });
  });
});
