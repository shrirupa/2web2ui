import React, { Component } from 'react';
import { Link } from 'react-router-dom';
// Components
import { Button, Page, Panel } from '@sparkpost/matchbox';
import { Loading } from 'src/components';
import { setSubaccountQuery } from 'src/helpers/subaccounts';
import styles from './CreatePage.module.scss';
import CreateForm from './components/create/CreateForm';
import { routeNamespace } from './constants/routes';

export default class CreatePage extends Component {
  componentDidMount() {
    this.props.listDomains();
  }

  handleCreate = (values) => {
    const { create, history, subaccountId, showAlert } = this.props;
    const formData = { ...values, content: { ...values.content, text: '' }}; //add some content to avoid api validation error

    return create(formData)
      .then(() => {
        showAlert({ type: 'success', message: 'Template Created.' });
        history.push(`/${routeNamespace}/edit/${values.id}/draft/content${setSubaccountQuery(subaccountId)}`);
      });
  };

  render() {
    const { handleSubmit, submitting, pristine, valid, loading, formName } = this.props;

    if (loading) {
      return <Loading/>;
    }

    const backAction = {
      content: 'Templates',
      Component: Link,
      to: `/${routeNamespace}`
    };

    return (
      <Page
        breadcrumbAction={backAction}
        title='Create New Template'
      >
        <p className={styles.LeadText}>
          To get started, first provide some basic details about your new template before adding in content.
        </p>

        <form onSubmit={handleSubmit(this.handleCreate)}>
          <Panel>
            <Panel.Section>
              <CreateForm formName={formName}/>
            </Panel.Section>
          </Panel>
          <Button type='submit' primary className={styles.NextButton}
            disabled={submitting || pristine || !valid}>Next</Button>
        </form>
      </Page>
    );
  }
}
