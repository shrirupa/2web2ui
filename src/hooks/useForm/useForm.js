import { useEffect, useState } from 'react';
import _ from 'lodash';
import useFormInput from './useFormInput';

export function useForm(defaultValues) {
  const formHandler = useState(defaultValues);
  const [values, setValues] = formHandler;
  const [errors, setErrors] = useState({});
  const [mounted, setMounted] = useState(false);
  const [isValid, setIsValid] = useState(false);
  const [isPristine, setIsPristine] = useState(true);

  // initial mounted flag
  useEffect(() => setMounted(true), []);

  const handleError = (name, error) => {
    if (error) {
      errors[name] = error;
    } else {
      delete errors[name];
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

  useEffect(() => { //detect if form is valid
    setIsValid(mounted && !Object.values(errors).length);
  }, [errors, mounted, values]);

  useEffect(() => { //detect if form is pristine
    setIsPristine(_.isEqual(defaultValues, values));
  }, [defaultValues, values]);

  return {
    values,
    setValues,
    useInput,
    errors,
    isPristine,
    isValid
  };
}
