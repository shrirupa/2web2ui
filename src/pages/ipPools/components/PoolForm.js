import React, { Component, Fragment } from 'react';
import { connect } from 'react-redux';
import { Field, reduxForm } from 'redux-form';
import { Link, withRouter } from 'react-router-dom';
import { Button, Panel, UnstyledLink } from '@sparkpost/matchbox';
import { SendingDomainTypeaheadWrapper, TextFieldWrapper } from 'src/components';
import AccessControl from 'src/components/auth/AccessControl';
import { required } from 'src/helpers/validation';
import { configFlag } from 'src/helpers/conditions/config';
import { selectIpPoolFormInitialValues, selectIpsForCurrentPool, shouldShowIpPurchaseCTA, selectCurrentPool } from 'src/selectors/ipPools';
import isDefaultPool from '../helpers/defaultPool';
import IpList from './IpList';

export class PoolForm extends Component {
  renderPoolIps = () => {
    const { isNew, ips, pool, showPurchaseCTA } = this.props;

    if (isNew) {
      return null;
    }

    const purchaseCTA = showPurchaseCTA
      ? <Fragment>, or by <UnstyledLink to="/account/billing" component={Link}>purchasing new
        IPs</UnstyledLink></Fragment>
      : null;


    return (<Panel title='Sending IPs'>
      <Panel.Section>
        <p>
          {!ips && <span>There are no IPs in this pool. </span>}
          Add dedicated IPs to this pool by moving them from their current pool{purchaseCTA}.
          {ips && <span> Click on existing Sending IP to modify.</span>}
        </p>
        {ips && <IpList ips={ips} pool={pool}/>}
      </Panel.Section>
    </Panel>);
  };

  render() {
    const { isNew, pool, handleSubmit, submitting, pristine } = this.props;
    const submitText = isNew ? 'Create IP Pool' : 'Update IP Pool';
    const editingDefault = !isNew && isDefaultPool(pool.id);
    const helpText = editingDefault ? 'You cannot change the default IP pool\'s name' : '';

    return (
      <Fragment>
        <Panel>
          <form onSubmit={handleSubmit}>
            <Panel.Section>
              <Field
                name='name'
                component={TextFieldWrapper}
                validate={required}
                label='Pool Name'
                placeholder='My IP Pool'
                disabled={editingDefault || submitting}
                helpText={helpText}
              />

              {!editingDefault &&
              <AccessControl condition={configFlag('featureFlags.allow_default_signing_domains_for_ip_pools')}>
                <Field
                  name="signing_domain"
                  component={SendingDomainTypeaheadWrapper}
                  label="Default Signing Domain"
                  disabled={submitting}
                />
              </AccessControl>
              }
            </Panel.Section>
            <Panel.Section>
              <Button submit primary disabled={submitting || pristine}>
                {submitting ? 'Saving' : submitText}
              </Button>
            </Panel.Section>
          </form>
        </Panel>
        {this.renderPoolIps()}
      </Fragment>
    );
  }
}

PoolForm.defaultProps = {
  ips: [],
  pool: {}
};

const mapStateToProps = (state, props) => ({
  pool: selectCurrentPool(state, props),
  ips: selectIpsForCurrentPool(state, props),
  initialValues: selectIpPoolFormInitialValues(state, props),
  showPurchaseCTA: shouldShowIpPurchaseCTA(state)
});

const formOptions = {
  form: 'poolForm',
  enableReinitialize: true
};

const PoolReduxForm = reduxForm(formOptions)(PoolForm);
export default withRouter(connect(mapStateToProps, {})(PoolReduxForm));
