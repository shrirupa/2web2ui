import React from 'react';
import { mount } from 'enzyme';
import useRouter from 'src/hooks/useRouter';

import { BatchStatusPage } from '../BatchStatusPage';

jest.mock('src/hooks/useRouter');
jest.mock('src/actions/signalsBatchStatus');

describe('BatchStatusPage', () => {
  const mockUseRouter = (overrides = {}) => {
    const routerReturn = {
      location: { pathname: '/route' },
      history: { push: jest.fn() },
      requestParams: {},
      ...overrides
    };
    useRouter.mockReturnValue(routerReturn);
    return routerReturn;
  };

  const mockUseCollection = (overrides = {}) => {
    const returnValue = {
      loading: true,
      items: null,
      filters: {},
      setFilters: jest.fn(),
      totalCount: 0,
      hasMore: false,
      page: 1,
      perPage: 10,
      goToPage: jest.fn(),
      setPerPage: jest.fn()
    };
    return returnValue;
  };

  beforeEach(() => {
    mockUseRouter();
    mockUseCollection();
  });

  const subject = (props = {}) => mount(<BatchStatusPage {...props} />);

  it('renders a page', () => {
    expect(subject().find('Page')).toExist();
  });

  it('renders loading', () => {
    expect(subject().find('PanelLoading')).toExist();
  });

  it('renders errors', () => {
    const wrapper = subject();
    wrapper.update();
    expect(wrapper.find('ApiErrorBanner')).toExist();
  });

  it('disables search while loading', () => {
    const wrapper = subject();
    expect(wrapper.find('BatchStatusSearch').prop('disabled')).toBeTruthy();
  });

  it('disables search on error', () => {
    const wrapper = subject();
    wrapper.update();
    expect(wrapper.find('BatchStatusSearch').prop('disabled')).toBeTruthy();
  });

  it('uses query params to initialise the collection if available', () => {
    mockUseRouter({ requestParams: { page: '2', perPage: '25', relativeRange: '7days' }});
    subject();
  });

  it('updates query params', () => {
    const mockRouter = mockUseRouter();
    subject();
    expect(mockRouter.history.push).toHaveBeenCalledTimes(1);
  });
});
