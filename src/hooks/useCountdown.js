import { useState, useEffect, useEffectEvent, useCallback } from 'react';

/**
 * useCountdown
 * @description Ticks down from a total in fixed intervals and calls onComplete at zero. The
 * pending timeout is cleared on cancel and on unmount, so a countdown can't fire a capture
 * after the camera has been reset or the user has navigated away.
 */

export function useCountdown({ interval = 1000, onComplete } = {}) {
  const [remaining, setRemaining] = useState();

  const handleComplete = useEffectEvent(() => {
    if (typeof onComplete === 'function') onComplete();
  });

  useEffect(() => {
    if (remaining === undefined) return;

    const id = setTimeout(() => {
      const next = remaining - interval;

      if (next > 0) {
        setRemaining(next);
        return;
      }

      setRemaining(undefined);
      handleComplete();
    }, interval);

    return () => clearTimeout(id);
  }, [remaining, interval]);

  const start = useCallback((total) => setRemaining(total), []);
  const cancel = useCallback(() => setRemaining(undefined), []);

  return {
    remaining,
    active: remaining !== undefined,
    start,
    cancel,
  };
}
