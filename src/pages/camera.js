import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import { FaCamera, FaTimes, FaUndo, FaShare, FaMagic, FaSpinner, FaStopwatch } from 'react-icons/fa';

import { useApp } from '@hooks/useApp';
import { useCamera } from '@hooks/useCamera';
import { useCloudinaryUpload } from '@hooks/useCloudinaryUpload';
import { useFilters } from '@hooks/useFilters';

import { event as pushEvent } from '@lib/gtag';
import {
  constructCloudinaryUrl,
  createHashtagBadgeTransformations,
  createLogoBadgeTransformations,
  createEventLogoTransformations,
} from '@lib/cloudinary';
import { sortByKey } from '@lib/util';

import Section from '@components/Section';
import Container from '@components/Container';
import Sidebar from '@components/Sidebar';
import SidebarTitle from '@components/SidebarTitle';
import Controls from '@components/Controls';
import Control from '@components/Control';
import Button from '@components/Button';
import CameraFilters from '@components/CameraFilters';
import Camera from '@components/Camera';
import CldImage from '@components/CldImage';

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

function delay({ total, callbackInterval, callback }) {
  let time = 0;

  function _delay() {
    setTimeout(() => {
      time = time + callbackInterval;

      callback(time);

      if (time < total) {
        _delay();
      }
    }, callbackInterval);
  }

  callback(time);
  _delay();
}

export default function PageCamera({ eventId: defaultEventId, eventImages }) {
  const router = useRouter();

  const [delayTimer, setDelayTimer] = useState();
  const activeTimer = !isNaN(delayTimer);

  const { eventId } = useApp({ eventId: defaultEventId });
  const event = events[eventId];

  const { image, hash, capture, reset: resetCamera } = useCamera();

  let activePublicId = image;

  // Clean up all images and effects when changing pages

  useEffect(() => {
    return () => {
      resetMain();
      resetTransparent();
      resetCamera();
      resetFilters();
    };
  }, [router.pathname]);

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
    transformation: [
      {
        width: 1024,
        crop: 'scale',
      },
    ],
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
    transformation: [
      {
        width: 1024,
        crop: 'scale',
      },
    ],
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

  const activeTransformations = [
    `l_${activePublicId?.replaceAll('/', ':')},w_1.0,h_1.0,fl_region_relative/fl_layer_apply`,
  ];

  sortByKey(types, 'applyOrder').forEach(({ id }) => {
    const filter = activeFilters.find((filter) => filter.type === id);
    filter?.transformations?.forEach((transformation) => {
      activeTransformations.push(transformation);
    });
  });

  createHashtagBadgeTransformations(event?.hashtags).forEach((transformation) => {
    activeTransformations.push(transformation);
  });

  createLogoBadgeTransformations(event?.hashtags).forEach((transformation) => {
    activeTransformations.push(transformation);
  });

  if (event?.logo) {
    createEventLogoTransformations(event.logo).forEach((transformation) => {
      activeTransformations.push(transformation);
    });
  }

  const src = constructCloudinaryUrl({
    publicId: activePublicId,
    transformations: activeTransformations,
  });

  // We want to make sure that we're not showing the webcam if we already have an image to work with

  const allowCapture = !image && !activePublicId;

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
   * handleDelayCapture
   * @description Triggers after 5 seconds
   */

  async function handleDelayCapture() {
    delay({
      total: 5000,
      callbackInterval: 1000,
      callback: (time) => {
        setDelayTimer(5000 - time);

        if (time >= 5000) {
          capture();
          setDelayTimer(undefined);
        }
      },
    });
  }

  /**
   * handleOnShare
   * @description Triggers an upload of the current state of transformations
   */

  async function handleOnShare() {
    const results = await uploadShare({
      image: src,
      publicId: hash && `${hash}-transformation`,
      context: {
        original_public_id: dataMain?.public_id,
        cloudycam_filters: JSON.stringify(activeFilters),
      },
    });

    const { public_id } = results;

    router.push(`/share/${public_id.replace(CLOUDINARY_UPLOADS_FOLDER + '/', '')}?eventId=${eventId}`);
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
            {!allowCapture && (
              <CldImage
                className={styles.camera}
                src={activePublicId}
                width={CAMERA_WIDTH}
                height={CAMERA_HEIGHT}
                rawTransformations={activeTransformations}
              />
            )}
            {allowCapture && <Camera className={styles.camera} src={src} controls={false} />}

            <Sidebar>
              {allowCapture && (
                <>
                  <SidebarTitle>First step? Take a picture!</SidebarTitle>
                  <p>We&apos;ll give you filters and effects powered by Cloudinary that you can add to your photo.</p>
                  <Controls data-can-capture={allowCapture}>
                    <Control>
                      <Button
                        onClick={capture}
                        color="cloudinary-yellow"
                        shape="capsule"
                        iconPosition="left"
                        disabled={activeTimer}
                      >
                        <FaCamera />
                        <span>Capture</span>
                      </Button>
                    </Control>
                    <Control>
                      <Button
                        onClick={handleDelayCapture}
                        color="cloudinary-blue"
                        shape="capsule"
                        iconPosition="left"
                        disabled={activeTimer}
                      >
                        <FaStopwatch />
                        {!activeTimer && <span>Capture in 5</span>}
                        {activeTimer && <span>{delayTimer / 1000}</span>}
                      </Button>
                    </Control>
                  </Controls>
                </>
              )}
              {!allowCapture && (
                <>
                  <Controls data-can-capture={allowCapture}>
                    <Control className={styles.controlShare}>
                      <Button
                        color="cloudinary-yellow"
                        shape="capsule"
                        iconPosition="left"
                        onClick={handleOnShare}
                        disabled={activeFilters.length === 0}
                        data-is-loading={stateShare?.loading || stateShare?.loaded}
                      >
                        {(stateMain?.loading || stateShare?.loading || stateShare?.loaded) && <FaSpinner />}
                        {!stateMain?.loading && !stateShare?.loading && !stateShare?.loaded && <FaShare />}
                        <span>Share</span>
                      </Button>
                      {activeFilters.length === 0 && (
                        <p className={styles.controlNote}>Add a filter or randomize to get started!</p>
                      )}
                    </Control>
                    <Control>
                      <Button onClick={handleOnRemix} shape="link" iconPosition="left">
                        <FaMagic />
                        <span>Randomize</span>
                      </Button>
                    </Control>
                    <Control>
                      <Button onClick={handleOnClearFilters} shape="link" iconPosition="left" iconSize="large">
                        <FaTimes />
                        <span>Clear Filters</span>
                      </Button>
                    </Control>
                    <Control>
                      <Button onClick={handleOnReset} color="cloudinary-orange" shape="link" iconPosition="left">
                        <FaUndo />
                        <span>Start Over</span>
                      </Button>
                    </Control>
                  </Controls>
                </>
              )}
            </Sidebar>
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
