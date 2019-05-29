/* eslint max-lines: ["error", 300] */
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Field, reduxForm, Form, formValueSelector } from 'redux-form';

// Components
import { Panel, Grid, Button } from '@sparkpost/matchbox';
import { withRouter } from 'react-router-dom';
import ToggleBlock from 'src/components/toggleBlock/ToggleBlock';
import { TextFieldWrapper, SelectWrapper, RadioGroup, SubaccountTypeaheadWrapper } from 'src/components';
import { formatEditValues, selectIpPools } from 'src/selectors/alerts';
import getOptions from '../helpers/getOptions';
import { METRICS } from '../constants/metrics';
import { FACETS } from '../constants/facets';
import { COMPARATOR } from '../constants/comparator';
import { defaultFormValues } from '../constants/defaultFormValues';
import { listPools } from 'src/actions/ipPools';
import MultiFacetWrapper from './MultiFacetWrapper';
import { MAILBOX_PROVIDERS } from 'src/constants';
import _ from 'lodash';

// Helpers & Validation
import { domain, required, integer, maxLength, numberBetween } from 'src/helpers/validation';
import validateEmailList from '../helpers/validateEmailList';

const formName = 'alertForm';

const accountOptions = [
  { label: 'Master and all subaccounts', value: 'all' },
  { label: 'Master account only', value: 'master' },
  { label: 'Single Subaccount', value: 'subaccount' }
];

export class AlertForm extends Component {

  componentDidMount() {
    this.props.listPools();
  }

  componentDidUpdate(prevProps) {
    const { facet_name, change } = this.props;
    if (prevProps.facet_name && prevProps.facet_name !== facet_name) {
      change('facet_value', '');
    }
  }

  validateFacet = (value, allValues) => {
    const { facet_name } = allValues;
    const { ipPools } = this.props;

    if (facet_name === 'ALL') {
      return undefined;
    }

    if (facet_name === 'sending_domain' && value && value !== '') {
      return domain(value);
    }

    if (facet_name === 'ip_pool' && value && value !== '') {
      const ipPoolsArray = ipPools.map(({ id }) => id) || [];
      return ipPoolsArray.includes(value) ? undefined : 'This is not a valid ip pool for this account';
    }

    return required(value);
  };

