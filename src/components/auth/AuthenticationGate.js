import { Component } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import authCookie from 'src/helpers/authCookie';
import siteCookie from 'src/helpers/websiteAuthCookie';
import { login } from 'src/actions/auth';
import { successAction } from 'src/actions/websiteAuth';
import { getGrantsFromCookie } from 'src/actions/currentUser';
import { logout } from 'src/actions/auth';
import { AUTH_ROUTE, SSO_AUTH_ROUTE } from 'src/constants';

export class AuthenticationGate extends Component {
  componentWillMount() {
    const { auth } = this.props;

    if (auth.loggedIn && auth.token) {
      return;
    }

    const foundCookie = authCookie.get();
    if (foundCookie) {
      this.props.login({ authData: foundCookie });
      this.props.getGrantsFromCookie(foundCookie);
    }

    const websiteCookie = siteCookie.get();
    if (websiteCookie) {
      this.props.successAction({ data: websiteCookie });
    }
  }

  componentDidUpdate(oldProps) {
    const { account, auth, history, location = {}, logout } = this.props;

    // if logging out
    if (![AUTH_ROUTE, SSO_AUTH_ROUTE].includes(location.pathname) && oldProps.auth.loggedIn && !auth.loggedIn) {
      history.push({
        pathname: AUTH_ROUTE,
        state: {} // explicitly clear router state on log out
      });
    }

    if (oldProps.account.status !== 'terminated' && account.status === 'terminated') {
      logout();
    }
  }

  render() {
    return null;
  }
}

export default withRouter(connect(({ auth, account }) => ({ auth, account }), { login, logout, getGrantsFromCookie, successAction })(AuthenticationGate));
