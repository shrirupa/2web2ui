import React from 'react';
import { TextField } from '@sparkpost/matchbox';

const TextFieldWrapper = ({ name, validate, formHook, ...rest }) => {
  const defaultResize = rest.multiline ? 'vertical' : 'both';

  const { useInput, errors } = formHook;
  const { isFocused, isTouched, isValid, ...inputHooks } = useInput(name, validate);
  const error = errors[name];

  return (
    <TextField
      id={name}
      name={name}
      error={!isFocused && isTouched && error ? error : undefined}
      resize={defaultResize}
      {...inputHooks}
      {...rest}
    />
  );
};

export default TextFieldWrapper;
