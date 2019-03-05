import React from 'react';
import { shallow } from 'enzyme';

import { ListPage2 } from '../ListPage2';

import { currentUser, users } from './fixtures';

describe('Page: ListPage2', () => {
  let baseProps;
  beforeEach(() => {
    baseProps = {
      currentUser,
      error: null,
      loading: false,
      users,
      listUsers: jest.fn(),
      deleteUser: jest.fn(),
      hasSubaccounts: false,
      isSubAccountReportingLive: true
    };
  });

  const subject = (props) => shallow(<ListPage2 {...baseProps} {...props} />);
  const subjectRenderRowFn = (props) => subject(props).find('ListPage').prop('renderRow');

  it('renders a list page', () => {
    expect(subject()).toMatchSnapshot();
  });

  it('formats users for the table collection', () => {
    const renderRow = subjectRenderRowFn();
    const row = renderRow({ ...users[0], isCurrentUser: false });
    expect(row).toMatchSnapshot();
  });

  it('displays TFA enabled status', () => {
    const renderRow = subjectRenderRowFn();
    expect(renderRow({ ...users[0], tfa_enabled: true })).toMatchSnapshot();
  });

  it('displays last login', () => {
    const renderRow = subjectRenderRowFn();
    expect(renderRow({ ...users[0], last_login: new Date('2018-04-01T16:15:00.000Z') })).toMatchSnapshot();
  });

  it('displays subaccount info when the account uses them', () => {
    expect(subject({ hasSubaccounts: true }).find('ListPage').prop('columns')).toContainEqual(expect.objectContaining({
      label: 'Subaccount'
    }));
  });

  it('should not render subaccount info when the feature is disabled', () => {
    expect(subject({ hasSubaccounts: true, isSubAccountReportingLive: false }).find('ListPage').prop('columns')).not.toContainEqual(expect.objectContaining({
      label: 'Subaccount'
    }));
  });

  it('does not allow deletion of the current user', () => {
    const renderRow = subjectRenderRowFn();
    expect(renderRow({ ...users[0], isCurrentUser: true }).actions.deletable).toBeFalsy();
  });

  it('deletes users', () => {
    const deleteFn = subject().find('ListPage').prop('onDelete');
    deleteFn(users[0]);
    expect(baseProps.deleteUser).toHaveBeenCalledWith(users[0].username);
  });
});
