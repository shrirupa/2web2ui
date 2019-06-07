import { useState, useCallback } from 'react';
import useWindowEvent from 'src/hooks/useWindowEvent';
import { onEnter } from 'src/helpers/keyEvents';

const useFieldValueOnReturn = (initialValue, handler) => {
  const [value, setValue] = useState(initialValue);
  const [focus, setFocus] = useState(false);

  const onChange = useCallback(
    (e) => {
      setValue(e.target.value);
    },
    [setValue]
  );

  const onFocus = useCallback(
    () => {
      setFocus(true);
    },
    [setFocus]
  );

  const onBlur = useCallback(
    () => {
      setFocus(false);
    },
    [setFocus]
  );

  const handleEnterKey = useCallback(
    onEnter((e) => {
      if (focus) {
        e.target.blur();
        handler(value);
      }
    }),
    [focus, handler, value]
  );

  useWindowEvent('keydown', handleEnterKey);

  return {
    value,
    onChange,
    onFocus,
    onBlur
  };
};

export default useFieldValueOnReturn;
