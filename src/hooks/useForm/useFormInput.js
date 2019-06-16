import { useCallback, useState } from 'react';

export default function useFormInput({ name, values, updateValue }) {
  const [isTouched, setIsTouched] = useState(false);
  const [isFocused, setIsFocused] = useState(false);

  const handleChange = ({ target }) => {
    const { value, type, checked } = target;
    const newValue = type === 'checkbox' ? checked : value;
    updateValue(name, newValue);
  };

  const handleFocus = useCallback(() => {
    setIsFocused(true);
    if (!isTouched) {
      setIsTouched(true);
    }
  }, [isTouched]);

  const handleBlur = useCallback(() => {
    setIsFocused(false);
  }, []);

  return {
    isTouched,
    isFocused,
    onChange: handleChange,
    onFocus: handleFocus,
    onBlur: handleBlur
  };
}
