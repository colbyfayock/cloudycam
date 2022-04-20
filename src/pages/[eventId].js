import { useEffect } from 'react';

import Home from './';

import { useApp } from '@hooks/useApp';

import { events } from '@data/events';

const eventIds = Object.keys(events);

export default function EventHome(props) {
  const { setEventId } = useApp();

  useEffect(() => setEventId(props.eventId), [setEventId, props.eventId]);

  return <Home {...props} />;
}

export async function getStaticProps({ params }) {
  return {
    props: {
      eventId: params.eventId,
    },
  };
}

export async function getStaticPaths() {
  return {
    paths: eventIds.map((eventId) => {
      return {
        params: {
          eventId,
        },
      };
    }),
    fallback: false,
  };
}
