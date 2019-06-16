import React from 'react';
import { TextField } from '@sparkpost/matchbox';

const TextFieldWrapper = ({ name, validate, formHook, ...rest }) => {
  const defaultResize = rest.multiline ? 'vertical' : 'both';

  const { useInput, errors, values } = formHook;
  const { isFocused, isTouched, ...inputHooks } = useInput(name, validate);
  const error = errors[name];
  const value = values[name] || '';

  return (
    <TextField
      id={name}
      name={name}
      error={!isFocused && isTouched && error ? error : undefined}
      resize={defaultResize}
      value={value}
      {...inputHooks}
      {...rest}
    />
  );
};

export default TextFieldWrapper;
