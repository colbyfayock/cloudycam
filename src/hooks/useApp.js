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

function readStoredState() {
  try {
    const data = window.localStorage.getItem(STATE_KEY);
    return data !== null ? JSON.parse(data) : {};
  } catch {
    // Private browsing, blocked storage, or corrupted data shouldn't break the app
    return {};
  }
}

export function useAppState({ eventId: pageEventId }) {
  const [state, setState] = useState();

  // Hydrate existing state from localStorage after mount so server and client renders match.
  // This syncs from an external store once, so setting state here is intentional.

  useEffect(() => {
    const storedState = readStoredState();
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setState({
      ...DEFAULT_STATE,
      ...storedState,
      host: storedState.host || DEFAULT_STATE.host || window.location.origin,
    });
  }, []);

  // An event ID from the page URL always wins over the stored one

  const eventId = pageEventId || state?.eventId;

  // Store state updates on change

  useEffect(() => {
    if (!state) return;
    try {
      window.localStorage.setItem(STATE_KEY, JSON.stringify({ ...state, eventId }));
    } catch {
      // Ignore storage being unavailable
    }
  }, [state, eventId]);

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
    eventId,
  };
}

export function useApp() {
  const state = useContext(AppContext);
  return state;
}
