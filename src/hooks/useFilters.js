import { useState } from 'react';

import { ALL_FILTERS, FILTER_TYPES, FILTER_ID_NONE } from '@data/filters';

const DEFAULT_FILTERS = {};

export function useFilters({ backgroundReady }) {
  const [activeFilters, setActiveFilters] = useState(DEFAULT_FILTERS);

  const filters = ALL_FILTERS.map((filter) => {
    return {
      ...filter,
      active: !!activeFilters[filter.id],
    };
  });

  /**
   * toggle
   * @description Given a filter's ID, attempt to switch it on or off based on current state
   */

  function toggle({ filterId, filterType }) {
    const filter = ALL_FILTERS.find(({ id, type }) => id === filterId && type === filterType);

    if (!filter || filterId === FILTER_ID_NONE) {
      setActiveFilters((prev) => {
        const next = { ...prev };

        // Clear all filters with the same type to avoid multiple
        // overlapping filters that won't work properly

        Object.keys(next).forEach((key) => {
          if (next[key].type === filterType) {
            delete next[key];
          }
        });

        return next;
      });
      return;
    }

    setActiveFilters((prev) => {
      const next = { ...prev };

      // Clear all filters with the same type to avoid multiple
      // overlapping filters that won't work properly

      Object.keys(next).forEach((key) => {
        if (next[key].type === filter.type) {
          delete next[key];
        }
      });

      // If the previous state didn't have the new filter, make
      // sure to add it, but we don't need to worry about deleting
      // as it should be cleared in the above check

      if (!activeFilters[filter.id]) {
        next[filter.id] = filter;
      }

      return next;
    });
  }

  /**
   * randomize
   * @description Given a filter's ID, attempt to switch it on or off based on current state
   */

  function randomize() {
    const randomFilters = FILTER_TYPES.map(({ id: typeId }) => {
      let randomized = ALL_FILTERS.filter(({ type }) => type === typeId);

      if (!backgroundReady) {
        randomized = randomized.filter(({ type }) => type !== 'backgrounds');
      }

      randomized = randomized.sort(() => 0.5 - Math.random())[0];

      return randomized;
    });
    randomFilters.filter((filter) => !!filter).forEach(({ id, type }) => toggle({ filterId: id, filterType: type }));
  }

  /**
   * reset
   * @description Reset filter state to nothing
   */

  function reset() {
    setActiveFilters(DEFAULT_FILTERS);
  }

  return {
    filters,
    types: FILTER_TYPES,
    toggle,
    randomize,
    reset,
  };
}
