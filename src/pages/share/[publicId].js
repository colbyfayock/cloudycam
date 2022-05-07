import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { v2 as cloudinary } from 'cloudinary';
import { FaCamera, FaTwitter } from 'react-icons/fa';

import { createTweetAction, openTweet } from '@lib/social';
import * as gtag from '@lib/gtag';

import { useApp } from '@hooks/useApp';

import Layout from '@components/Layout';
import Section from '@components/Section';
import Container from '@components/Container';
import Button from '@components/Button';

import { CLOUDINARY_UPLOADS_FOLDER, CLOUDINARY_ASSETS_FOLDER } from '@data/cloudinary';
import { events } from '@data/events';

import styles from '@styles/Share.module.scss';

const HOST = process.env.NEXT_PUBLIC_URL;

const PROPERTIES = [
  {
    id: 'c',
    name: 'Crop / Resize',
    description: 'Changes the size of the delivered asset according to the requested width & height dimensions.',
  },
  {
    id: 'e',
    name: 'Effect',
    description: 'Applies the specified effect to an asset.',
  },
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
    id: 'r',
    name: 'Round Corners',
    description: 'Rounds the corners of an image or video.',
  },
  {
    id: 'u',
    name: 'Underlay',
    description: 'Applies an image layer under the base image or video.',
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

const EFFECT_PROPERTIES = [
  {
    id: 'art',
    name: 'Art',
    description: 'Applies the selected artistic filter.',
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

function parseEffectsStringToReadable(transformation) {
  const matches = transformation.match(/([a-zA-Z]+):([a-zA-Z0-9_:\-.]+)/);

  if (!matches) {
    return {
      id: transformation,
      name: 'Other',
      value: transformation,
    };
  }

  const [, id, value] = matches;
  const property = EFFECT_PROPERTIES.find((prop) => prop.id === id);

  return {
    ...property,
    value,
  };
}

export default function Share({ resource, original, filters, ogImageUrl }) {
  const router = useRouter();

  const { eventId } = useApp();
  const event = events[eventId || 'default'];

  /**
   * handleOnTwitterClick
   */

  function handleOnTwitterClick(e) {
    e.preventDefault();

    gtag.event({
      action: 'click',
      category: 'share',
      label: 'twitter',
    });

    const twitterAction = createTweetAction({
      message: [
        'Transformed with #CloudyCam!',
        '',
        'Create your transformations below 👇',
        ...(event.hashtags ? ['', event.hashtags.map((hashtag) => `#${hashtag}`).join(' ')] : []),
        '',
        `${HOST || window?.location.origin}${router.asPath}`,
      ],
      related: ['Cloudinary'],
    });

    openTweet({
      message: twitterAction,
    });
  }

  return (
    <Layout className={styles.sharePage}>
      <Head>
        <title>CloudyCam</title>
        <meta name="description" content="From Cloudinary" />
        <meta property="og:title" content="Selfie. Transform. Unicorn. Get yours with CloudyCam!" />
        <meta property="og:image" content={ogImageUrl} />
        <meta property="og:image:secure_url" content={ogImageUrl} />
        <meta property="og:image:width" content="2024" />
        <meta property="og:image:height" content="1012" />
        <meta property="twitter:title" content="Selfie. Transform. Unicorn. Get yours with CloudyCam!" />
        <meta property="twitter:image" content={ogImageUrl} />
        <meta property="twitter:card" content="summary_large_image" />
      </Head>

      <Section className={styles.shareSection}>
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
                    <FaCamera /> Take a New Photo
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
      </Section>

      <Section>
        <Container className={styles.cloudinary}>
          <div className={styles.cloudinaryContent}>
            <h2 className={styles.cloudinaryHeadline}>Incredible media transformations made simple</h2>
            <p>Build your own transformations with a simple line of code using Cloudinary&apos;s Media APIs.</p>
            {event.incentive && (
              <p>
                Use the link below to get an <strong>{event.incentive.text}</strong>
                {event.incentive.moreInfo && (
                  <>
                    {` `}(
                    <a
                      href={`${event.incentive.moreInfo.link}?utm_source=${event.utm.source}&utm_medium=${event.utm.medium}&utm_campaign=${event.utm.campaign}`}
                      target="_blank"
                      rel="noreferrer"
                    >
                      {event.incentive.moreInfo.text}
                    </a>
                    )
                  </>
                )}
                !
              </p>
            )}
            <p>
              <Button
                href={`${event.register.link}?utm_source=${event.utm.source}&utm_medium=${event.utm.medium}&utm_campaign=${event.utm.campaign}`}
                color="cloudinary-yellow"
              >
                {event.register.text}
              </Button>
            </p>
          </div>
          <div className={styles.cloudinaryImage}>
            <img src="/images/cloudinary-media-experience-cloud.png" alt="Cloudinary Media Experience" />
            <img className={styles.cloudinaryImageOverlay} src={resource.secure_url} alt="Transformed Image" />
          </div>
        </Container>
      </Section>

      <Section>
        <Container>
          <h2 className={styles.sectionTitle}>How it Works</h2>

          <h3>It&apos;s all in the URL...</h3>

          <p>
            Cloudinary&apos;s{' '}
            <a
              href={`https://cloudinary.com/products/programmable_media?utm_source=${event.utm.source}&utm_medium=${event.utm.medium}&utm_campaign=${event.utm.campaign}`}
            >
              Programmable Media
            </a>{' '}
            allows you to construct URLs to deliver your resources and transform them on the fly.
          </p>

          <div className={styles.diagram}>
            <ul>
              <li>
                <strong>Base URL</strong>
                <span>https://res.cloudinary.com</span>
              </li>
              <li>
                <strong>Cloud Name</strong>
                <span>mycloud</span>
              </li>
              <li>
                <strong>Media Type</strong>
                <span>image</span>
              </li>
              <li>
                <strong>Delivery Method</strong>
                <span>upload</span>
              </li>
              <li>
                <strong>Transformations</strong>
                <span>f_auto,q_auto,w_500</span>
              </li>
              <li>
                <strong>Public ID</strong>
                <span>myimage</span>
              </li>
            </ul>
          </div>

          <h3>But you don&apos;t have to do it all by hand...</h3>

          <p>
            Supporting a{' '}
            <a
              href={`https://cloudinary.com/documentation/cloudinary_sdks?utm_source=${event.utm.source}&utm_medium=${event.utm.medium}&utm_campaign=${event.utm.campaign}`}
            >
              wide variety of SDKs
            </a>{' '}
            including Node, Ruby, and PHP, you can easily construct your URLs dynamically as you&apos;re building
            experiences for your apps and web projects.
          </p>

          {Object.keys(filters).length > 0 && (
            <>
              <h2>Filters</h2>

              <div className={styles.filters}>
                {Object.keys(filters).map((key) => {
                  const { id: filterId, title: filterTitle, transformations = [], effects = [] } = filters[key];
                  return (
                    <div key={filterId} className={styles.filter}>
                      <h3 className={styles.filterTitle}>{filterTitle}</h3>
                      {transformations.length > 0 && (
                        <div className={styles.transformations}>
                          <h4>Transformations</h4>
                          {transformations.map((transformation) => {
                            const definitions = parseTransformationStringToReadable(transformation);
                            return (
                              <ul key={transformation} className={styles.transformation}>
                                {definitions.map((definition) => {
                                  return (
                                    <li
                                      key={`${filterTitle}-${definition.id || definition.value}`}
                                      className={styles.definition}
                                    >
                                      <p className={styles.definitionDetails}>
                                        <strong className={styles.definitionTitle}>{definition.name}:</strong>
                                        <code
                                          className={styles.definitionRule}
                                        >{`${definition.id}_${definition.value}`}</code>
                                      </p>
                                      <p className={styles.definitionDescription}>{definition.description}</p>
                                    </li>
                                  );
                                })}
                              </ul>
                            );
                          })}
                        </div>
                      )}
                      {effects.length > 0 && (
                        <div className={styles.transformations}>
                          <h4>Effects</h4>
                          {effects.map((effect) => {
                            const definitions = parseTransformationStringToReadable(effect);
                            return (
                              <ul key={effect} className={styles.transformation}>
                                {definitions.map((definition) => {
                                  const effectDefinition = parseEffectsStringToReadable(definition.value);
                                  return (
                                    <li
                                      key={`${filterTitle}-${definition.id || definition.value}`}
                                      className={styles.definition}
                                    >
                                      <p className={styles.definitionDetails}>
                                        <strong className={styles.definitionTitle}>{effectDefinition.name}:</strong>
                                        <code
                                          className={styles.definitionRule}
                                        >{`${definition.id}_${definition.value}`}</code>
                                      </p>
                                      <p className={styles.definitionDescription}>
                                        Artistic filter <em>{effectDefinition.value}</em>
                                      </p>
                                    </li>
                                  );
                                })}
                              </ul>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </>
          )}
        </Container>
      </Section>

      <Section className={styles.sectionFeedback}>
        <Container>
          <h2>What do you think of CloudyCam?</h2>
          <p>Good, bad, we want to know!</p>
          <p>
            <Button href="https://forms.monday.com/forms/9ed040a16978571e6ab92cdb59103b1d?r=use1">
              Submit Feedback
            </Button>
          </p>
        </Container>
      </Section>
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

  const ogImageUrl = cloudinary.url(`${CLOUDINARY_ASSETS_FOLDER}/social-background`, {
    width: 1012,
    height: 506,
    transformation: [
      {
        width: 1012,
        height: 506,
        fetch_format: 'auto',
        quality: 'auto',
      },
      {
        overlay: resource.public_id.replace('/', ':'),
      },
      {
        flags: 'layer_apply',
        width: 380,
        height: 380,
        gravity: 'west',
        x: 60,
        y: 0,
        radius: 50,
      },
    ],
  });

  return {
    props: {
      resource,
      original,
      filters,
      ogImageUrl,
    },
  };
}
