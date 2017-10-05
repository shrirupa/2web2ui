import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';

import Layout from 'src/components/layout/Layout';
import { Page, EmptyState } from '@sparkpost/matchbox';
import TableCollection from 'src/components/collection/TableCollection';
import ApiErrorBanner from 'src/components/apiErrorBanner/ApiErrorBanner';

import { list as listSubaccounts } from 'src/actions/subaccounts';
import getRowData from './helpers/getRowData';

const columns = ['Name', 'ID', 'Status'];

const primaryAction = {
  content: 'Create Subaccount',
  Component: Link,
  to: '/account/subaccounts/create'
};

export class ListPage extends Component {
  componentDidMount() {
    this.props.listSubaccounts();
  }

  onReloadApiBanner = () => {
    this.props.listSubaccounts({ force: true }); // force a refresh
  };

  renderEmpty() {
    return (
      <EmptyState
        title="Get started with Subaccounts"
        action={{ content: 'Create a Subaccount' }}
        secondaryAction={{ content: 'Learn more', to: 'https://developers.sparkpost.com/api/subaccounts.html', target: '_blank' }}
      >
        <p>Subaccounts are a good way of managing external client accounts.</p>
      </EmptyState>
    );
  }

  renderCollection() {
    const { subaccounts } = this.props;

    return (
      <div>
        <Page title='Subaccounts' primaryAction={primaryAction}/>
        <TableCollection
          columns={columns}
          getRowData={getRowData}
          pagination={true}
          rows={subaccounts}
        />
      </div>
    );
  }

  renderError() {
    return (
      <ApiErrorBanner
        errorDetails={this.props.error.message}
        message="Sorry, we ran into an error loading your Subaccounts"
        reload={this.onReloadApiBanner}
      />
    );
  }

  render() {
    const { error, loading, subaccounts } = this.props;

    return (
      <Layout.App loading={loading}>
        { error && this.renderError() }
        { subaccounts.length
          ? this.renderCollection()
          : this.renderEmpty()
        }
      </Layout.App>
    );
  }
}

const mapStateToProps = ({ subaccounts }) => ({
  subaccounts: subaccounts.list,
  loading: subaccounts.listLoading,
  error: subaccounts.listError
});

export default connect(mapStateToProps, { listSubaccounts })(ListPage);
