import React from 'react';

import { Page } from '@sparkpost/matchbox';
import { Loading } from 'src/components';
import { capitalize } from 'src/helpers/string';

import ErrorBanner from './ErrorBanner';
import Table from './Table';
import Actions from './Actions';
import Modal from './Modal';

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

    onDelete(itemToDelete).then(() => {
      this.setState(DEFAULT_STATE);
    });
  };

  showDeleteModal = (item) => {
    this.setState({ itemToDelete: item });
  };

  render() {
    const { itemToDelete } = this.state;
    const {
      columns,
      items,
      filterBox,
      defaultSortColumn,
      loadItems,
      noun,
      primaryAction,
      loading,
      error,
      empty,
      additionalActions,
      children
    } = this.props;
    const capsNoun = capitalize(noun);
    const primaryActionProp = {
      content: `Create ${capsNoun}`,
      ...primaryAction
    };

    if (loading) {
      return <Loading />;
    }

    return (
      <Page
        title={`${capsNoun}s`}
        primaryAction={primaryActionProp}
        secondaryActions={additionalActions}
        empty={empty}
      >
        {children({
          tableProps: {
            columns,
            items,
            filterBox,
            defaultSortColumn,
            actionProps: {
              onDelete: this.showDeleteModal
            }
          },
          modalProps: {
            open: Boolean(itemToDelete),
            onCancel: this.handleCancel,
            onDelete: this.handleDelete,
            noun,
            item: itemToDelete
          },
          errorProps: { error, loadItems, noun }
        })}
      </Page>
    );
  }
}

ListPage.ErrorBanner = ErrorBanner;
ListPage.Table = Table;
ListPage.Modal = Modal;
ListPage.Actions = Actions;

ListPage.propTypes = ListPagePropTypes;
ListPage.defaultProps = {
  items: [],
  children: ({ tableProps, modalProps, errorProps }) => (
    <>
      <ErrorBanner {...errorProps} />
      <Table {...tableProps} />
      <Modal {...modalProps} />
    </>
  )
};

export default ListPage;
