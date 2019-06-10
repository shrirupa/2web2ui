import React from 'react';
import EditorContext from '../../context/EditorContext';
import SettingsForm from './Form';
import { isSubaccountUser } from '../../../../helpers/conditions/user';
import { selectCondition } from '../../../../selectors/accessConditionState';
import { hasSubaccounts } from '../../../../selectors/subaccounts';
import { not } from '../../../../helpers/conditions';
import { selectDomainsBySubaccount } from '../../../../selectors/templates';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { update as updateTemplate } from '../../../../actions/templates';
import { reduxForm } from 'redux-form';
import { showAlert } from '../../../../actions/globalAlert';

const formName = 'templateSettings';

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

const ConnectedSettingsForm = withRouter(connect(mapStateToProps, {
  updateTemplate,
  showAlert
})(reduxForm(formOptions)(SettingsForm)));


const FormContainer = (props) => (
  <EditorContext.Consumer>
    {(value) => <ConnectedSettingsForm {...value} {...props} />}
  </EditorContext.Consumer>
);

export default FormContainer;
