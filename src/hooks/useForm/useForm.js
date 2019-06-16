import { useCallback, useEffect, useState } from 'react';
import _ from 'lodash';
import useFormInput from './useFormInput';

const performValidations = (value, rules) => {
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
};

export function useForm(defaultValues) {
  const [values, setValues] = useState({});
  const [errors, setErrors] = useState({});
  const [isValid, setIsValid] = useState(false);
  const [isPristine, setIsPristine] = useState(true);
  const [validations, setValidations] = useState({});

  const useInput = (name, inputValidation) => {
    const existingInputValidation = validations[name];
    if (!_.isEqual(inputValidation, existingInputValidation)) {
      setValidations({ ...validations, [name]: inputValidation });
    }

    const updateValue = (name, value) => { //TODO figure out why not working nicely with useCallback
      if (values[name] !== value) {
        setValues({ ...values, [name]: value });
      }
    };

    const input = useFormInput({
      name,
      values,
      updateValue
    });

    return input;
  };

  const handleValidations = useCallback(() => {
    const validationErrors = {};
    _.forEach(validations, (rules, name) => {
      validationErrors[name] = performValidations(values[name], rules);
    });

    if (!_.isEqual(validationErrors, errors)) {
      setErrors(validationErrors);
    }
  });


  useEffect(() => {
    setValues(defaultValues);
  }, [defaultValues]);

  useEffect(() => { //detect if form is valid
    setIsValid(!Object.values(errors).length);
  }, [errors]);

  useEffect(() => { //detect if form is pristine
    setIsPristine(_.isEqual(defaultValues, values));
  }, [defaultValues, values]);

  useEffect(() => { //handle validations
    handleValidations();
  }, [handleValidations, values]);

  return {
    values,
    errors,
    useInput,
    isPristine,
    isValid
  };
}
