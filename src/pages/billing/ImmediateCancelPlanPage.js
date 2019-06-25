import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import { ApiErrorBanner, Loading } from 'src/components';
import { cancelAccount } from 'src/actions/account';
import styles from './ImmediateChangePlanPage.module.scss';
import { showAlert } from 'src/actions/globalAlert';

const BILLING_ROUTE = '/account/billing';

export const LOAD_STATE = {
  PENDING: 1,
  SUCCESS: 2,
  FAILURE: 3
};

export class ImmediateCancelPlanPage extends Component {
  state = {
    loading: LOAD_STATE.PENDING
  }

  componentDidMount() {
    return this.handlePlanCancellation();
  }

  handlePlanCancellation = () => {
    const { cancelAccount, history, showAlert } = this.props;
    this.setState({ loading: LOAD_STATE.PENDING });
    return cancelAccount()
      .then(() => {
        showAlert({
          message: 'Your account has been cancelled.',
          type: 'success'
        });
        history.push(BILLING_ROUTE);
      }, (error) => {
        this.setState({ loading: LOAD_STATE.FAILURE, error });
      });
  }

  renderError() {
    return <div className={styles.ErrorBanner}>
      <ApiErrorBanner
        errorDetails={this.state.error.message}
        message='Sorry, we had some trouble cancelling your plan.'
        reload={this.handlePlanCancellation}
      />
    </div>;
  }

  render() {
    const { loading } = this.state;

    if (loading === LOAD_STATE.PENDING) {
      return <Loading />;
    }

    return <div className={styles.MessageBlock}>
      {loading === LOAD_STATE.FAILURE && this.renderError()}
    </div>;
  }
}

const mapDispatchToProps = {
  cancelAccount,
  showAlert
};

export default withRouter(connect(null, mapDispatchToProps)(ImmediateCancelPlanPage));
