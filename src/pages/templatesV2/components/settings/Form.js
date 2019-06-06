import React from 'react';
import { Field, reduxForm } from 'redux-form';
import _ from 'lodash';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';

import { Button, Panel } from '@sparkpost/matchbox';
import FromEmailWrapper from '../../../templates/components/FromEmailWrapper';
import { TextFieldWrapper } from '../../../../components';
import ToggleBlock from '../../../../components/toggleBlock/ToggleBlock';
import { required } from '../../../../helpers/validation';
import SubaccountSection from 'src/components/subaccountSection';
import styles from './Form.module.scss';

const FORM_NAME = 'templateSetting';

const SettingsForm = (props) => {
  const readOnly = false;
  const newTemplate = false;
  const domains = [];
  const emailOrSubstitution = _.noop;
  const domainsLoading = false;
  const subaccountId = true;

  const fromEmailHelpText = !domainsLoading && !domains.length ? (subaccountId ? 'The selected subaccount does not have any verified sending domains.' : 'You do not have any verified sending domains to use.') : null;

  return (<>
    <Panel.Section>
      <Field
        name='name'
        component={TextFieldWrapper}
        label='Template Name'
        disabled={readOnly}
        validate={required}
      />

      <Field
        name='id'
        component={TextFieldWrapper}
        label='Template ID'
        disabled={true}
      />

    </Panel.Section>

    <SubaccountSection newTemplate={newTemplate} disabled={readOnly}/>

    <Panel.Section>
      <Field
        name='content.subject'
        component={TextFieldWrapper}
        label='Subject'
        disabled={readOnly}
        validate={required}
      />

      <Field
        name='content.from.email'
        component={FromEmailWrapper}
        placeholder='example@email.com'
        label='From Email'
        disabled={readOnly}
        validate={[required, emailOrSubstitution]}
        domains={domains}
        helpText={fromEmailHelpText}
      />

      <Field
        name='content.from.name'
        component={TextFieldWrapper}
        label='From Name'
        helpText='A friendly from for your recipients.'
        disabled={readOnly}
      />

      <Field
        name='content.reply_to'
        component={TextFieldWrapper}
        label='Reply To'
        helpText='An email address recipients can reply to.'
        disabled={readOnly}
        validate={emailOrSubstitution}
      />

      <Field
        name='description'
        component={TextFieldWrapper}
        label='Description'
        helpText='Not visible to recipients.'
        disabled={readOnly}
      />
    </Panel.Section>
    <Panel.Section>
      <Field
        name='options.open_tracking'
        component={ToggleBlock}
        label='Track Opens'
        type='checkbox'
        // parse={this.parseToggle}
        disabled={readOnly}
      />

      <Field
        name='options.click_tracking'
        component={ToggleBlock}
        label='Track Clicks'
        type='checkbox'
        // parse={this.parseToggle}
        disabled={readOnly}
      />
      <Field
        name='options.transactional'
        component={ToggleBlock}
        label='Transactional'
        type='checkbox'
        // parse={this.parseToggle}
        helpText={<p className={styles.HelpText}>Transactional messages are triggered by a user’s actions on the
          website, like requesting a password reset, signing up, or making a purchase.</p>}
        disabled={readOnly}
      />
    </Panel.Section>
    <Panel.Section>
      <Button
        // disabled={isDraftUpdating}
        // onClick={() => { updateDraft({ id: draft.id, content }, draft.subaccount_id); }}
        primary
      >
        Update Settings
      </Button>
      <Button
        // disabled={isDraftUpdating}
        // onClick={() => { updateDraft({ id: draft.id, content }, draft.subaccount_id); }}
        secondary
      >
        Delete Template
      </Button>

    </Panel.Section>
  </>);
};


const formOptions = {
  form: FORM_NAME,
  enableReinitialize: true // required to update initial values from redux state
};
export default withRouter(connect(null, {})(reduxForm(formOptions)(SettingsForm)));
