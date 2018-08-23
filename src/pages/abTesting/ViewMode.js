import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withRouter, Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import { Page } from '@sparkpost/matchbox';
import { Save } from '@sparkpost/matchbox-icons';
import Section from './components/Section';
import StatusPanel from './components/StatusPanel';
import { StatusContent, SettingsContent, VariantsContent } from './components/content';
import { StatusView, SettingsView, VariantsView } from './components/view';
import { ConfirmationModal } from 'src/components';
import { updateDraft } from 'src/actions/abTesting';
import { showAlert } from 'src/actions/globalAlert';
import { selectLatestVersionNumberFromParams } from 'src/selectors/abTesting';
import { setSubaccountQuery } from 'src/helpers/subaccounts';

export class ViewMode extends Component {

  state = {
    showOverrideModal: false
  }

  getPrimaryAction = () => {
    const { status, version } = this.props.test;
    const { latest, location } = this.props;

    // Rescheduling only allowed if viewing latest
    if (version === latest && (status === 'cancelled' || status === 'completed')) {
      return {
        content: 'Edit and Reschedule Test',
        to: {
          pathname: location.pathname,
          search: location.search,
          state: {
            rescheduling: true
          }
        },
        component: Link
      };
    }

    return null;
  }

  getSecondaryActions = () => {
    const { test, deleteAction, cancelAction } = this.props;
    const status = test.status;
    return [
      {
        content: <span><Save /> Override with new draft</span>,
        visible: status === 'completed' || status === 'cancelled',
        onClick: this.toggleOverride
      },
      cancelAction,
      deleteAction
    ];
  }

  toggleOverride = () => {
    this.setState({ showOverrideModal: !this.state.showOverrideModal });
  }

  handleOverride = () => {
    const { id, version } = this.props.test;
    const { subaccountId, updateDraft, showAlert, history } = this.props;

    return updateDraft({ data: {}, id, subaccountId }).then(() => {
      showAlert({ type: 'success', message: 'Test overridden' });
      history.push(`/ab-testing/${id}/${version + 1}${setSubaccountQuery(subaccountId)}`);
    });
  }

  render() {
    const { breadcrumbAction, test, subaccountId, updateDraftPending } = this.props;
    const { name } = this.props.test;

    return (
      <Page
        title={name}
        breadcrumbAction={breadcrumbAction}
        primaryAction={this.getPrimaryAction()}
        secondaryActions={this.getSecondaryActions()}>

        <Section title='Status'>
          <Section.Left>
            <StatusContent test={test} />
          </Section.Left>
          <Section.Right>
            <StatusPanel test={test} subaccountId={subaccountId} />
            <StatusView test={test} />
          </Section.Right>
        </Section>

        <Section title='Settings'>
          <Section.Left>
            <SettingsContent test={test} />
          </Section.Left>
          <Section.Right>
            <SettingsView test={test} />
          </Section.Right>
        </Section>

        <Section title='Variants'>
          <Section.Left>
            <VariantsContent test={test} />
          </Section.Left>
          <Section.Right>
            <VariantsView test={test} subaccountId={subaccountId} />
          </Section.Right>
        </Section>

        <ConfirmationModal
          open={this.state.showOverrideModal}
          title='Are you sure you want to override the winning template for this test?'
          content={<p>The test will be updated and placed into draft state. Messages will be delivered to the default template.</p>}
          onConfirm={this.handleOverride}
          onCancel={this.toggleOverride}
          isPending={updateDraftPending}
          confirmVerb='OK'
        />
      </Page>
    );
  }
}

ViewMode.propTypes = {
  test: PropTypes.shape({
    status: PropTypes.oneOf(['cancelled', 'completed', 'running'])
  })
};

function mapStateToProps(state, props) {
  return {
    updateDraftPending: state.abTesting.updateDraftPending,
    latest: selectLatestVersionNumberFromParams(state, props)
  };
}

export default withRouter(connect(mapStateToProps, { updateDraft, showAlert })(ViewMode));
