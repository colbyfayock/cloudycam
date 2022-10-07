import { useRouter } from 'next/router';
import Head from 'next/head';
import { CldImage } from 'next-cloudinary';
import { FaCamera, FaTimes, FaUndo, FaShare, FaMagic, FaSpinner } from 'react-icons/fa';

import { useApp } from '@hooks/useApp';
import { useCamera } from '@hooks/useCamera';
import { useCloudinaryUpload } from '@hooks/useCloudinaryUpload';
import { useFilters } from '@hooks/useFilters';

import { event as pushEvent } from '@lib/gtag';
import { constructCldUrl } from '@lib/cloudinary';

import Section from '@components/Section';
import Container from '@components/Container';
import Button from '@components/Button';
import CameraFilters from '@components/CameraFilters';
import Camera from '@components/Camera';

import {
  CLOUDINARY_UPLOADS_FOLDER,
  CLOUDINARY_TAG_ASSET,
  CLOUDINARY_TAG_ASSET_ORIGINAL,
  CLOUDINARY_TAG_ASSET_TRANSPARENT,
  CLOUDINARY_TAG_ASSET_TRANSFORMATION,
} from '@data/cloudinary';
import { CAMERA_WIDTH, CAMERA_HEIGHT } from '@data/camera';
import { events } from '@data/events';

import styles from '@styles/Camera.module.scss';

