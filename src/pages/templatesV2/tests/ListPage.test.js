import React from 'react';
import { shallow } from 'enzyme';

import ListPage from '../ListPage';

describe('ListPage', () => {
  const subject = (props = {}) => shallow(
    <ListPage
      canModify={true}
      hasSubaccounts={false}
      listTemplates={() => {
      }}
      loading={false}
      templates={[
        {
          published: true,
          id: 'id1',
          name: 'subaccount template',
          last_update_time: '2017-08-10T14:15:16+00:00',
          subaccount_id: 101,
          shared_with_subaccounts: false
        },
        {
          published: false,
          id: 'id2',
          name: 'shared template',
          last_update_time: '2017-08-10T14:15:16+00:00',
          shared_with_subaccounts: true
        },
        {
          published: false,
          id: 'id3',
          name: 'master template',
          last_update_time: '2017-08-10T14:15:16+00:00'
        }
      ]}
      {...props}
    />
  );

  it('renders correctly', () => {
    expect(subject()).toMatchSnapshot();
  });

  it('loads templates on load', () => {
    const listTemplates = jest.fn();
    subject({ listTemplates });
    expect(listTemplates).toHaveBeenCalled();
  });

  it('renders without primary action for read-only users', () => {
    const wrapper = subject({ canModify: false });
    expect(wrapper).toHaveProp('primaryAction', undefined);
  });

  it('renders empty state', () => {
    const wrapper = subject({ templates: []});
    expect(wrapper).toHaveProp('empty', expect.objectContaining({ show: true }));
  });

  it('renders Loading', () => {
    const wrapper = subject({ loading: true });
    expect(wrapper.find('Loading')).toExist();
  });

  describe('renders error banner', () => {
    it('with error details', () => {
      const wrapper = subject({ error: new Error('Oh no!'), templates: []});
      expect(wrapper.find('ApiErrorBanner')).toHaveProp('errorDetails', 'Oh no!');
    });

    it('with reload button', () => {
      const listTemplates = jest.fn();
      const wrapper = subject({
        error: new Error('Oh no!'),
        listTemplates,
        templates: []
      });

      expect(wrapper.find('ApiErrorBanner')).toHaveProp('reload', listTemplates);
    });
  });
});
