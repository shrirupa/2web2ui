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

  const renderRowWithActions = (row) => ({
    fields: baseProps.renderRow(row),
    actions: {
      editRoute: '/sprocket/1',
      deletable: true,
      customActions: [{ content: 'Flocculate', to: '/sprocket/1/flocculate' }]
    }
  });

  beforeEach(() => {
    baseProps = {
      columns: fixtures.columns,
      renderRow: ({ name, diam, scale }) => [name, diam, scale],
      loadItems: jest.fn(),
      noun: fixtures.noun,
      primaryAction: { to: '/sprocket/new' }
    };
    onEdit = jest.fn();
    onDelete = jest.fn().mockResolvedValue({});
    items = [...fixtures.items];
    error = { ...fixtures.error };
  });

  it('should render while loading', () => {
    expect(subject({ loading: true }).find('Loading')).toExist();
  });

  it('should render an error', () => {
    expect(subject({ error }).find('ApiErrorBanner')).toExist();
  });

  it('should render items', () => {
    expect(subject({ items }).find('TableCollection')).toExist();
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
      renderRow: renderRowWithActions
    });
    const renderRowFn = wrapper.find('TableCollection').prop('getRowData');
    const row = renderRowFn(items[0]);
    expect(row).toHaveLength(Object.keys(items[0]).length + 1);
    expect(row).toMatchSnapshot();
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

  it('should render custom primary action content', () => {
    const content = 'Make a thang';
    expect(subject({ primaryAction: { content, ...baseProps.primaryAction }}).find('Page').prop('primaryAction').content).toEqual(content);
  });
});
