import { useEffect, useState } from 'react';
import _ from 'lodash';

export default function useFormInput({ name, formHandler, validation = null, handleError }) {
  const [formValues, setFormValues] = formHandler;
  const formValue = formValues[name] || ''; //to avoid potential uncontrolled -> controlled react warning

  const [value, setValue] = useState(formValue);
  const [isValid, setIsValid] = useState(true);
  const [isTouched, setIsTouched] = useState(false);
  const [isFocused, setIsFocused] = useState(false);

  function performValidations(value, rules) {
    const validationRules = rules ? _.isArray(rules) ? rules : [rules] : [];

    let validationMessage = null;
    _.forEach(validationRules, (rule) => {
      if (validationMessage) { //already an error exist, no further iteration needed
        return false;
      }

      if (!_.isFunction(rule)) {
        validationMessage = `Invalid validation ${rule}`;
      }

      validationMessage = rule(value);
    });

    return validationMessage;
  }

  function handleValidation(value) {
    const validationErrors = performValidations(value, validation);
    setIsValid(!validationErrors);
    handleError(name, validationErrors);
  }

  // initial validation
  useEffect(() => {
    handleValidation(value);
  }, [handleValidation, value]);

  // watch for external parent data changes in self
  useEffect(() => {
    if (value !== formValue) {
      setValue(formValue);
      setIsTouched(false);
      setIsFocused(false);
    }
  }, [formValue, value]);

  // validate on value change
  useEffect(() => {
    handleValidation(value);
  }, [handleValidation, value]);

  // rewrite self and parent's value
  function handleChange({ target }) {
    const { value, type, checked } = target;

    const newValue = type === 'checkbox' ? checked : value;

    setValue(value);
    setFormValues({
      ...formValue,
      [name]: newValue
    });
  }

  const handleFocus = () => {
    if (!isTouched) {
      setIsTouched(true);
    }
    setIsFocused(true);
    handleValidation(value);
  };

  const handleBlur = () => {
    setIsFocused(false);
  };

  return {
    value,
    // name,
    isTouched,
    isFocused,
    onChange: handleChange,
    onFocus: handleFocus,
    onBlur: handleBlur,
    isValid
  };
}
