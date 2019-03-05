const currentUser = {
  username: 'test-user-1'
};

const users = [
  {
    name: 'Test User 1',
    username: 'test-user-1',
    access: 'admin',
    email: 'user1@test.com',
    tfa_enabled: false
  },
  {
    name: 'Test User 2',
    username: 'test-user-2',
    access: 'admin',
    email: 'user2@test.com',
    tfa_enabled: true
  },
  {
    name: 'Test User 3',
    username: 'test-user-3',
    access: 'admin',
    email: 'user3@test.com',
    tfa_enabled: true,
    subaccount_id: 125
  }
];

export { currentUser, users };
