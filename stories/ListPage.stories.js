import React from 'react';
import { storiesOf } from '@storybook/react';
import { action } from '@storybook/addon-actions';

import propTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { Page, Banner } from '@sparkpost/matchbox';
import { Loading, ApiErrorBanner, TableCollection, PageLink } from 'src/components';
import { Users } from 'src/components/images';
import { capitalize } from 'src/helpers/string';

import StoryContainer from './StoryContainer';

class ListPage extends React.Component {
  componentDidMount() {
    this.props.loadItems();
  }

  renderError() {
    const { loadItems, error, noun } = this.props;
    return <ApiErrorBanner
      errorDetails={error.message}
      message={`Sorry, we seem to have had some trouble loading your ${noun.toLowerCase()}s .`}
      reload={loadItems}
    />;
  }

  renderItems() {
    const { columns, items, formatRow, filterBox, defaultSortColumn } = this.props;
    return <TableCollection
      columns={columns}
      getRowData={formatRow}
      pagination={true}
      rows={items}
      filterBox={filterBox}
      defaultSortColumn={defaultSortColumn || columns[0]}
    />;
  }

  render() {
    const { noun, slug, loading, error, banner, empty, otherActions } = this.props;
    const capsNoun = capitalize(noun);
    const primaryAction = {
      content: `Create ${capsNoun}`,
      Component: Link,
      to: `/account/${slug}/create`
    };

    if (loading) {
      return <Loading />;
    }

    const emptyProps = empty
      ? { show: true, ...empty }
      : {};

    return <Page
      title={capsNoun}
      primaryAction={primaryAction}
      secondaryActions={otherActions}
      empty={emptyProps}
    >
      {banner}
      {error ? this.renderError() : this.renderItems()}
    </Page>;
  }
}

ListPage.propTypes = {
  noun: propTypes.string.isRequired,
  slug: propTypes.string.isRequired,
  loadItems: propTypes.func.isRequired,
  loading: propTypes.bool,
  error: propTypes.shape({
    message: propTypes.string
  }),
  items: propTypes.arrayOf(propTypes.object),
  columns: propTypes.arrayOf(propTypes.object).isRequired,
  defaultSortColumn: propTypes.string,
  formatRow: propTypes.func,
  filterBox: propTypes.object, // TODO: reference FilterBox propTypes
  banner: propTypes.element,
  empty: propTypes.shape({
    title: propTypes.string,
    image: propTypes.shape(),
    content: propTypes.element,
    secondaryAction: propTypes.shape({
      Component: propTypes.element,
      content: propTypes.string,
      to: propTypes.string
    })
  }),
  otherActions: propTypes.arrayOf(propTypes.object)
};

// --------------

const baseProps = {
  noun: 'sprocket',
  slug: 'sprocket',
  loadItems: action('loadItems'),
  columns: [ { label: 'Name', sortKey: 'name' }, { label: 'Diameter', sortKey: 'diam' }],
  filterBox: {
    show: true,
    keyMap: { role: 'access' },
    exampleModifiers: ['name', 'diam'],
    itemToStringKeys: ['diam']
  },
  formatRow: (item) => [item.name, item.diam],
  otherActions: [
    { Component: PageLink, content: 'Do a less obvious thing here', to: '' },
    { Component: PageLink, content: 'Straighten cheese', to: '' }
  ]
};

const items = [
  { name: 'm3 bolt', diam: 3, scale: 'metric' },
  { name: 'm3 nut', diam: 3, scale: 'metric' },
  { name: '16mm wingnut', diam: 16, scale: 'metric' },
  { name: '22mm wingnut', diam: 22, scale: 'metric' },
  { name: '1/8" wingnut', diam: 3, scale: 'imperial' },
  { name: '3/8" wingnut', diam: 9, scale: 'imperial' },
  { name: '5/8" wingnut', diam: 15, scale: 'imperial' },
  { name: '7/8" wingnut', diam: 18, scale: 'imperial' },
  { name: '1 1/8" wingnut', diam: 21, scale: 'imperial' },
  { name: '1 3/8" wingnut', diam: 30, scale: 'imperial' },
  { name: '1 5/8" wingnut', diam: 36, scale: 'imperial' }
];

const error = { message: 'Workshop closed' };

const banner = <Banner title='Happiness' status='success'>Wheeeee! Wonder bubble!</Banner>;

const emptyProps = {
  image: Users,
  title: 'No sprockets here',
  content: <p>Please consider making a new sprocket. They taste great and they're full of solid vitamins.</p>
};

storiesOf('ListPage', module)
  .addDecorator((getStory) => (
    <StoryContainer>{getStory()}</StoryContainer>
  ))
  .add('Loading', () => <ListPage loading {...baseProps} />)
  .add('Load failed', () => <ListPage error={error} {...baseProps} />)
  .add('With loaded items', () => <ListPage items={items} {...baseProps} />)
  .add('Without items', () => <ListPage empty={emptyProps} {...baseProps} />)
  .add('With banner', () => <ListPage banner={banner} items={items} {...baseProps} />);
