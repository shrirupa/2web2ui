import React from 'react';
import { connect } from 'react-redux';
import TimeAgo from 'react-timeago';
import { Tag } from '@sparkpost/matchbox';

import ListPage from 'src/components/listPage/ListPage';
import { Users } from 'src/components/images';
import PageLink from 'src/components/pageLink/PageLink';
import { SubaccountTag } from 'src/components';
import User from './components/User';

import { listUsers, deleteUser } from 'src/actions/users';
import { selectUsers } from 'src/selectors/users';
import { hasSubaccounts } from 'src/selectors/subaccounts';

import { SUBACCOUNT_REPORTING_ROLE } from 'src/constants';
import { hasUiOption } from 'src/helpers/conditions/account';

const COLUMNS = [
  { label: 'User', sortKey: 'name' },
  { label: 'Role', sortKey: 'access' },
  { label: 'Two Factor Auth', sortKey: 'tfa_enabled' },
  { label: 'Last Login', sortKey: 'last_login' },
  null
];

const SUB_COLUMNS = [
  { label: 'User', sortKey: 'name', width: '40%' },
  { label: 'Role', sortKey: 'access', width: '11%' },
  { label: 'Subaccount', sortKey: 'subaccount_id', width: '15%' },
  { label: 'Two Factor Auth', sortKey: 'tfa_enabled', width: '8%' },
  { label: 'Last Login', sortKey: 'last_login', width: '14%' },
  null
];

const DEFAULT_SORT_COLUMN = 'name';

const FILTER_BOX = {
  keyMap: { role: 'access' },
  exampleModifiers: ['name', 'email', 'role'],
  itemToStringKeys: ['username', 'name', 'email']
};

function formatRole(role) {
  if (role === SUBACCOUNT_REPORTING_ROLE) {
    return 'reporting';
  }
  return role;
}

const renderDeleteWarning = ({ name }) => (
  <p>
    <span>User "</span>
    <span>{name}</span>
    <span>
      " will no longer be able to log in or access this SparkPost account.
      All API keys associated with this user will be transferred to you.
    </span>
  </p>
);

export class ListPage2 extends React.Component {
  emptyState = () => {
    const { currentUser, users } = this.props;

    return {
      show: users.length === 1,
      title: 'Invite Your Team to SparkPost',
      image: Users,
      content: <p>Manage your team's accounts and roles.</p>,
      secondaryAction: {
        Component: PageLink,
        content: 'Edit your user account',
        to: `/account/users/edit/${currentUser.username}`
      }
    };
  }

  renderRow = (user) => {
    const { hasSubaccounts, isSubAccountReportingLive } = this.props;
    const fields = [
      <User name={user.name} email={user.email} username={user.username} />,
      formatRole(user.access),
      user.tfa_enabled ? (
        <Tag color={'blue'}>Enabled</Tag>
      ) : (
        <Tag>Disabled</Tag>
      ),
      user.last_login ? (
        <TimeAgo date={user.last_login} live={false} />
      ) : (
        'Never'
      )
    ];

    if (isSubAccountReportingLive && hasSubaccounts) {
      fields.splice(2, 0, user.subaccount_id ? <SubaccountTag id={user.subaccount_id} /> : null);
    }

    return {
      fields,
      actions: {
        editRoute: `/account/users/edit/${user.username}`,
        deletable: !user.isCurrentUser
      }
    };
  }

  deleteUser = (user) => this.props.deleteUser(user.username);

  render() {
    const { error, listUsers, loading, users, hasSubaccounts, isSubAccountReportingLive } = this.props;
    const columns = isSubAccountReportingLive && hasSubaccounts ? SUB_COLUMNS : COLUMNS;

    const empty = this.emptyState();

    return (
      <ListPage
        noun='user'
        primaryAction={{ content: 'Invite User', to: '/account/users/create' }}
        error={error}
        loadItems={listUsers}
        loading={loading}
        items={users}
        columns={columns}
        defaultSortColumn={DEFAULT_SORT_COLUMN}
        empty={empty}
        renderRow={this.renderRow}
        onDelete={this.deleteUser}
        deleteWarning={renderDeleteWarning}
        filterBox={FILTER_BOX}
      />
    );
  }
}

export default connect(
  (state) => ({
    currentUser: state.currentUser,
    error: state.users.error,
    loading: state.users.loading,
    users: selectUsers(state),
    hasSubaccounts: hasSubaccounts(state),
    isSubAccountReportingLive: hasUiOption('subaccount_reporting')(state)
  }),
  {
    listUsers,
    deleteUser
  }
)(ListPage2);
