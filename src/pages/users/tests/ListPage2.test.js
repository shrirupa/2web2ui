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
      deleteUser: jest.fn()
    };
  });

  const subject = (props) => shallow(<ListPage2 {...baseProps} {...props} />);
  const subjectFormatRowFn = (props) => subject(props).find('ListPage').prop('formatRow');

  it('renders a list page', () => {
    expect(subject()).toMatchSnapshot();
  });

  it('formats users for the table collection', () => {
    const formatRow = subjectFormatRowFn();
    const row = formatRow({ ...users[0], isCurrentUser: false });
    expect(row).toMatchSnapshot();
  });

  it('displays TFA enabled status', () => {
    const formatRow = subjectFormatRowFn();
    expect(formatRow({ ...users[0], tfa_enabled: true })).toMatchSnapshot();
  });

  it('displays last login', () => {
    const formatRow = subjectFormatRowFn();
    expect(formatRow({ ...users[0], last_login: new Date('2018-04-01T16:15:00.000Z') })).toMatchSnapshot();
  });

  it('does not allow deletion of the current user', () => {
    const formatRow = subjectFormatRowFn();
    expect(formatRow({ ...users[0], isCurrentUser: true }).actions.deletable).toBeFalsy();
  });

  it('invites users', () => {
    const props = {
      history: { push: jest.fn() }
    };
    const createFn = subject(props).find('ListPage').prop('onCreate');
    createFn();
    expect(props.history.push).toHaveBeenCalledWith('/account/users/create');
  });

  it('deletes users', () => {
    const deleteFn = subject().find('ListPage').prop('onDelete');
    deleteFn(users[0]);
    expect(baseProps.deleteUser).toHaveBeenCalledWith(users[0].username);
  });
});
