import { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import { FaCamera, FaTimes, FaShare, FaMagic, FaSpinner } from 'react-icons/fa';

// https://github.com/reactjs/react-tabs/issues/56#issuecomment-791029642
const Tabs = dynamic(
  import('react-tabs').then((mod) => mod.Tabs),
  { ssr: false }
);
import { Tab, TabList, TabPanel } from 'react-tabs';

import { useCamera } from '@hooks/useCamera';
import { uploadToCloudinary, constructCldUrl } from '@lib/cloudinary';
import { timeout } from '@lib/util';
import { event } from '@lib/gtag';

import Camera from '@components/Camera';
import Button from '@components/Button';
import CldImage from '@components/CldImage';

import { ALL_FILTERS, FILTER_TYPES } from '@data/filters';
import {
  CLOUDINARY_ASSETS_FOLDER,
  CLOUDINARY_TAG_ASSET,
  CLOUDINARY_TAG_ASSET_ORIGINAL,
  CLOUDINARY_TAG_ASSET_TRANSPARENT,
  CLOUDINARY_TAG_ASSET_TRANSFORMATION,
} from '@data/cloudinary';
import { CAMERA_WIDTH, CAMERA_HEIGHT, FILTER_THUMB_WIDTH, FILTER_THUMB_HEIGHT } from '@data/camera';

import styles from './CldCamera.module.scss';

const DEFAULT_CLD_DATA = {
  main: undefined,
  transparent: undefined,
};

const DEFAULT_ASSET_STATE = {
  main: {
    loading: false,
    loaded: false,
    error: false,
  },
  transparent: {
    loading: false,
    loaded: false,
    error: false,
  },
  share: {
    loading: false,
    loaded: false,
    error: false,
  },
};

const DEFAULT_FILTERS = {};

const CldCamera = ({ onShare, ...props }) => {
  const [cldData, setCldData] = useState(DEFAULT_CLD_DATA);
  const [filters, setFilters] = useState(DEFAULT_FILTERS);
  const [assetState, setAssetState] = useState(DEFAULT_ASSET_STATE);
  const [shareData, updateShareData] = useState();

  const { image, hash, capture, reset } = useCamera();

  const hasBackgroundFilter = Object.keys(filters).find((key) => filters[key].type === 'backgrounds');

  let src, cloudImageId;

  // If we have any of the background filters applied attempt to use the transparent ID if available
  // for background effects. If it's not available, fall back to the main ID no matter the case until
  // it loads and refreshes state

  if (hasBackgroundFilter && cldData?.transparent) {
    cloudImageId = cldData.transparent.public_id;
  } else if (cldData?.main) {
    cloudImageId = cldData.main.public_id;
  }

  // If we have a Cloudinary Public ID assigned, use it to start to construct
  // an image URL

  if (cloudImageId) {
    src = constructCldUrl({
      publicId: cloudImageId,
      width: CAMERA_WIDTH,
      height: CAMERA_HEIGHT,
      filters,
    });
  }

  // Determines whether or not the webcam should be active for capture mode

  const canCapture = !image && !cloudImageId;

  // Construct props to use as data attributes that allow the ability to target different
  // loading states with styling

  const assetStateProps = {};

  Object.keys(assetState).forEach((assetKey) => {
    Object.keys(assetState[assetKey]).forEach((stateKey) => {
      assetStateProps[`data-${assetKey}-${stateKey}`] = assetState[assetKey][stateKey];
    });
  });

  // Once we have an image stored, attempt to upload it to Cloudinary

  useEffect(() => {
    if (!image || !hash) {
      setCldData(DEFAULT_CLD_DATA);
      return;
    }

    setAssetState((prev) => {
      return {
        ...prev,
        main: {
          loading: true,
          loaded: false,
          error: false,
        },
        transparent: {
          loading: true,
          loaded: false,
          error: false,
        },
      };
    });

    (async function run() {
      try {
        const results = await uploadToCloudinary(image, {
          tags: [CLOUDINARY_TAG_ASSET, CLOUDINARY_TAG_ASSET_ORIGINAL],
          options: {
            public_id: hash,
          },
        });

        setCldData({
          main: results,
          transparent: undefined,
        });

        setAssetState((prev) => {
          return {
            ...prev,
            main: {
              loading: false,
              loaded: true,
              error: false,
            },
          };
        });
      } catch (e) {
        setAssetState((prev) => {
          return {
            ...prev,
            main: {
              loading: false,
              loaded: false,
              error: true,
            },
          };
        });
      }
    })();
  }, [image, hash]);

  // After a successful Cloudinary upload, try to upload it again with
  // background removal to use for background effects

  useEffect(() => {
    if (!cldData?.main || cldData?.transparent) {
      return;
    }

    setAssetState((prev) => {
      return {
        ...prev,
        transparent: {
          loading: true,
          loaded: false,
          error: false,
        },
        // Additionally set the share state to not loading
        // since we successfully have an asset to share, but
        // set loaded to false as we're using it to control
        // the initial loading UI
        share: {
          loading: false,
          loaded: false,
          error: false,
        },
      };
    });

    (async function run() {
      /* eslint-disable no-inner-declarations */
      try {
        const transparentPublicId = `${hash}-transparent`;

        let results = await uploadToCloudinary(cldData.main.secure_url, {
          tags: [CLOUDINARY_TAG_ASSET, CLOUDINARY_TAG_ASSET_TRANSPARENT],
          context: {
            original_public_id: cldData.main.public_id,
          },
          options: {
            public_id: transparentPublicId,
            background_removal: 'cloudinary_ai',
          },
        });

        async function checkStatus() {
          const resource = await fetch(`/api/cloudinary/resource/?publicId=${results.public_id}`).then((r) => r.json());

          // If the share state is loading, that means that we are trying to load
          // and redirect the user to the share page, so stop trying to load the
          // transparenet image

          if (assetState.share.loading) {
            return;
          }

          if (resource.info.background_removal.cloudinary_ai.status === 'pending') {
            await timeout(100);
            return await checkStatus();
          }

          return resource;
        }

        try {
          const backgroundRemovalResource = await checkStatus();

          if (
            backgroundRemovalResource &&
            backgroundRemovalResource.info.background_removal.cloudinary_ai.status !== 'complete'
          ) {
            throw new Error('Failed to remove background');
          }

          results = backgroundRemovalResource;
        } catch (e) {
          console.log('Failed to check status.', e);
          return;
        }

        if (!results) {
          setCldData((prev) => {
            return {
              ...prev,
              transparent: results,
            };
          });
        }

        setAssetState((prev) => {
          return {
            ...prev,
            transparent: {
              loading: false,
              loaded: true,
              error: false,
            },
          };
        });
      } catch (e) {
        setAssetState((prev) => {
          return {
            ...prev,
            transparent: {
              loading: false,
              loaded: false,
              error: true,
            },
          };
        });
      }
    })();
  }, [cldData, hash]);

  // Once our share data has finished loading we want to trigger the
  // onShare function that can handle any post-load capabilities

  useEffect(() => {
    if (!assetState?.share?.loaded || !shareData) return;

    if (typeof onShare === 'function') {
      onShare({
        publicId: shareData.publicId,
        resource: shareData.data,
      });
    }
  }, [assetState.share.loaded, shareData]);

  /**
   * handleOnCapture
   */

  function handleOnCapture(e) {
    capture(e);
    setAssetState((prev) => {
      return {
        ...prev,
        share: {
          loading: true,
          loaded: false,
          error: false,
        },
      };
    });
  }

  /**
   * handleOnShare
   * @description Triggers an upload of the current state of transformations
   */

  async function handleOnShare() {
    const sharePublicId = `${hash}-transformation`;

    setAssetState((prev) => {
      return {
        ...prev,
        share: {
          loading: true,
          loaded: false,
          error: false,
        },
      };
    });

    let results;

    try {
      results = await uploadToCloudinary(src, {
        context: {
          original_public_id: cldData.main.public_id,
          cloudycam_filters: JSON.stringify(filters),
        },
        tags: [CLOUDINARY_TAG_ASSET, CLOUDINARY_TAG_ASSET_TRANSFORMATION],
        options: {
          public_id: sharePublicId,
        },
      });

      setAssetState((prev) => {
        return {
          ...prev,
          share: {
            loading: false,
            loaded: true,
            error: false,
          },
        };
      });
    } catch (e) {
      setAssetState((prev) => {
        return {
          ...prev,
          share: {
            loading: false,
            loaded: false,
            error: true,
          },
        };
      });
      return;
    }

    updateShareData({
      publicId: sharePublicId,
      data: results,
    });
  }

  /**
   * onRemix
   * @description Grabs a random set of filters to apply
   */

  function onRemix(e) {
    e.preventDefault();

    event({
      action: 'click',
      category: 'camera',
      label: 'remix',
    });

    const filters = FILTER_TYPES.map(({ id: typeId }) => {
      const availableFilters = ALL_FILTERS.filter(({ type }) => type === typeId);
      const random = availableFilters.sort(() => 0.5 - Math.random())[0];
      return random;
    });

    filters.forEach(({ id }) => toggleFilter(id));
  }

  /**
   * handleOnReset
   * @description Resets all application state
   */

  function handleOnReset() {
    event({
      action: 'click',
      category: 'camera',
      label: 'reset',
    });
    setFilters(DEFAULT_FILTERS);
    setCldData(DEFAULT_CLD_DATA);
    setAssetState(DEFAULT_ASSET_STATE);
    reset();
  }

  /**
   * handleOnFilterSelect
   * @description Finds the selected filter's ID and toggles it on or off
   */

  function handleOnFilterSelect(e) {
    const filterId = e.currentTarget.dataset.filterId;

    event({
      action: 'click',
      category: 'camera',
      label: `filter | ${filterId}`,
    });

    toggleFilter(filterId);
  }

  /**
   * toggleFilter
   * @description Given a filter's ID, attempt to switch it on or off based on current state
   */

  function toggleFilter(filterId) {
    const filter = ALL_FILTERS.find(({ id }) => id === filterId);

    event({
      action: 'click',
      category: 'camera',
      label: `toggle | ${filter.id}`,
    });

    setFilters((prev) => {
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

      if (!prev[filter.id]) {
        next[filter.id] = filter;
      }

      return next;
    });
  }

  return (
    <div className={styles.container} {...assetStateProps}>
      <Camera {...props} className={styles.camera} src={src} controls={false} />

      <div className={styles.actions}>
        <div className={styles.effects} data-effects-active={!!cldData.main?.public_id}>
          <Tabs key={`${cldData.main?.public_id}-${cldData.transparent?.public_id}`}>
            <div className={styles.effectsHeaders}>
              <TabList>
                {FILTER_TYPES.map((type) => {
                  const isActive = typeof type.checkActive === 'function' ? type.checkActive(cldData) : true;
                  return (
                    <Tab key={type.id} disabled={!cldData?.main || !isActive} data-type={type.id}>
                      {type.title}
                    </Tab>
                  );
                })}
              </TabList>
            </div>

            {FILTER_TYPES.map((type) => {
              const availableFilters = ALL_FILTERS.filter((filter) => filter.type === type.id);

              let publicId = cldData.main?.public_id;

              if (cldData.transparent && type.id === 'backgrounds') {
                publicId = cldData.transparent.public_id;
              }

              return (
                <TabPanel key={type.id} className={styles.effectsPanel}>
                  <ul className={styles.filters}>
                    {availableFilters.map((filter) => {
                      return (
                        <li key={filter.id} data-is-active-filter={!!filters[filter.id]}>
                          <button
                            className={styles.filterThumb}
                            data-filter-id={filter.id}
                            onClick={handleOnFilterSelect}
                          >
                            <span className={styles.filterThumbImage}>
                              <CldImage
                                src={publicId || `${CLOUDINARY_ASSETS_FOLDER}/transparent-1x1`}
                                width={FILTER_THUMB_WIDTH}
                                height={FILTER_THUMB_HEIGHT}
                                resize={{
                                  width: FILTER_THUMB_WIDTH * 2,
                                  height: FILTER_THUMB_HEIGHT * 2,
                                }}
                                transformations={filter.thumb?.transformations || filter.transformations}
                                effects={filter.thumb?.effects || filter.effects}
                                alt={filter.name}
                                watermark={false}
                              />
                            </span>
                            <span>{filter.title}</span>
                          </button>
                        </li>
                      );
                    })}
                  </ul>
                </TabPanel>
              );
            })}
          </Tabs>
        </div>

        <ul className={styles.controls} data-can-capture={canCapture}>
          {canCapture && (
            <>
              <li className={styles.control}>
                <Button onClick={handleOnCapture} color="cloudinary-yellow" shape="capsule" iconPosition="left">
                  <FaCamera />
                  <span>Capture</span>
                </Button>
              </li>
            </>
          )}
          {!canCapture && (
            <>
              <li className={`${styles.control} ${styles.controlCancel}`}>
                <Button onClick={handleOnReset} color="red" shape="circle">
                  <FaTimes />
                  <span className="sr-only">Reset Photo</span>
                </Button>
              </li>
              <li className={`${styles.control} ${styles.controlSecondary}`}>
                <Button onClick={onRemix} color="blue-800" shape="capsule" iconPosition="left">
                  <FaMagic />
                  <span>Remix</span>
                </Button>
              </li>
              <li className={`${styles.control} ${styles.controlShare}`}>
                <Button
                  color="cloudinary-yellow"
                  shape="capsule"
                  iconPosition="left"
                  onClick={handleOnShare}
                  disabled={assetState.share.loading || assetState.share.loaded}
                  data-is-loading={assetState.share.loading || assetState.share.loaded}
                >
                  {(assetState.share.loading || assetState.share.loaded) && <FaSpinner />}
                  {!assetState.share.loading && !assetState.share.loaded && <FaShare />}
                  <span>Share</span>
                </Button>
              </li>
            </>
          )}
        </ul>
      </div>
    </div>
  );
};

export default CldCamera;
