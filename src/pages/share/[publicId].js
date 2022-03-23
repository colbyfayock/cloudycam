import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { v2 as cloudinary } from 'cloudinary';
import { FaCamera, FaTwitter } from 'react-icons/fa';

import { createTweetAction, openTweet } from '@lib/social';

import Layout from '@components/Layout';
import Container from '@components/Container';
import Button from '@components/Button';

import styles from '@styles/Share.module.scss';

import { CLOUDINARY_UPLOADS_FOLDER } from '@data/cloudinary';

const HOST = process.env.URL || process.env.NEXT_PUBLIC_URL;

const PROPERTIES = [
  {
    id: 'fl',
    name: 'Flag',
    description: 'Alters the regular behavior of another transformation or the overall delivery behavior.',
  },
  {
    id: 'g',
    name: 'Gravity',
    description: 'Determines which part of an asset to focus on.',
  },
  {
    id: 'h',
    name: 'Height',
    description: 'Determines the height of a transformed asset or an overlay.',
  },
  {
    id: 'l',
    name: 'Layer',
    description: 'Applies a layer over the base asset, also known as an overlay.',
  },
  {
    id: 'w',
    name: 'Width',
    description: 'Determines the width of a transformed asset or an overlay.',
  },
  {
    id: 'x',
    name: 'X Coordinate',
    description: 'Adjusts the starting location or offset of the corresponding transformation action on the X axis.',
  },
  {
    id: 'y',
    name: 'Y Coordinate',
    description: 'Adjusts the starting location or offset of the corresponding transformation action on the Y axis.',
  },
];

function parseTransformationStringToReadable(transformation) {
  const segments = transformation.split(',');
  return segments.map((segment, index) => {
    const matches = segment.match(/([a-zA-Z]+)_([a-zA-Z0-9_:\-.]+)/);

    if (!matches) {
      return {
        id: `${segment}-${index}`,
        name: 'Other',
        value: segment,
      };
    }

    const [, id, value] = matches;
    const property = PROPERTIES.find((prop) => prop.id === id);

    return {
      ...property,
      value,
    };
  });
}

export default function Share({ resource, original, filters }) {
  console.log('filters', filters);

  const router = useRouter();

  const twitterAction = createTweetAction({
    message: ['My Transformations', '', '#CloudyCam', '', `${HOST}${router.asPath}`],
    related: ['Cloudinary'],
  });

  console.log('resource', resource);

  /**
   * handleOnTwitterClick
   */

  function handleOnTwitterClick(e) {
    e.preventDefault();
    openTweet({
      message: twitterAction,
    });
  }

  return (
    <Layout>
      <Head>
        <title>CloudyCam</title>
        <meta name="description" content="From Cloudinary" />
      </Head>

      <Container className={styles.shareContainer}>
        <div className={styles.imageTransformed}>
          <p>
            <img src={resource.secure_url} alt="Transformed Image" />
          </p>
        </div>

        <div className={styles.content}>
          <ul className={styles.actions}>
            <li>
              <Button color="twitter-blue" iconPosition="left" onClick={handleOnTwitterClick}>
                <FaTwitter /> Share on Twitter
              </Button>
            </li>
            <li>
              <Link href="/camera" passHref={true}>
                <Button color="cloudinary-yellow" iconPosition="left">
                  <FaCamera /> Create Your Own
                </Button>
              </Link>
            </li>
          </ul>

          {original && (
            <div className={styles.imageOriginal}>
              <div className={styles.imageOriginalDetails}>
                <h2>Original Image</h2>
                <p className={styles.imageOriginalLink}>
                  <a href={original.secure_url} target="_blank" rel="noreferrer">
                    View Image
                  </a>
                </p>
              </div>
              <p className={styles.imageOriginalImage}>
                <img src={original.secure_url} alt="Transformed Image" />
              </p>
            </div>
          )}
        </div>
      </Container>

      <Container className={styles.cloudinary}>
        <div className={styles.cloudinaryContent}>
          <h2 className={styles.cloudinaryHeadline}>Transform & Deliver with Cloudinary</h2>
          <p>
            Media delivery is cool and Cloudinary is great at it. Register with the link below and{' '}
            <strong>get an extra something.</strong>
          </p>
          <p>
            <Button
              href="https://cloudinary.com/users/register/free?utm_source=cityjsbrazil&utm_medium=event&utm_campaign=cityjsbrazil_booth"
              color="cloudinary-yellow"
            >
              Sign Up Today
            </Button>
          </p>
        </div>
        <div className={styles.cloudinaryImage}>
          <img src="/images/cloudinary-media-experience-cloud.png" />
        </div>
      </Container>

      <Container>
        <h2>How it Works</h2>

        <h2>Transformations</h2>

        <div className={styles.filters}>
          {Object.keys(filters).map((key) => {
            const { id: filterId, title: filterTitle, transformations = [] } = filters[key];
            return (
              <div key={filterId} className={styles.filter}>
                <h3 className={styles.filterTitle}>{filterTitle}</h3>
                <div className={styles.transformations}>
                  {transformations.map((transformation) => {
                    const definitions = parseTransformationStringToReadable(transformation);
                    return (
                      <ul key={transformation} className={styles.transformation}>
                        {definitions.map((definition) => {
                          return (
                            <li key={definition.id} className={styles.definition}>
                              <p className={styles.definitionDetails}>
                                <strong className={styles.definitionTitle}>{definition.name}:</strong>
                                <code className={styles.definitionRule}>{`${definition.id}_${definition.value}`}</code>
                              </p>
                              <p className={styles.definitionDescription}>{definition.description}</p>
                            </li>
                          );
                        })}
                      </ul>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      </Container>
    </Layout>
  );
}

export async function getServerSideProps({ params }) {
  cloudinary.config({
    cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
    secure: true,
  });

  const publicId = `${CLOUDINARY_UPLOADS_FOLDER}/${params.publicId}`;
  const resourceResults = await cloudinary.api.resource(publicId);

  const originalPublicId = resourceResults?.context?.custom?.original_public_id;
  const originalResults = originalPublicId && (await cloudinary.api.resource(originalPublicId));

  const keys = ['public_id', 'resource_type', 'created_at', 'width', 'height', 'secure_url'];

  const resource = {};
  const original = {};

  const filtersString = resourceResults?.context?.custom?.cloudycam_filters;
  const filters = filtersString && JSON.parse(filtersString);

  keys.forEach((key) => (resource[key] = resourceResults[key]));

  if (originalResults) {
    keys.forEach((key) => (original[key] = originalResults[key]));
  }

  return {
    props: {
      resource,
      original,
      filters,
    },
  };
}
