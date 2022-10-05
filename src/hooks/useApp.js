import { useState, createContext, useContext, useEffect } from 'react';

import { DEFAULT_EVENT_ID } from '@data/events';

const STATE_KEY = 'CLOUDYCAM';

export const AppContext = createContext();

export const AppProvider = ({ children, eventId }) => {
  const state = useAppState({
    eventId,
  });
  return <AppContext.Provider value={state}>{children}</AppContext.Provider>;
};

export function useAppState({ eventId: initialEventId = DEFAULT_EVENT_ID }) {
  const [state, setState] = useState();

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
