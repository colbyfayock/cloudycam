import { useState, createContext, useContext, useEffect } from 'react';

const STATE_KEY = 'CLOUDYCAM';

const DEFAULT_STATE = {
  host: process.env.NEXT_PUBLIC_URL,
};

export const AppContext = createContext();

export const AppProvider = ({ children, eventId }) => {
  const state = useAppState({
    eventId,
  });
  return <AppContext.Provider value={state}>{children}</AppContext.Provider>;
};

export function useAppState({ eventId: initialEventId }) {
  const [state, setState] = useState(DEFAULT_STATE);

  // Hydrate existing state

  useEffect(() => {
    const data = window.localStorage.getItem(STATE_KEY);
    const initialState = data !== null ? JSON.parse(data) : {};

    if (initialState.eventId !== initialEventId) {
      initialState.eventId = initialEventId;
    }

    setState(initialState);
  }, [initialEventId]);

  // Store state updates on change

  useEffect(() => {
    if (!state) return;
    window.localStorage.setItem(STATE_KEY, JSON.stringify(state));
  }, [state]);

  // Get the host if it doesn't exist when the page loads

  useEffect(() => {
    if (!state.host) {
      setState((prev) => {
        return {
          ...prev,
          host: window?.location.origin,
        };
      });
    }
  }, [state.host]);

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
