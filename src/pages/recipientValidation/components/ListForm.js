import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Field, reduxForm, formValueSelector } from 'redux-form';
import { Panel } from '@sparkpost/matchbox';
import { maxFileSize, fileExtension } from 'src/helpers/validation';
import FileUploadWrapper from './FileUploadWrapper';
import { uploadList, resetUploadError } from 'src/actions/recipientValidation';
import { showAlert } from 'src/actions/globalAlert';
import config from 'src/config';
import { withRouter } from 'react-router-dom';

const formName = 'recipientValidationListForm';

export class ListForm extends Component {
  handleUpload = fields => {
    const { history, reset, showAlert, uploadList } = this.props;
    const form_data = new FormData();

    form_data.append('myupload', fields.csv);

    // Always reset file on submit
    reset(formName);

    uploadList(form_data).then(({ list_id }) => {
      showAlert({ type: 'success', message: 'Recipients Uploaded' });
      history.push(`/recipient-validation/list/${list_id}`);
    });
  };

  componentDidUpdate() {
    const { file, handleSubmit, listError, resetUploadError } = this.props;

    // Redux form validation does not run in the same render cycle after Field's onChange,
    // thus checking props.valid would not work here *shakes fist*
    const valid =
      !maxFileSize(config.maxRecipVerifUploadSizeBytes)(file) && !fileExtension('csv', 'txt')(file);

    if (file && valid && !listError) {
      handleSubmit(this.handleUpload)();
    }

    // Resets API error post-submit for the subsequent submit after an error
    if (listError) {
      resetUploadError();
    }
  }

  render() {
    return (
      <Panel.Section>
        <form>
          <Field
            component={FileUploadWrapper}
            name="csv"
            validate={[
              maxFileSize(config.maxRecipVerifUploadSizeBytes),
              fileExtension('csv', 'txt'),
            ]}
            uploading={this.props.uploading}
            data-id="recipient-list-dropzone"
          />
        </form>
      </Panel.Section>
    );
  }
}

const WrappedForm = reduxForm({ form: formName })(ListForm);

const mapStateToProps = state => {
  const selector = formValueSelector(formName);

  return {
    file: selector(state, 'csv'),
    listError: state.recipientValidation.listError,
    uploading: state.recipientValidation.uploadLoading,
  };
};

export default withRouter(
  connect(mapStateToProps, { uploadList, showAlert, resetUploadError })(WrappedForm),
);
