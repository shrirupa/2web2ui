import React, { useState } from 'react';
import _ from 'lodash';
import { TextField } from '@sparkpost/matchbox';

const TextFieldWrapper = ({ name, validate, onChange, defaultValue, ...rest }) => {
  const defaultResize = rest.multiline ? 'vertical' : 'both';

  const [value, setValue] = useState(defaultValue);
  const [touched, setTouched] = useState(false);
  const [active, setActive] = useState(false);
  const [error, setError] = useState(false);

  function performValidations() {
    const validationRules = _.isArray(validate) ? validate : [validate];

    let validationMessage;
    _.forEach(validationRules, (rule) => {
      if (validationMessage) { //already an error exist, no further iternation needed
        return false;
      }

      if (!_.isFunction(rule)) {
        validationMessage = `Invalid validation ${rule}`;
      }
      validationMessage = rule(value);
    });

    if (validationMessage) {
      setError(validationMessage);
    } else {
      setError(null);
    }
  }

  return (
    <TextField
      id={name}
      name={name}
      onChange={(e) => {
        setValue(e.target.value);
        onChange(e.target.name, e.target.value);
      }}
      onFocus={() => {
        setTouched(true);
        setActive(true);
      }}
      onBlur={() => {
        setActive(false);
        performValidations();
      }}
      error={!active && touched && error ? error : undefined}
      resize={defaultResize}
      {...rest}
    />
  );
};

export default TextFieldWrapper;
