import { useState } from "react";

export const useLocalStorage = (key, initialValue) => {
  const [storedValue, setStoredValue] = useState(() => {
    try {
      return window.localStorage.getItem(key)
        ? JSON.parse(window.localStorage.getItem(key))
        : initialValue;
    } catch (error) {
      return initialValue;
    }
  });

  const setValue = (value) => {
    if(value==='removeToken') {
      window.localStorage.removeItem('access_token');
      return;
    };
    if(value==='removeExpiresin') {
      window.localStorage.removeItem('expiresin');
      return;
    };
    window.localStorage.setItem(key, value);
    setStoredValue(value);
  }

  return [storedValue, setValue];
}