import { useCallback } from 'react';
import useSWR from 'swr';

import Camera from './camera';

import { events } from '@data/events';
import { CLOUDINARY_UPLOADS_FOLDER, CLOUDINARY_TAG_ASSET_TRANSFORMATION } from '@data/cloudinary';

const eventIds = Object.keys(events);

export default function EventHome(props) {
  const memoizedCallback = useCallback(
    async (url) => {
      const { resources, total_count } = await fetch(url, {
        method: 'POST',
        body: JSON.stringify({
          folder: CLOUDINARY_UPLOADS_FOLDER,
          tags: [`event-${props.eventId}`, CLOUDINARY_TAG_ASSET_TRANSFORMATION],
        }),
      }).then((res) => res.json());
      return {
        resources,
        totalCount: total_count,
      };
    },
    [props.eventId]
  );

  const { data = {} } = useSWR('/api/cloudinary/resources', memoizedCallback);
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
