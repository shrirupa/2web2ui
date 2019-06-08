import React from 'react';
import { Field, reduxForm } from 'redux-form';

import { Button, Panel } from '@sparkpost/matchbox';
import ToggleBlock from 'src/components/toggleBlock/ToggleBlock';
import SubaccountSection from 'src/components/subaccountSection';
import { TextFieldWrapper } from 'src/components';
import FromEmailWrapper from '../FromEmailWrapper';
import { required } from 'src/helpers/validation';
import styles from './Form.module.scss';
import { emailOrSubstitution } from '../validation';
import { isSubaccountUser } from 'src/helpers/conditions/user';
import { hasSubaccounts } from 'src/selectors/subaccounts';
import { not } from '../../../../helpers/conditions';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { update as updateTemplate } from 'src/actions/templates';
import { selectDomainsBySubaccount } from 'src/selectors/templates';
import { selectCondition } from 'src/selectors/accessConditionState';
import { showAlert } from 'src/actions/globalAlert';

const formName = 'templateSettings';

export class SettingsForm extends React.Component {
  updateSettings = (values) => {
    const { draft, updateDraft, subaccountId, showAlert } = this.props;

    return updateDraft({ id: draft.id, ...values }, subaccountId)
      .then(() => {
        showAlert({ type: 'success', message: 'Template settings updated' }); //todo change to top header feedback
      });
  };

  parseToggle = (value) => !!value;

  render() {
    const { handleSubmit, domainsLoading, domains, subaccountId, submitting, hasSubaccounts, canViewSubaccount } = this.props;

    const canViewSubaccountSection = hasSubaccounts && canViewSubaccount;

    const fromEmailHelpText = !domainsLoading && !domains.length ? (subaccountId ? 'The selected subaccount does not have any verified sending domains.' : 'You do not have any verified sending domains to use.') : null;

    return (<>
      <form name={formName} onSubmit={handleSubmit(this.updateSettings)}>
        <Panel.Section>
          <Field
            name='name'
            component={TextFieldWrapper}
            label='Template Name'
            // onChange={this.handleIdFill}
            disabled={submitting}
            validate={required}
          />

          <Field
            name='id'
            component={TextFieldWrapper}
            label='Template ID'
            helpText={'A Unique ID for your template, we\'ll fill this in for you.'}
            disabled={true}
          />
        </Panel.Section>

        {canViewSubaccountSection && <SubaccountSection newTemplate={false} disabled={submitting}/>}

        <Panel.Section>
          <Field
            name='content.subject'
            component={TextFieldWrapper}
            label='Subject'
            validate={required}
            disabled={submitting}
          />

          <Field
            name='content.from.email'
            component={FromEmailWrapper}
            placeholder='example@email.com'
            label='From Email'
            validate={[required, emailOrSubstitution]}
            domains={domains}
            helpText={fromEmailHelpText}
            disabled={submitting}
          />

          <Field
            name='content.from.name'
            component={TextFieldWrapper}
            label='From Name'
            helpText='A friendly from for your recipients.'
          />

          <Field
            name='content.reply_to'
            component={TextFieldWrapper}
            label='Reply To'
            helpText='An email address recipients can reply to.'
            validate={emailOrSubstitution}
            disabled={submitting}
          />

          <Field
            name='description'
            component={TextFieldWrapper}
            label='Description'
            helpText='Not visible to recipients.'
            disabled={submitting}
          />
        </Panel.Section>
        <Panel.Section>
          <Field
            name='options.open_tracking'
            component={ToggleBlock}
            label='Track Opens'
            type='checkbox'
            parse={this.parseToggle}
            disabled={submitting}

          />

          <Field
            name='options.click_tracking'
            component={ToggleBlock}
            label='Track Clicks'
            type='checkbox'
            parse={this.parseToggle}
            disabled={submitting}

          />
          <Field
            name='options.transactional'
            component={ToggleBlock}
            label='Transactional'
            type='checkbox'
            parse={this.parseToggle}
            helpText={<p className={styles.HelpText}>Transactional messages are triggered by a user’s actions on the
              website, like requesting a password reset, signing up, or making a purchase.</p>}
            disabled={submitting}

          />
        </Panel.Section>
        <Panel.Section>
          <Button
            type='submit'
            primary
            disabled={submitting}
          >
            Update Settings
          </Button>

          <Button
            className={styles.DeleteButton}
          >
            Delete Template
          </Button>

        </Panel.Section>
      </form>
    </>);
  }
}

const mapStateToProps = (state, props) => ({
  domains: selectDomainsBySubaccount(state, props),
  domainsLoading: state.sendingDomains.listLoading,
  hasSubaccounts: hasSubaccounts(state),
  canViewSubaccount: selectCondition(not(isSubaccountUser))(state),
  initialValues: props.draft
});

const formOptions = {
  form: formName,
  enableReinitialize: true // required to update initial values from redux state
};

export default withRouter(connect(mapStateToProps, { updateTemplate, showAlert })(reduxForm(formOptions)(SettingsForm)));
