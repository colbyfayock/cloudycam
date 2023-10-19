import { useState, createContext, useContext, useEffect } from 'react';
import { DEFAULT_EVENT_ID } from '@data/events';

const STATE_KEY = 'CLOUDYCAM';

const DEFAULT_STATE = {
  host: process.env.NEXT_PUBLIC_URL,
  mode: 'user',
  eventId: DEFAULT_EVENT_ID,
};

export const AppContext = createContext();

export const AppProvider = ({ children, eventId }) => {
  const state = useAppState({
    eventId,
  });
  return <AppContext.Provider value={state}>{children}</AppContext.Provider>;
};

let isHydrated = false;

export function useAppState({ eventId: initialEventId }) {
  const [state, setState] = useState();

  // // Hydrate existing state

  useEffect(() => {
    if (isHydrated) return;

    isHydrated = true;

    const data = window.localStorage.getItem(STATE_KEY);
    const initialState = data !== null ? JSON.parse(data) : {};

    if (initialEventId && initialState.eventId !== initialEventId) {
      initialState.eventId = initialEventId;
    }

    setState({
      ...DEFAULT_STATE,
      ...initialState,
    });
  }, []);

  // If the initial event ID changes, reflect in state

  useState(() => {
    setState((prev) => {
      return {
        ...prev,
        eventId: initialEventId,
      };
    });
  }, [initialEventId]);

  // Store state updates on change

  useEffect(() => {
    if (!state) return;
    window.localStorage.setItem(STATE_KEY, JSON.stringify(state));
  }, [state]);

  // Get the host if it doesn't exist when the page loads

  useEffect(() => {
    if (!state?.host) {
      setState((prev) => {
        return {
          ...prev,
          host: window?.location.origin,
        };
      });
    }
  }, [state?.host]);

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

  /**
   * setMode
   */

  function setMode(mode) {
    setState((prev) => {
      return {
        ...prev,
        mode,
      };
    });
  }

  return {
    setEventId,
    setMode,
    ...state,
  };
}

export function useApp() {
  const state = useContext(AppContext);
  return state;
}
