import Camera from './camera';

import { events } from '@data/events';

const eventIds = Object.keys(events);

export default function EventHome(props) {
  return <Camera {...props} />;
}

export async function getStaticProps({ params }) {
  return {
    props: {
      eventId: params.eventId.toLowerCase(),
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
    fallback: true,
  };
}