  render() {
    const {
      pristine,
      submitting,
      assignTo,
      alert_metric = '',
      facet_name,
      handleSubmit,
      newAlert,
      ipPools = [],
      ipPoolsLoading
    } = this.props;

    const submitText = submitting ? 'Submitting...' : (newAlert ? 'Create Alert' : 'Update Alert');
    const isSignals = alert_metric.startsWith('signals_');
    const isInteger = ['monthly_sending_limit', 'signals_health_dod', 'signals_health_wow'].includes(alert_metric);
    const isThreshold = (alert_metric === 'monthly_sending_limit' || alert_metric === 'signals_health_threshold');
    const getTargetValidation = () => {
      const validators = [required];
      if (isInteger) {
        validators.push(integer);
      }
      if (isThreshold) {
        validators.push(numberBetween(0, 100));
      }
      return validators;
    };

    const checkFacet = () => {
      if (facet_name === 'ALL') {
        return true;
      }
      return false;
    };

    const multiFacetWarning = () => {
      if (facet_name === 'ip_pool' && !ipPoolsLoading && !ipPools.length) {
        return 'You do not have any ip pools to use.';
      }

      return null;
    };

    const getPrefix = () => {
      switch (alert_metric) {
        case 'signals_health_threshold': return '';
        case 'monthly_sending_limit': return 'Above';
        case 'signals_health_dod':
        case 'signals_health_wow': return 'Percent Change Above';
      }
    };

    const negPercentNormalizer = (value, previousValue, values) => {
      if ((values.alert_metric === 'signals_health_dod') || (values.alert_metric === 'signals_health_wow')) {
        return (value < 0) ? value * (-1) : value;
      } else {
        return value;
      }
    };

    return (
      <Form onSubmit={handleSubmit}>
        <Panel>
          <Panel.Section>
            <Field
              name='name'
              label='Name'
              component={TextFieldWrapper}
              disabled={submitting}
              validate={[required, maxLength(24)]}
            />
            <Field
              name='alert_metric'
              label='Alert Type'
              component={SelectWrapper}
              options={getOptions(METRICS)}
              disabled={!newAlert}
              validate={required}
              helpText={'This assignment is permanent.'}
            />
            {isSignals &&
            <Field
              component={RadioGroup}
              label='Account'
              name='assignTo'
              options={accountOptions}
            />}
            {isSignals && assignTo === 'subaccount' &&
            <Field
              name='subaccount'
              component={SubaccountTypeaheadWrapper}
              disabled={submitting}
              validate={required}
            />}
            {isSignals && assignTo !== 'all' &&
            <label>Facet</label>}
            {isSignals && assignTo !== 'all' &&
            <Grid>
              <Grid.Column sm={8} md={7} lg={5}>
                <div>
                  <Field
                    name='facet_value'
                    connectLeft= {
                      <Field
                        name='facet_name'
                        component={SelectWrapper}
                        options={getOptions(FACETS)}
                        disabled={submitting}
                        validate={required}
                      />
                    }
                    component={(facet_name === 'ip_pool' || facet_name === 'mb_provider') ? MultiFacetWrapper : TextFieldWrapper}
                    items={facet_name === 'ip_pool' ? _.map(ipPools, 'id') : facet_name === 'mb_provider' ? _.keys(MAILBOX_PROVIDERS) : null}
                    facetname={facet_name}
                    disabled={submitting || checkFacet()}
                    placeholder={facet_name === 'ALL' ? 'No facet selected' : facet_name === 'sending_domain' ? 'mail.example.com' : ''}
                    validate={this.validateFacet}
                    helpText={multiFacetWarning()}
                  />
                </div>
              </Grid.Column>
            </Grid>}
            {isSignals && assignTo !== 'all' && <br/>}
            <label>Criteria</label>
            <Grid>
              <Grid.Column sm={8} md={7} lg={5}>
                <div>
                  <Field
                    name='threshold.error.target'
                    component={TextFieldWrapper}
                    connectLeft={
                      alert_metric === 'signals_health_threshold' && <Field
                        name='threshold.error.comparator'
                        component={SelectWrapper}
                        options={getOptions(COMPARATOR)}
                        disabled={submitting}
                        validate={required}
                      />
                    }
                    disabled={submitting}
                    prefix={getPrefix()}
                    normalize={negPercentNormalizer}
                    suffix={(isSignals && isThreshold) ? '' : '%'}
                    validate={getTargetValidation()}
                    style={{
                      textAlign: 'right'
                    }}
                  />
                </div>
              </Grid.Column>
            </Grid>
            <br/>
            <Field
              name='email_addresses'
              label='Email Addresses to Notify'
              component={TextFieldWrapper}
              disabled={submitting}
              validate={[required, validateEmailList]}
              multiline
            />
            {!newAlert && <Grid>
              <Grid.Column xs={1} md={1}>
                <label>Enabled</label>
              </Grid.Column>
              <Grid.Column xs={1} md={1}>
                <div>
                  <Field
                    name='enabled'
                    type='checkbox'
                    component={ToggleBlock}
                    parse={this.parseToggle}
                    disabled={submitting}
                  />
                </div>
              </Grid.Column>
            </Grid>}
            <br/>
            <Button submit primary disabled={pristine || submitting}>{submitText}</Button>
          </Panel.Section>
        </Panel>
      </Form>
    );
  }
}
const mapStateToProps = (state, props) => {
  const selector = formValueSelector(formName);

  return {
    ipPools: selectIpPools(state, formName),
    ipPoolsLoading: state.ipPools.listLoading,
    alert_metric: selector(state, 'alert_metric'),
    facet_name: selector(state, 'facet_name'),
    facet_value: selector(state, 'facet_value'),
    assignTo: selector(state, 'assignTo'),
    enabled: selector(state, 'enabled'),
    initialValues: props.newAlert ? defaultFormValues : formatEditValues(state, state.alerts.alert)
  };
};

const formOptions = {
  form: formName,
  enableReinitialize: true
};

export default withRouter(connect(mapStateToProps, { listPools })(reduxForm(formOptions)(AlertForm)));