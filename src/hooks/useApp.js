import { useState, createContext, useContext, useEffect } from 'react';

const STATE_KEY = 'CLOUDYCAM';

const DEFAULT_STATE = {
  eventId: undefined,
};

export const AppContext = createContext();

export const AppProvider = ({ children }) => {
  const state = useAppState();
  return <AppContext.Provider value={state}>{children}</AppContext.Provider>;
};

export function useAppState() {
  const [state, setState] = useState();

  // Hydrate existing state

  useEffect(() => {
    const data = window.localStorage.getItem(STATE_KEY);
    if (data !== null) {
      setState(JSON.parse(data));
    } else {
      setState(DEFAULT_STATE);
    }
  }, []);

  // Store state updates on change

  useEffect(() => {
    if (!state) return;
    window.localStorage.setItem(STATE_KEY, JSON.stringify(state));
  }, [state]);

  /**
   * setEventId
   */

  function setEventId(eventId) {
    setState((prev) => {
      return {
        ...prev,
        eventId,
      };
    });
  }

  return {
    setEventId,
    ...state,
  };
}

export function useApp() {
  const state = useContext(AppContext);
  return state;
}
