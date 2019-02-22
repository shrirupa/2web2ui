import React from 'react';
import { connect } from 'react-redux';
import TimeAgo from 'react-timeago';
import { Tag } from '@sparkpost/matchbox';

import ListPage from 'src/components/listPage/ListPage';
import { Users } from 'src/components/images';
import PageLink from 'src/components/pageLink/PageLink';
import User from './components/User';

import { listUsers, deleteUser } from 'src/actions/users';
import { selectUsers } from 'src/selectors/users';

const COLUMNS = [
  { label: 'User', sortKey: 'name' },
  { label: 'Role', sortKey: 'access' },
  { label: 'Two Factor Auth', sortKey: 'tfa_enabled' },
  { label: 'Last Login', sortKey: 'last_login' },
  null
];

const DEFAULT_SORT_COLUMN = 'name';

const FILTER_BOX = {
  keyMap: { role: 'access' },
  exampleModifiers: ['name', 'email', 'role'],
  itemToStringKeys: ['username', 'name', 'email']
};

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

const formatRow = (user) => ({
  fields: [
    <User name={user.name} email={user.email} username={user.username} />,
    user.access,
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
  ],
  actions: {
    editRoute: `/account/users/edit/${user.username}`,
    deletable: !user.isCurrentUser
  }
});

export class ListPage2 extends React.Component {
  inviteUser = () => {
    const { history } = this.props;
    history.push('/account/users/create');
  };

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

  deleteUser = (user) => this.props.deleteUser(user.username);

  render() {
    const { error, listUsers, loading, users } = this.props;

    const empty = this.emptyState();

    return (
      <ListPage
        noun='user'
        primaryActionTitle='Invite User'
        error={error}
        loadItems={listUsers}
        loading={loading}
        items={users}
        columns={COLUMNS}
        defaultSortColumn={DEFAULT_SORT_COLUMN}
        empty={empty}
        formatRow={formatRow}
        onCreate={this.inviteUser}
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
    users: selectUsers(state)
  }),
  {
    listUsers,
    deleteUser
  }
)(ListPage2);
