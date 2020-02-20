import React from 'react';
import { connect } from 'react-redux';
import { Field, reduxForm } from 'redux-form';
import { TextFieldWrapper, CheckboxWrapper, PageLink } from 'src/components';
import { FORMS } from 'src/constants';
import { required } from 'src/helpers/validation';
import { trimWhitespaces } from 'src/helpers/string';
import { Button, Error } from '@sparkpost/matchbox';

export const LoginForm = ({ loginPending, loginError, handleSubmit }) => (
  <React.Fragment>
    {loginError && (
      <div style={{ marginBottom: '12px' }}>
        <Error error={loginError} />
      </div>
    )}
    {'Completely Fake Form.'}
    <form onSubmit={handleSubmit}>
      <Field
        autoFocus
        errorInLabel
        name="username"
        id="username"
        label="Email or Username"
        placeholder="email@example.com"
        normalize={trimWhitespaces}
        component={TextFieldWrapper}
        validate={required}
      />

      <Field
        type="password"
        name="password"
        id="password"
        label="Password"
        placeholder="••••••••"
        component={TextFieldWrapper}
        helpText={<PageLink to="/forgot-password">Forgot your password?</PageLink>}
      />
      <Field
        name="rememberMe"
        id="rememberMe"
        label="Keep me logged in"
        component={CheckboxWrapper}
      />

      <Button primary submit disabled={loginPending} data-id="button-log-in">
        {loginPending ? 'Logging In' : 'Log In'}
      </Button>
    </form>
  </React.Fragment>
);

function mapStateToProps({ auth }) {
  return {
    loginPending: auth.loginPending,
    loginError: auth.errorDescription,
    initialValues: {
      username: auth.username,
      password: auth.password,
      rememberMe: Boolean(auth.rememberMe),
    },
  };
}

export default connect(mapStateToProps)(reduxForm({ form: FORMS.LOGIN })(LoginForm));
