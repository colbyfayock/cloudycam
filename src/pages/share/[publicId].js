import { useEffect, useRef } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { v2 as cloudinary } from 'cloudinary';
import { FaCamera, FaTwitter } from 'react-icons/fa';

import {
  constructCloudinaryUrl,
  parseTransformationStringToReadable,
  parseEffectsStringToReadable,
} from '@lib/cloudinary';
import { createTweetAction, openTweet } from '@lib/social';
import * as gtag from '@lib/gtag';

import { useApp } from '@hooks/useApp';

import Section from '@components/Section';
import Container from '@components/Container';
import Sidebar from '@components/Sidebar';
import SidebarTitle from '@components/SidebarTitle';
import Controls from '@components/Controls';
import Control from '@components/Control';
import Button from '@components/Button';
import CldImage from '@components/CldImage';

import { CLOUDINARY_UPLOADS_FOLDER, CLOUDINARY_ASSETS_FOLDER } from '@data/cloudinary';
import { events } from '@data/events';
import { CAMERA_WIDTH, CAMERA_HEIGHT } from '@data/camera';

import styles from '@styles/Share.module.scss';

export default function Share({ resource, original, filters, ogImageUrl }) {
  const cloudinarySectionRef = useRef();
  const router = useRouter();

  const { eventId: appEventId, host } = useApp();

  const eventId = router.query?.eventId || appEventId;

  const event = events[eventId || 'default'];

  const shareUrl = host && `${host}${router.asPath}`;
  const downloadUrl = constructCloudinaryUrl({
    publicId: resource.public_id,
    format: 'jpg',
  });

  // const [downloadData, updateDownloadData] = useState();

  useEffect(() => {
    (async function run() {
      // Once the page loads, attempt to download the image and convert it
      // to a blob to allow for easy download
      // const data = await fetch(downloadUrl);
      // const blob = await data.blob();
      // const objectUrl = URL.createObjectURL(blob);
      // updateDownloadData({
      //   blob,
      //   objectUrl,
      // });
    })();
  }, [downloadUrl]);

  // Attempt to pre-load the OG image URL to hopefully help issues
  // with Twitter not correctly loading images on first share

  useEffect(() => {
    (async function run() {
      await fetch(ogImageUrl);
    })();
  }, [ogImageUrl]);

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
        'Transformed with #CloudyCam by @cloudinary!',
        '',
        'Create your transformations below 👇',
        ...(event.hashtags ? ['', event.hashtags.map((hashtag) => `#${hashtag}`).join(' ')] : []),
        '',
        shareUrl,
      ],
      related: ['Cloudinary'],
    });

    openTweet({
      message: twitterAction,
    });

    handleOnShare();
  }

  /**
   * handleOnMailClick
   */

  // function handleOnMailClick(e) {
  //   e.preventDefault();

  //   gtag.event({
  //     action: 'click',
  //     category: 'share',
  //     label: 'mail',
  //   });

  //   handleOnShare();
  // }

  /**
   * handleOnMailClick
   */

  function handleOnShare() {
    cloudinarySectionRef.current.scrollIntoView({
      behavior: 'smooth',
    });
  }

  return (
    <div className={styles.sharePage}>
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

      <Section className={styles.cameraHeroSection}>
        <Container className={styles.cameraHeroContainer}>
          <CldImage
            className={styles.camera}
            src={resource.public_id}
            width={CAMERA_WIDTH}
            height={CAMERA_HEIGHT}
            alt="Transfomered by Cloudinary"
          />
          <Sidebar>
            <SidebarTitle className={styles.sidebarTitle}>Share Your Creation</SidebarTitle>
            <Controls className={styles.shareControls}>
              <Control>
                <Button color="twitter-blue" iconPosition="left" shape="capsule-tall" onClick={handleOnTwitterClick}>
                  <FaTwitter />
                  <span>Twitter</span>
                </Button>
              </Control>
              {/* <Control>
                <Button color="cloudinary-orange" iconPosition="left" shape="capsule-tall" onClick={handleOnMailClick}>
                  <span>Email</span>
                </Button>
              </Control> */}
              {/* <Control>
                <Button
                  href={downloadData?.objectUrl}
                  color="cloudinary-blue"
                  iconPosition="left"
                  shape="capsule-tall"
                  onClick={handleOnShare}
                  download
                  target="_blank"
                  disabled={!downloadData?.objectUrl}
                >
                  <span>Download</span>
                </Button>
              </Control> */}
            </Controls>
            <SidebarTitle className={styles.sidebarTitle}>Open on your Device</SidebarTitle>
            <p className={styles.shareQr}>
              {shareUrl && (
                <CldImage
                  src={`qr/${encodeURIComponent(shareUrl)}`}
                  width="600"
                  height="600"
                  format="svg"
                  rawTransformations={['e_bgremoval:rgb:ffffff', 'e_colorize:100,co_white', 'e_vectorize:detail:1.0']}
                />
              )}
            </p>
          </Sidebar>
        </Container>
      </Section>

      <Section className={styles.newPhotoSection}>
        <Container className={styles.newPhotoContainer}>
          <h2>Want to take a new one?</h2>
          <ul>
            <li>
              <Link href={eventId && eventId !== 'default' ? `/${eventId}` : '/camera'} passHref={true}>
                <Button color="cloudinary-yellow" iconPosition="left" shape="capsule">
                  <FaCamera /> New Photo
                </Button>
              </Link>
            </li>
          </ul>
        </Container>
      </Section>

      <Section ref={cloudinarySectionRef} className={styles.cloudinarySection}>
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
            <img className={styles.cloudinaryImageOverlay} src={original.secure_url} alt="Transformed Image" />
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
    </div>
  );
}

export async function getStaticProps({ params }) {
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
        radius: 10,
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

export async function getStaticPaths() {
  return {
    paths: [],
    fallback: 'blocking',
  };
}
