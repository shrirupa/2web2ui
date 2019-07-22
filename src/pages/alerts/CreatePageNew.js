import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { Page } from '@sparkpost/matchbox';
import withAlertsCreate from './containers/CreatePageNew.container';
import AlertFormNew from './components/AlertFormNew';
import { formatFormValues } from './helpers/formatFormData';
import { Loading } from 'src/components';
import { RedirectAndAlert } from 'src/components/globalAlert';

export class CreatePageNew extends Component {

  componentDidMount() {
    const { getAlert, duplicateId } = this.props;
    if (duplicateId) {
      getAlert({ id: duplicateId });
    }
  }

  /*
    Passed as onSubmit to AlertForm. Figures out what updates need to be passed
    to the createAlert action.
  */
  handleCreate = (values) => {
    const { createAlert, showUIAlert, history } = this.props;
    return createAlert({
      data: formatFormValues(values)
    }).then(() => {
      showUIAlert({ type: 'success', message: 'Alert created' });
      history.push('/alerts-new');
    });
  };

  render() {
    const { loading, getError, getLoading, duplicateId } = this.props;

    if (getLoading) {
      return <Loading/>;
    }

    if (getError) {
      return (
        <RedirectAndAlert
          to='/alerts-new'
          alert={{ type: 'error', message: getError.message }}
        />
      );
    }

    return (
      <Page
        title='Create Alert'
        breadcrumbAction={{ content: 'Back to Alerts', to: '/alerts-new', component: Link }}>
        <AlertFormNew submitting={loading} onSubmit={this.handleCreate} isDuplicate={Boolean(duplicateId)}/>
      </Page>
    );
  }
}

export default withAlertsCreate(CreatePageNew);
