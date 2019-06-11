import React from 'react';
import _ from 'lodash';
import { Button, Panel } from '@sparkpost/matchbox';
import { useForm } from 'src/hooks/useForm';
import { TextFieldWrapper, ToggleBlockWrapper } from 'src/components/hooksFormWrapper';
import { required } from 'src/helpers/validation';
import DeleteTemplate from '../DeleteTemplate';
import { routeNamespace } from '../../constants/routes';
import useEditorContext from '../../hooks/useEditorContext';
import { minLength } from '../../../../helpers/validation';
import styles from './Form.module.scss';
import { emailOrSubstitution } from '../validation';

const SettingsForm = (props) => {
  const { settings, draft, domainsLoading, domains, updateDraft, subaccountId, showAlert, history } = useEditorContext();

  const formHook = useForm(settings);
  const { values, isPristine, isValid } = formHook;

  const submitForm = (e) => {
    e.preventDefault();
    //prepare values
    const settingValues = _.merge({}, draft, {
      id: settings.id,
      name: values.name,
      content: {
        subject: values.subject,
        from: {
          name: values.from_name,
          email: values.from_email
        }
      },
      options: {
        transactional: values.transactional,
        click_tracking: values.click_tracking,
        open_tracking: values.click_open
      },
      description: values.description
    });

    return updateDraft(settingValues, subaccountId);
  };

  const parseToggle = (value) => !!value;

  const onDelete = () => {
    history.push(`/${routeNamespace}`);
    showAlert({ message: 'Template deleted', type: 'success' });
  };

  // const canViewSubaccountSection = hasSubaccounts && canViewSubaccount;
  const fromEmailHelpText = !domainsLoading && !domains.length ? (subaccountId ? 'The selected subaccount does not have any verified sending domains.' : 'You do not have any verified sending domains to use.') : null;

  return (<>
    <form onSubmit={submitForm}>
      <Panel.Section>
        <TextFieldWrapper
          name='name'
          label='Template Name'
          formHook={formHook}
          validate={[required, minLength(4)]}
        />

        <TextFieldWrapper
          name='id'
          label='Template ID'
          disabled={true}
          formHook={formHook}
          validate={[required, minLength(4)]}
        />
      </Panel.Section>
      {/*{canViewSubaccountSection && <SubaccountSection newTemplate={false} disabled={submitting}/>}*/}

      <Panel.Section>
        <TextFieldWrapper
          name='subject'
          label='Subject'
          formHook={formHook}
          validate={[required, minLength(4)]}
        />

        {/** Todo need to fix the wrapper for auto suggestion */}
        <TextFieldWrapper
          name='from_email'
          label='From Email'
          formHook={formHook}
          helpText={fromEmailHelpText}
          validate={[required, emailOrSubstitution]}
        />

        <TextFieldWrapper
          name='from_name'
          label='From Name'
          formHook={formHook}
          helpText='A friendly from for your recipients.'
        />

        <TextFieldWrapper
          name='reply_to'
          label='Reply To'
          formHook={formHook}
          helpText='An email address recipients can reply to.'
          validate={emailOrSubstitution}
        />

        <TextFieldWrapper
          name='description'
          label='Description'
          formHook={formHook}
          helpText='Not visible to recipients.'
        />
      </Panel.Section>

      <Panel.Section>
        <ToggleBlockWrapper
          name='open_tracking'
          label='Track Opens'
          formHook={formHook}
          type='checkbox'
          parse={parseToggle}
        />

        <ToggleBlockWrapper
          name='click_tracking'
          label='Track Clicks'
          formHook={formHook}
          type='checkbox'
          parse={parseToggle}
        />
        <ToggleBlockWrapper
          name='transactional'
          label='Transactional'
          formHook={formHook}
          type='checkbox'
          parse={parseToggle}
          helpText={<p className={styles.HelpText}>Transactional messages are triggered by a user’s actions on the
            website, like requesting a password reset, signing up, or making a purchase.</p>}
        />
      </Panel.Section>
      <Panel.Section>
        <Button
          type='submit'
          primary
          disabled={!isValid || isPristine}
        >
          Update Settings
        </Button>
        <DeleteTemplate className={styles.DeleteButton} afterDelete={onDelete}>Delete Template</DeleteTemplate>
      </Panel.Section>
    </form>
  </>);
};

export default SettingsForm;
