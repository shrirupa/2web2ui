import { useEffect } from 'react';

const useWindowEvent = (eventName, handler) => {
  useEffect(() => {
    window.addEventListener(eventName, handler);
    return () => {
      window.removeEventListener(eventName, handler);
    };
  }, [eventName, handler]);
};

export default useWindowEvent;
