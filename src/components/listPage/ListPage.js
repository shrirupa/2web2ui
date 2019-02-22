/* eslint-max-lines: ["error": 180] */
import React from 'react';

import { Page } from '@sparkpost/matchbox';
import {
  Loading,
  ApiErrorBanner,
  TableCollection,
  DeleteModal
} from 'src/components';
import { capitalize } from 'src/helpers/string';

import Actions from './Actions';
import ListPagePropTypes from './ListPage.propTypes';

const DEFAULT_STATE = {
  itemToDelete: null
};

class ListPage extends React.Component {
  state = DEFAULT_STATE;

  componentDidMount() {
    this.props.loadItems();
  }

  handleCancel = () => {
    this.setState(DEFAULT_STATE);
  };

  handleDelete = () => {
    const { onDelete } = this.props;
    const { itemToDelete } = this.state;

    this.setState(DEFAULT_STATE, () => {
      onDelete(itemToDelete);
    });
  };

  showDeleteModal = (item) => {
    this.setState({ itemToDelete: item });
  };

  renderError() {
    const { loadItems, error, noun } = this.props;
    return (
      <ApiErrorBanner
        errorDetails={error.message}
        message={`Sorry, we seem to have had some trouble loading your ${noun.toLowerCase()}s .`}
        reload={loadItems}
      />
    );
  }

  formatRowWithActions = (row) => {
    const { formatRow } = this.props;
    const formatted = formatRow(row);
    const fields = formatted.fields || formatted;
    const actions = formatted.actions || {};
    return [
      ...fields,
      <Actions
        item={row}
        editRoute={actions.editRoute}
        deletable={actions.deletable}
        onDelete={this.showDeleteModal}
        customActions={actions.customActions}
      />
    ];
  };

  renderItems() {
    const {
      columns,
      items,
      filterBox,
      defaultSortColumn
    } = this.props;
    const filterBoxOptions = filterBox ? { show: true, ...filterBox } : { show: false };
    return (
      <TableCollection
        columns={columns}
        getRowData={this.formatRowWithActions}
        pagination={true}
        rows={items}
        filterBox={filterBoxOptions}
        defaultSortColumn={defaultSortColumn || columns[0]}
      />
    );
  }

  renderDeleteWarning() {
    const { itemToDelete } = this.state;
    const { renderDeleteWarning } = this.props;

    if (!itemToDelete) {
      return null;
    }

    if (!renderDeleteWarning) {
      return null;
    }

    return renderDeleteWarning(itemToDelete);
  }

  render() {
    const { itemToDelete } = this.state;
    const {
      noun,
      primaryActionTitle,
      onCreate,
      loading,
      error,
      banner,
      empty,
      additionalActions
    } = this.props;
    const capsNoun = capitalize(noun);
    const primaryAction = onCreate && {
      content: primaryActionTitle || `Create ${capsNoun}`,
      onClick: onCreate
    };

    if (loading) {
      return <Loading />;
    }

    const modalContent = this.renderDeleteWarning();

    return (
      <Page
        title={`${capsNoun}s`}
        primaryAction={primaryAction}
        secondaryActions={additionalActions}
        empty={empty}
      >
        {banner}
        {error ? this.renderError() : this.renderItems()}
        <DeleteModal
          open={Boolean(itemToDelete)}
          onCancel={this.handleCancel}
          onDelete={this.handleDelete}
          title={`Are you sure you want to delete this ${noun}?`}
          content={modalContent}
        />
      </Page>
    );
  }
}

ListPage.propTypes = ListPagePropTypes;
ListPage.defaultProps = {
  items: []
};

export default ListPage;
