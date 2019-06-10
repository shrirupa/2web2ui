import { useEffect, useState } from 'react';
import _ from 'lodash';
import useFormInput from './useFormInput';

export function useForm(defaultValues) {
  const formHandler = useState(defaultValues);
  const errorHandler = useState({});
  const [mounted, setMounted] = useState(false);
  const [isValid, setIsValid] = useState(false);

  const [values, setValues] = formHandler;
  const [errors, setErrors] = errorHandler;

  // initial mounted flag
  useEffect(() => setMounted(true), []);

  const handleError = (name, unmetRule) => {
    if (!unmetRule) {
      delete errors[name];
    } else {
      errors[name] = unmetRule;
    }
    setErrors(errors);
  };

  const useInput = (name, validation) => {
    const input = useFormInput({
      name,
      validation,
      formHandler,
      handleError
    });

    return input;
  };

  useEffect(() => {
    setValues(defaultValues);
  }, [defaultValues, setValues]);

  useEffect(() => {
    setIsValid(mounted && !Object.values(errors).length);
  }, [errors, mounted, values]);

  return {
    values,
    setValues,
    useInput,
    errors,
    isPristine: _.isEqual(defaultValues, values),
    isValid
  };
}
