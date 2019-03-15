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

const onEdit = action('onEdit');

const onDelete = () =>
  new Promise(resolve => {
    setTimeout(() => {
      action('onDelete');
      resolve();
    }, 500);
  });

const baseProps = {
  noun,
  primaryAction: { to: '/sprocket/new' },
  loadItems: action('loadItems'),
  columns,
  filterBox,
  onEdit,
  onDelete,
  additionalActions: [
    { Component: PageLink, content: 'Do a less obvious thing here', to: '' },
    { Component: PageLink, content: 'Straighten cheese', to: '' }
  ]
};

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

const mkEditRoute = name => `/account/sprocket/${slugify(name)}`;
const mkDeletable = name => name !== 'm3 bolt';

storiesOf('ListPage', module)
  .addDecorator(getStory => <StoryContainer>{getStory()}</StoryContainer>)
  .add('State: Loading', () => <ListPage {...baseProps} loading />)
  .add('State: Load failed', () => <ListPage {...baseProps} error={error} />)
  .add('State: Without items', () => (
    <ListPage {...baseProps} empty={emptyProps} />
  ))
  .add('State: With loaded items', () => (
    <ListPage {...baseProps} items={items} />
  ))
  .add('Render: With custom rows', () => (
    <ListPage {...baseProps} items={items}>
      {({ errorProps, tableProps }) => (
        <>
          <ListPage.ErrorBanner {...errorProps} />
          <ListPage.Table {...tableProps}>
            {({ row: { name, diam } }) => [name.toUpperCase(), diam]}
          </ListPage.Table>
        </>
      )}
    </ListPage>
  ))
  .add('Render: With custom page elements', () => (
    <ListPage {...baseProps} items={items}>
      {({ tableProps, errorProps }) => (
        <>
          <Banner title="Happiness" status="success">
            Wheeeee! Wonder bubble!
          </Banner>
          <ListPage.ErrorBanner {...errorProps} />
          <ListPage.Table {...tableProps} />
          <footer>I am at the bottom</footer>
        </>
      )}
    </ListPage>
  ))
  .add('Actions: With Edit/Delete', () => (
    <ListPage {...baseProps} items={items}>
      {({ errorProps, tableProps, modalProps }) => (
        <>
          <ListPage.ErrorBanner {...errorProps} />
          <ListPage.Table {...tableProps}>
            {({ row, actionProps }) => [
              row.name,
              row.diam,
              <ListPage.Actions
                {...actionProps}
                editRoute={mkEditRoute(name)}
                deletable={mkDeletable(name)}
              />
            ]}
          </ListPage.Table>
          <ListPage.Modal {...modalProps} />
        </>
      )}
    </ListPage>
  ))
  .add('Actions: with custom item actions', () => (
    <ListPage {...baseProps} items={items}>
      {({ errorProps, tableProps, modalProps }) => (
        <>
          <ListPage.ErrorBanner {...errorProps} />
          <ListPage.Table {...tableProps}>
            {({ row, actionProps }) => [
              row.name,
              row.diam,
              <ListPage.Actions
                {...actionProps}
                editRoute={mkEditRoute(name)}
                deletable={mkDeletable(name)}
                customActions={[
                  row.diam < 10 && {
                    content: 'Frobnicate',
                    onClick: () => action('frobnicate')
                  }
                ]}
              />
            ]}
          </ListPage.Table>
          <ListPage.Modal {...modalProps} />
        </>
      )}
    </ListPage>
  ))
  .add('Render: With custom delete warning', () => (
    <ListPage {...baseProps} items={items}>
      {({ errorProps, tableProps, modalProps }) => (
        <>
          <ListPage.ErrorBanner {...errorProps} />
          <ListPage.Table {...tableProps}>
          {({row, actionProps}) => [
            row.name,
            row.diam,
            <ListPage.Actions {...actionProps} deletable={true} />
          ]}
          </ListPage.Table>
          <ListPage.Modal {...modalProps}>
            {({ noun, item }) => (
              <p>
                This lovely '{item.name}'' {noun} will no longer be usable.
              </p>
            )}
          </ListPage.Modal>
        </>
      )}
    </ListPage>
  ));
