import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';

import { Page, Panel, UnstyledLink } from '@sparkpost/matchbox';
import { ApiErrorBanner, DeleteModal, Loading } from 'src/components';
import PoolForm from './components/PoolForm';
import IpList from './components/IpList';

import { showAlert } from 'src/actions/globalAlert';
import { deletePool, listPools, updatePool } from 'src/actions/ipPools';
import { selectCurrentPool, selectIpsForCurrentPool, shouldShowIpPurchaseCTA } from 'src/selectors/ipPools';
import isDefaultPool from './helpers/defaultPool';
import { not } from 'src/helpers/conditions';
import { selectCondition } from 'src/selectors/accessConditionState';
import { isSelfServeBilling } from 'src/helpers/conditions/account';
import SupportTicketLink from 'src/components/supportTicketLink/SupportTicketLink';
import { openSupportTicketForm } from 'src/actions/support';

const breadcrumbAction = {
  content: 'IP Pools',
  Component: Link,
  to: '/account/ip-pools'
};

export class EditPage extends Component {
  state = {
    showDelete: false
  };

  toggleDelete = () => {
    this.setState({ showDelete: !this.state.showDelete });
  };

  onUpdatePool = (values) => {
    const { updatePool, showAlert, history, pool: { id }} = this.props;

    // if signing_domain is not set, then we want to clear it out to empty string.
    values.signing_domain = values.signing_domain || '';

    if (isDefaultPool(id)) {
      const message = 'You can not edit default pool.';
      showAlert({ type: 'error', message });

      return Promise.reject(new Error(message));
    }

    return updatePool(id, values)
      .then((res) => {
        showAlert({
          type: 'success',
          message: `Updated IP pool ${id}.`
        });
        history.replace(`/account/ip-pools/edit/${id}`);
      });
  };

  onDeletePool = () => {
    const { deletePool, showAlert, history, pool: { id }} = this.props;

    return deletePool(id).then(() => {
      showAlert({
        type: 'success',
        message: `Deleted IP pool ${id}.`
      });
      history.push('/account/ip-pools');
    });
  };

  loadDependentData = () => {
    this.props.listPools();
  };

  componentDidMount() {
    this.loadDependentData();
  }

  renderError() {
    const { listError } = this.props;
    return <ApiErrorBanner
      errorDetails={listError.message}
      message="Sorry, we seem to have had some trouble loading your IP pool."
      reload={this.loadDependentData}
    />;
  }

  renderForm() {
    const { error } = this.props;

    if (error) {
      return this.renderError();
    }

    return <PoolForm onSubmit={this.onUpdatePool} isNew={false} />;
  }

  renderIps() {
    const { isNew, ips, pool, showPurchaseCTA, isManuallyBilled } = this.props;

    if (isNew) {
      return null;
    }

    const purchaseCTA = showPurchaseCTA
      ? (isManuallyBilled
        ? <>, or by purchasing new IPs. Please <SupportTicketLink issueId='request_new_ip'>reach out to
        the support team</SupportTicketLink> for assistance adding a new IP</>
        : <>, or by <UnstyledLink to="/account/billing" component={Link}>purchasing new
        IPs</UnstyledLink></>
      ) : null;

    return (<Panel title='Sending IPs'>
      <Panel.Section>
        <p>
          {!ips && <span>There are no IPs in this pool. </span>}
          Add dedicated IPs to this pool by moving them from their current pool{purchaseCTA}.
          {ips && <span> Click on existing Sending IP to modify.</span>}
        </p>
      </Panel.Section>
      {ips && <IpList ips={ips} pool={pool}/>}
    </Panel>);
  }

  render() {
    const { loading, pool, showPurchaseCTA, isManuallyBilled, openSupportTicketForm } = this.props;

    if (loading) {
      return <Loading />;
    }

    return (
      <Page
        title={`${pool.name} (${pool.id})`}
        breadcrumbAction={breadcrumbAction}
        secondaryActions={
          [{
            content: 'Delete',
            onClick: this.toggleDelete,
            visible: !isDefaultPool(pool.id)
          },
          { content: 'Purchase IPs',
            to: '/account/billing',
            component: Link,
            visible: showPurchaseCTA && !isManuallyBilled
          },
          { content: 'Request IPs',
            onClick: () => openSupportTicketForm({ issueId: 'request_new_ip' }),
            visible: showPurchaseCTA && isManuallyBilled
          }]
        }>

        {this.renderForm()}
        {this.renderIps()}

        <DeleteModal
          open={this.state.showDelete}
          title='Are you sure you want to delete this IP Pool?'
          content={<p>IPs in this pool will be re-assigned to your Default pool.</p>}
          onCancel={this.toggleDelete}
          onDelete={this.onDeletePool}
        />
      </Page>
    );
  }
}

const mapStateToProps = (state, props) => {
  const { listLoading, listError } = state.ipPools;

  return {
    loading: listLoading,
    error: listError,
    pool: selectCurrentPool(state, props),
    ips: selectIpsForCurrentPool(state, props),
    listError,
    isManuallyBilled: selectCondition(not(isSelfServeBilling))(state),
    showPurchaseCTA: shouldShowIpPurchaseCTA(state)
  };
};

export default connect(mapStateToProps, { updatePool, deletePool, listPools, showAlert, openSupportTicketForm })(EditPage);
