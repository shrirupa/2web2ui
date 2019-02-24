import React from 'react';
import { Link } from 'react-router-dom';
import { SubaccountTag, TableCollection, ApiErrorBanner, Loading } from 'src/components';
import { Templates } from 'src/components/images';
import { Page } from '@sparkpost/matchbox';
import { Name, Status, Actions, LastUpdated } from './components/ListComponents';
import { resolveTemplateStatus } from 'src/helpers/templates';

import useSparkpostApiRequest from 'src/actions/helpers/useSparkpostApiRequest';

function ListPage(props) {
  const { canModify, hasSubaccounts } = props;

  const { pending, results = [], retry, error } = useSparkpostApiRequest({
    method: 'GET',
    url: '/v1/templates'
  });

  if (pending) {
    return <Loading />;
  }

  const primaryAction = canModify ? {
    content: 'Create Template',
    to: '/templates/create',
    Component: Link
  } : null;

  return (
    <Page
      primaryAction={primaryAction}
      title='Templates'
      empty={{
        show: !error && results.length === 0,
        image: Templates,
        title: 'Manage your email templates',
        content: <p>Build, test, preview and send your transmissions.</p>
      }} >
      {error
        ? <ErrorBanner error={error} retry={retry} />
        : <Collection templates={results} hasSubaccounts={hasSubaccounts} />
      }
    </Page>
  );
}

function Collection({ templates, hasSubaccounts }) {
  const columns = [
    { label: 'Name', width: '28%', sortKey: 'name' },
    { label: 'Status', width: '18%', sortKey: (template) => [resolveTemplateStatus(template).publishedWithChanges, template.published]},
    ...(hasSubaccounts ? [{
      label: 'Subaccount', width: '18%', sortKey: (template) => [template.subaccount_id, template.shared_with_subaccounts]
    }] : []),
    { label: 'Last Updated', sortKey: 'last_update_time' },
    null
  ];

  const getRowData = ({ shared_with_subaccounts, ...rowData }) => {
    const { subaccount_id } = rowData;

    const subaccountCell = subaccount_id || shared_with_subaccounts
      ? <SubaccountTag all={shared_with_subaccounts} id={subaccount_id} />
      : null;

    return [
      <Name {...rowData} />,
      <Status {...rowData} />,
      ...(hasSubaccounts ? [subaccountCell] : []),
      <LastUpdated {...rowData}/>,
      <Actions {...rowData} />
    ];
  };

  return (
    <TableCollection
      columns={columns}
      rows={templates}
      getRowData={getRowData}
      pagination
      filterBox={{
        show: true,
        exampleModifiers: ['id', 'name'],
        itemToStringKeys: ['name', 'id', 'subaccount_id']
      }}
      defaultSortColumn='name'
    />
  );
}

function ErrorBanner({ error, retry }) {
  return (
    <ApiErrorBanner
      message={'Sorry, we seem to have had some trouble loading your templates.'}
      errorDetails={error.message}
      reload={retry}
    />
  );
}

export default ListPage;
