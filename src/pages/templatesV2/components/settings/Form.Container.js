import React from 'react';
import EditorContext from '../../context/EditorContext';
import SettingsForm from './Form';

const FormContainer = (props) => (
  <EditorContext.Consumer>
    {(value) => <SettingsForm {...value} {...props} />}
  </EditorContext.Consumer>
);

export default FormContainer;
