import React from 'react';
import { shallow } from 'enzyme';

import ListPage from '../ListPage';

import * as fixtures from './fixtures';

describe('ListPage', () => {
  let baseProps;
  let onDelete;
  let onEdit;
  let items;
  let error;

  const subject = (props) => shallow(<ListPage {...baseProps} {...props} />);

  const formatRowWithActions = (row) => ({
    fields: baseProps.formatRow(row),
    actions: {
      editRoute: '/sprocket/1',
      deletable: true,
      customActions: [{ content: 'Flocculate', to: '/sprocket/1/flocculate' }]
    }
  });

  beforeEach(() => {
    baseProps = {
      columns: fixtures.columns,
      formatRow: ({ name, diam, scale }) => [name, diam, scale],
      loadItems: jest.fn(),
      noun: fixtures.noun,
      onCreate: jest.fn()
    };
    onEdit = jest.fn();
    onDelete = jest.fn();
    items = [...fixtures.items];
    error = { ...fixtures.error };
  });

  it('should render while loading', () => {
    expect(subject({ loading: true }).find('Loading')).toHaveLength(1);
  });

  it('should render an error', () => {
    expect(subject({ error }).find('ApiErrorBanner')).toHaveLength(1);
  });

  it('should render items', () => {
    expect(subject({ items }).find('TableCollection')).toHaveLength(1);
  });

  it('should render a filter box', () => {
    expect(
      subject({ items, filterBox: fixtures.filterBox })
        .find('TableCollection')
        .prop('filterBox')
    ).toMatchObject({
      show: true,
      ...fixtures.filterBox
    });
  });

  it('should append item actions', () => {
    const wrapper = subject({
      items,
      onEdit,
      onDelete,
      formatRow: formatRowWithActions
    });
    const formatRowFn = wrapper.find('TableCollection').prop('getRowData');
    const formattedRow = formatRowFn(items[0]);
    expect(formattedRow).toHaveLength(Object.keys(items[0]).length + 1);
    expect(formattedRow).toMatchSnapshot();
  });

  it('should show the delete modal on request', () => {
    const wrapper = subject({ items, onEdit, onDelete });
    wrapper.instance().showDeleteModal(items[0]);
    expect(wrapper.find('DeleteModal').prop('open')).toBeTruthy();
  });

  it('should format a data-dependant custom delete message', () => {
    const renderDeleteWarning = (item) => (
      <p>{`${item.name} will no longer be able to sing!`}</p>
    );
    const wrapper = subject({ items, onDelete, renderDeleteWarning });
    wrapper.instance().showDeleteModal(items[0]);
    expect(wrapper.find('DeleteModal').prop('content')).toEqual(
      renderDeleteWarning(items[0])
    );
  });

  it('should call onDelete on confirm', () => {
    const wrapper = subject({ items, onEdit, onDelete });
    wrapper.find('DeleteModal').prop('onDelete')();
    expect(onDelete).toHaveBeenCalledTimes(1);
  });

  it('should dismiss the delete modal on cancel', () => {
    const wrapper = subject({ items, onEdit, onDelete });
    wrapper.instance().showDeleteModal(items[0]);
    wrapper.find('DeleteModal').prop('onCancel')();
    expect(onDelete).not.toHaveBeenCalled();
    expect(wrapper.find('DeleteModal').prop('open')).toBeFalsy();
  });
});
