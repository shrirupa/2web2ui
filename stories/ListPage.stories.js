import React from 'react';
import { storiesOf } from '@storybook/react';
import { action } from '@storybook/addon-actions';
import { Banner } from '@sparkpost/matchbox';

import PageLink from 'src/components/pageLink/PageLink';
import { Users } from 'src/components/images';

import ListPage from 'src/components/listPage/ListPage';
import {
  noun,
  columns,
  items,
  error,
  filterBox
} from 'src/components/listPage/tests/fixtures';

import { slugify } from 'src/helpers/string';

import StoryContainer from './StoryContainer';

const renderRow = (item) => [item.name, item.diam];
const renderRowWithActions = (item) => ({
  fields: [item.name, item.diam],
  actions: {
    editRoute: `/account/sprocket/${slugify(item.name)}`,
    deletable: item.name !== 'm3 bolt'
  }
});

const renderDeleteWarning = ({ name }) => <p>This lovely {name} will no longer be usable.</p>;

const baseProps = {
  noun,
  primaryAction: { to: '/sprocket/new' },
  loadItems: action('loadItems'),
  columns,
  filterBox,
  renderRow,
  additionalActions: [
    { Component: PageLink, content: 'Do a less obvious thing here', to: '' },
    { Component: PageLink, content: 'Straighten cheese', to: '' }
  ]
};

const banner = (
  <Banner title="Happiness" status="success">
    Wheeeee! Wonder bubble!
  </Banner>
);

const emptyProps = {
  show: true,
  image: Users,
  title: 'No sprockets here',
  content: (
    <p>
      Please consider making a new sprocket. They taste great and they're full
      of solid vitamins.
    </p>
  )
};

const onDelete = () => new Promise((resolve) => {
  setTimeout(() => {
    action('onDelete');
    resolve();
  }, 500);
});

storiesOf('ListPage', module)
  .addDecorator((getStory) => <StoryContainer>{getStory()}</StoryContainer>)
  .add('Loading', () => <ListPage {...baseProps} loading />)
  .add('Load failed', () => <ListPage {...baseProps} error={error} />)
  .add('With loaded items', () => <ListPage {...baseProps} items={items} />)
  .add('With Edit/Delete', () => (
    <ListPage
      {...baseProps}
      onEdit={action('onEdit')}
      onDelete={onDelete}
      items={items}
      renderDeleteWarning={renderDeleteWarning}
      renderRow={renderRowWithActions}
    />
  ))
  .add('Without items', () => <ListPage {...baseProps} empty={emptyProps} />)
  .add('With banner', () => (
    <ListPage {...baseProps} banner={banner} items={items} />
  ));
