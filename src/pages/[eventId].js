import useSWR from 'swr';

import Camera from './camera';

import { events } from '@data/events';
import { CLOUDINARY_TAG_ASSET_TRANSFORMATION } from '@data/cloudinary';

const eventIds = Object.keys(events);

async function fetchEventImages([url, eventId]) {
  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      tags: [`event-${eventId}`, CLOUDINARY_TAG_ASSET_TRANSFORMATION],
    }),
  });

  if (!response.ok) {
    throw new Error(`Failed to load event images (${response.status})`);
  }

  const { resources, total_count } = await response.json();

  return {
    resources,
    totalCount: total_count,
  };
}

export default function EventHome(props) {
  // Include the event in the SWR key so each event's gallery is cached separately. Skip
  // fetching while a fallback page is rendering without an event ID.

  const { data = {} } = useSWR(props.eventId ? ['/api/cloudinary/resources', props.eventId] : null, fetchEventImages);
  const { resources } = data;

  const eventImages =
    Array.isArray(resources) &&
    resources.map(({ secure_url, public_id, width, height }) => {
      return {
        src: secure_url,
        publicId: public_id,
        width,
        height,
      };
    });

  return <Camera eventImages={eventImages} {...props} />;
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
