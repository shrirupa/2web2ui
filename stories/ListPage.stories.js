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

const formatRow = (item) => [item.name, item.diam];
const formatRowWithActions = (item) => ({
  fields: [item.name, item.diam],
  actions: {
    editRoute: `/account/sprocket/${slugify(item.name)}`,
    deletable: item.name !== 'm3 bolt'
  }
});

const deleteWarning = ({ name }) => <p>This lovely {name} will no longer be usable.</p>;

const baseProps = {
  noun,
  loadItems: action('loadItems'),
  columns,
  onCreate: action('onCreate'),
  filterBox,
  formatRow,
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

storiesOf('ListPage', module)
  .addDecorator((getStory) => <StoryContainer>{getStory()}</StoryContainer>)
  .add('Loading', () => <ListPage {...baseProps} loading />)
  .add('Load failed', () => <ListPage {...baseProps} error={error} />)
  .add('With loaded items', () => <ListPage {...baseProps} items={items} />)
  .add('With Edit/Delete', () => (
    <ListPage
      {...baseProps}
      onEdit={action('onEdit')}
      onDelete={action('onDelete')}
      items={items}
      deleteWarning={deleteWarning}
      formatRow={formatRowWithActions}
    />
  ))
  .add('Without items', () => <ListPage {...baseProps} empty={emptyProps} />)
  .add('With banner', () => (
    <ListPage {...baseProps} banner={banner} items={items} />
  ));