export default function PageCamera({ eventId: defaultEventId, eventImages }) {
  const router = useRouter();

  const { eventId = defaultEventId } = useApp();
  const event = events[eventId];

  const { image, hash, capture, reset: resetCamera } = useCamera();

  let activePublicId = image;
  let src;

  // Once we have an image stored, attempt to upload it to Cloudinary

  const {
    data: dataMain,
    reset: resetMain,
    state: stateMain,
  } = useCloudinaryUpload({
    image,
    publicId: hash,
    tags: [`event-${eventId}`, CLOUDINARY_TAG_ASSET, CLOUDINARY_TAG_ASSET_ORIGINAL],
    context: {
      event_id: eventId,
    },
  });

  // const dataMain = {
  //   public_id: 'cloudycam-assets/default-photo',
  //   secure_url:
  //     'https://res.cloudinary.com/colbycloud-cloudycam/image/upload/v1650471224/cloudycam-assets/default-photo.jpg',
  // };

  // After a successful Cloudinary upload, try to upload it again with
  // background removal to use for background effects

  const { data: dataTransparent, reset: resetTransparent } = useCloudinaryUpload({
    image: dataMain?.secure_url,
    publicId: hash && `${hash}-transparent`,
    tags: [`event-${eventId}`, CLOUDINARY_TAG_ASSET, CLOUDINARY_TAG_ASSET_TRANSPARENT],
    context: {
      original_public_id: dataMain?.public_id,
    },
    options: {
      background_removal: 'cloudinary_ai',
    },
  });

  // const dataTransparent = {
  //   public_id: 'cloudycam-assets/default-photo-transparent',
  //   secure_url:
  //     'https://res.cloudinary.com/colbycloud-cloudycam/image/upload/v1650470265/cloudycam-assets/default-photo-transparent.png',
  // };

  const { upload: uploadShare, state: stateShare } = useCloudinaryUpload({
    tags: [`event-${eventId}`, CLOUDINARY_TAG_ASSET, CLOUDINARY_TAG_ASSET_TRANSFORMATION],
    context: {
      event_id: eventId,
    },
  });

  // Filters

  const {
    filters,
    types,
    toggle: toggleFilter,
    randomize: randomizeFilters,
    reset: resetFilters,
  } = useFilters({
    backgroundReady: !!dataTransparent?.public_id,
  });
  const activeFilters = filters.filter(({ active }) => !!active);
  const hasBackgroundFilter = !!activeFilters?.find(({ type }) => type === 'backgrounds');

  // Determine the final active public ID that will be used to then construct the Cloudinary URL

  activePublicId = hasBackgroundFilter ? dataTransparent?.public_id : dataMain?.public_id;

  if (activePublicId) {
    src = constructCldUrl({
      publicId: activePublicId,
      publicIdTransparent: dataTransparent?.public_id,
      width: CAMERA_WIDTH,
      height: CAMERA_HEIGHT,
      filters: activeFilters,
      event,
    });
  }

  // We want to make sure that we're not showing the webcam if we already have an image to work with

  const canCapture = !image && !activePublicId;

  // Construct props to use as data attributes that allow the ability to target different
  // loading states with styling

  const assetState = { main: dataMain, transparent: dataTransparent };
  const assetStateProps = {};

  Object.keys(assetState).forEach((assetKey) => {
    assetState[assetKey] &&
      Object.keys(assetState[assetKey]).forEach((stateKey) => {
        assetStateProps[`data-${assetKey}-${stateKey}`] = assetState[assetKey][stateKey];
      });
  });

  /**
   * handleOnShare
   * @description Triggers an upload of the current state of transformations
   */

  async function handleOnShare() {
    const { public_id } = await uploadShare({
      image: src,
      publicId: hash && `${hash}-transformation`,
      context: {
        original_public_id: dataMain?.public_id,
        cloudycam_filters: JSON.stringify(activeFilters),
      },
    });
    router.push(`/share/${public_id.replace(CLOUDINARY_UPLOADS_FOLDER + '/', '')}`);
  }

  /**
   * handleOnFilterSelect
   */

  function handleOnFilterSelect({ filterId, filterType }) {
    toggleFilter({ filterId, filterType });
    pushEvent({
      action: 'click',
      category: 'camera',
      label: `toggle | ${filterId} | ${filterType} | ${filters[filterId] ? 'off' : 'on'}`,
    });
  }

  /**
   * handleOnRemix
   * @description Grabs a random set of filters to apply
   */

  function handleOnRemix(e) {
    e.preventDefault();

    randomizeFilters();

    pushEvent({
      action: 'click',
      category: 'camera',
      label: 'remix',
    });
  }

  /**
   * handleOnClearFilters
   * @description Clear only the filters
   */

  function handleOnClearFilters() {
    resetFilters();

    pushEvent({
      action: 'click',
      category: 'camera',
      label: 'clear filters',
    });
  }

  /**
   * handleOnReset
   * @description Resets all application state
   */

  function handleOnReset() {
    resetMain();
    resetTransparent();
    resetCamera();
    resetFilters();

    pushEvent({
      action: 'click',
      category: 'camera',
      label: 'reset',
    });
  }

  return (
    <>
      <Head>
        <title>CloudyCam</title>
        <meta name="description" content="From Cloudinary" />
      </Head>
      <div {...assetStateProps}>
        <Section className={styles.cameraHeroSection}>
          <Container className={styles.cameraHeroContainer}>
            <Camera className={styles.camera} src={src} controls={false} />

            <div className={styles.sidebar}>
              {canCapture && (
                <>
                  <h2>First step? Take a picture!</h2>
                  <p>We&apos;ll give you filters and effects powered by Cloudinary that you can add to your photo.</p>
                  <ul className={styles.controls} data-can-capture={canCapture}>
                    <li className={styles.control}>
                      <Button onClick={capture} color="cloudinary-yellow" shape="capsule" iconPosition="left">
                        <FaCamera />
                        <span>Capture</span>
                      </Button>
                    </li>
                  </ul>
                </>
              )}
              {!canCapture && (
                <>
                  <ul className={styles.controls} data-can-capture={canCapture}>
                    <li className={`${styles.control} ${styles.controlShare}`}>
                      <Button
                        color="cloudinary-yellow"
                        shape="capsule"
                        iconPosition="left"
                        onClick={handleOnShare}
                        disabled={stateShare?.loading || stateShare?.loaded}
                        data-is-loading={stateShare?.loading || stateShare?.loaded}
                      >
                        {(stateMain?.loading || stateShare?.loading || stateShare?.loaded) && <FaSpinner />}
                        {!stateShare?.loading && !stateShare?.loaded && <FaShare />}
                        <span>Share</span>
                      </Button>
                    </li>
                    <li className={styles.control}>
                      <Button onClick={handleOnRemix} shape="link" iconPosition="left">
                        <FaMagic />
                        <span>Randomize</span>
                      </Button>
                    </li>
                    <li className={styles.control}>
                      <Button onClick={handleOnClearFilters} shape="link" iconPosition="left" iconSize="large">
                        <FaTimes />
                        <span>Clear Filters</span>
                      </Button>
                    </li>
                    <li className={styles.control}>
                      <Button onClick={handleOnReset} color="cloudinary-orange" shape="link" iconPosition="left">
                        <FaUndo />
                        <span>Start Over</span>
                      </Button>
                    </li>
                  </ul>
                </>
              )}
            </div>
          </Container>
        </Section>

        {!dataMain && Array.isArray(eventImages) && eventImages.length > 0 && (
          <Section className={styles.cameraBodySection}>
            <Container>
              <h2 className={styles.eventGalleryTitle}>
                Who else is at <strong>#{event?.hashtags?.[0]}</strong>? 👀
              </h2>

              <ul className={styles.eventGalleryImages}>
                {eventImages.map(({ publicId }) => {
                  return (
                    <li key={publicId}>
                      <CldImage src={publicId} width={700} height={700} alt="" />
                    </li>
                  );
                })}
              </ul>
            </Container>
          </Section>
        )}

        {dataMain && (
          <Section className={styles.cameraBodySection}>
            <Container>
              <CameraFilters
                filters={filters}
                types={types}
                srcMain={dataMain}
                srcTransparent={dataTransparent}
                onFilterSelect={handleOnFilterSelect}
              />
            </Container>
          </Section>
        )}
      </div>

      {/* <style global jsx>{`
        html,
        body {
          width: 100vw;
          height: 100vh;
          max-height: -webkit-fill-available;
          overflow: hidden;
        }
        #__next {
          width: 100%;
          height: 100%;
        }
      `}</style> */}
    </>
  );
}
