import React from 'react';
import { mount } from 'enzyme';
import { MemoryRouter } from 'react-router-dom';
import { RouterContextProvider } from 'src/context/RouterContext';

import { BatchStatusPage } from '../BatchStatusPage';

jest.mock('src/actions/signalsBatchStatus');

describe('BatchStatusPage', () => {
  const requestParams = 'relativeRange=custom&from=2019-01-01T00:00:00Z&to=2019-02-01T23:59:59Z&showSuccessful=true&errorTypes=decompress&errorTypes=system';

  const App = ({ requestParams, children }) => <MemoryRouter initialEntries={[`/?${requestParams}`]}>
    <RouterContextProvider>
      {children}
    </RouterContextProvider>
  </MemoryRouter>;

  const renderPage = (props) => {
    const baseProps = {
      loading: false,
      items: [],
      signalsBatchStatusReset: jest.fn(),
      signalsBatchStatusNextPage: jest.fn(),
      signalsBatchStatusPrevPage: jest.fn(),
      page: 1
    };
    return <BatchStatusPage {...baseProps} {...props} />;
  };

  const subject = ({ props = {}, requestParams = '' } = {}) => mount(
    <App requestParams={requestParams}>{renderPage(props)}</App>
  ).find('BatchStatusPage');

  const getHistoryObject = (wrapper) => wrapper.parent().prop('history');

  it('renders a page', () => {
    expect(subject().find('Page')).toExist();
  });

  it('renders loading', () => {
    expect(subject({ props: { loading: true }}).find('PanelLoading')).toExist();
  });

  it('renders errors', () => {
    const wrapper = subject({ props: { error: new Error('on no') }});
    expect(wrapper.find('ApiErrorBanner')).toExist();
  });

  it('disables search while loading', () => {
    const wrapper = subject({ props: { loading: true }});
    expect(wrapper.find('BatchStatusSearch').prop('disabled')).toBeTruthy();
  });

  it('disables search on error', () => {
    const wrapper = subject({ props: { error: new Error('oh no') }});
    expect(wrapper.find('BatchStatusSearch').prop('disabled')).toBeTruthy();
  });

  it('uses query params to prepopulate search', () => {
    const wrapper = subject({ requestParams });
    expect(wrapper.find('BatchStatusSearch').prop('filters')).toEqual(
      expect.objectContaining({
        relativeRange: 'custom',
        errorTypes: ['decompress', 'system'],
        showSuccessful: true
      })
    );
  });

  it('loads fresh events on mount', () => {
    expect(subject().prop('signalsBatchStatusReset')).toHaveBeenCalledTimes(1);
  });

  it('loads fresh events in perPage change', () => {
    const wrapper = subject();
    wrapper.find('BatchStatusCollection').prop('onChangePageSize')(25);
    expect(wrapper.prop('signalsBatchStatusReset')).toHaveBeenCalledWith(expect.objectContaining({
      per_page: 25
    }));
  });

  it('loads the next page on request', () => {
    const wrapper = subject();
    wrapper.find('BatchStatusCollection').prop('onChangePage')(2);
    expect(wrapper.prop('signalsBatchStatusNextPage')).toHaveBeenCalledTimes(1);
  });

  it('loads the previous page on request', () => {
    const wrapper = subject({ props: { page: 2 }});
    wrapper.find('BatchStatusCollection').prop('onChangePage')(1);
    expect(wrapper.prop('signalsBatchStatusPrevPage')).toHaveBeenCalledTimes(1);
  });

  it('loads fresh events on rewind', () => {
    const wrapper = subject();
    wrapper.find('BatchStatusCollection').prop('onFirstPage')();
    expect(wrapper.prop('signalsBatchStatusReset')).toHaveBeenCalledTimes(2);
  });

  it('uses query params to load on mount', () => {
    expect(subject({ requestParams }).prop('signalsBatchStatusReset')).toHaveBeenCalledWith(
      expect.objectContaining({
        events: 'error,success',
        error_types: 'decompress,system'
      })
    );
  });

  it('updates query params on filter change', () => {
    const wrapper = subject();
    const history = getHistoryObject(wrapper);
    jest.spyOn(history, 'push');
    const filters = {
      batchIds: ['batch1', 'batch2']
    };
    wrapper
      .find('BatchStatusSearch')
      .prop('onFilterChange')(filters);
    expect(history.push).toHaveBeenCalledWith(
      expect.stringMatching(/batchIds=batch1.*batchIds=batch2/)
    );
  });
});
