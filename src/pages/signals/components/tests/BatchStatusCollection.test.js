import React from 'react';
import { mount } from 'enzyme';
import { MemoryRouter } from 'react-router-dom';

import { Pager } from '@sparkpost/matchbox';

import BatchStatusCollection from '../BatchStatusCollection';

describe('BatchStatusCollection', () => {
  const App = ({ children }) => <MemoryRouter initialEntries={['/']}>
    {children}
  </MemoryRouter>;

  const subject = (props = {}) => {
    const baseProps = {
      events: [
        {
          timestamp: Date.now(),
          type: 'error',
          error_type: 'decompress',
          batch_id: 'a-nice-lidl-batch-id',
          number_succeeded: 1,
          number_failed: 100,
          number_duplicates: 2
        },
        {
          timestamp: Date.now(),
          type: 'success',
          batch_id: 'a-nice-lidl-batch-id',
          number_succeeded: 101,
          number_failed: 0,
          number_duplicates: 0
        }
      ],
      totalCount: 50,
      hasMore: false,
      page: 0,
      perPage: 10,
      onFirstPage: jest.fn(),
      onChangePage: jest.fn(),
      onChangePageSize: jest.fn()
    };

    return mount(<App>
      <BatchStatusCollection {...baseProps} {...props} />
    </App>).find(BatchStatusCollection);
  };

  it('renders empty without events', () => {
    expect(subject({ events: [], totalCount: 0, hasMore: false }).find('Empty')).toExist();
  });

  it('renders events to a collection', () => {
    const wrapper = subject();
    expect(wrapper.find('TableCollection').prop('rows')).toEqual(wrapper.prop('events'));
  });

  describe('pagination', () => {
    const pagingComponent = (props = {}) => subject(props).find('CursorPaging');

    it('disables prev page button on first page', () => {
      expect(pagingComponent().prop('previousDisabled')).toBeTruthy();
    });

    it('enables prev button on page > 1', () => {
      expect(pagingComponent({ page: 2 }).prop('previousDisabled')).toBeFalsy();
    });

    it('disables next button on final page', () => {
      expect(pagingComponent().prop('nextDisabled')).toBeTruthy();
    });

    it('enables next button when more pages are available', () => {
      expect(pagingComponent({ perPage: 1, hasMore: true }).prop('nextDisabled')).toBeFalsy();
    });

    it('calls back on next page button click', () => {
      const wrapper = subject({ hasMore: true });
      wrapper.find(Pager.Next).find('button').simulate('click');
      expect(wrapper.prop('onChangePage')).toHaveBeenCalledWith(1);
    });

    it('calls back on prev page button click', () => {
      const wrapper = subject({ page: 2, hasMore: true });
      wrapper.find(Pager.Previous).find('button').simulate('click');
      expect(wrapper.prop('onChangePage')).toHaveBeenCalledWith(1);
    });

    it('calls back on first page button click', () => {
      const wrapper = subject();
      wrapper.find('button').first().simulate('click');
      expect(wrapper.prop('onFirstPage')).toHaveBeenCalledTimes(1);
    });

    it('calls back on page size button click', () => {
      const wrapper = subject();
      wrapper.find('PerPageButtons button').first().simulate('click');
      expect(wrapper.prop('onChangePageSize')).toHaveBeenCalledTimes(1);
    });
  });
});
