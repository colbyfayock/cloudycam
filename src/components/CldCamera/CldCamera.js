import { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import { Cloudinary } from '@cloudinary/url-gen';
import { FaCamera, FaTimes, FaImages } from 'react-icons/fa';

// https://github.com/reactjs/react-tabs/issues/56#issuecomment-791029642
const Tabs = dynamic(import('react-tabs').then(mod => mod.Tabs), { ssr: false });
import { Tab, TabList, TabPanel } from 'react-tabs';

import { useCamera } from '@hooks/useCamera';

import Camera from '@components/Camera';
import Button from '@components/Button';
import CldImage from '@components/CldImage';

import { ALL_FILTERS, FILTER_TYPES, FILTERS_STYLES, FILTERS_EFFECTS } from '@data/filters';
import { CLOUDINARY_ASSETS_FOLDER } from '@data/cloudinary';

import styles from './CldCamera.module.scss';

const FILTER_THUMB_WIDTH = 80;
const FILTER_THUMB_HEIGHT = 80;

const artFilters = FILTERS_STYLES.map(f => ({ name: f, type: 'art' }));

const cld = new Cloudinary({
  cloud: {
    cloudName: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME
  },
  url: {
    secure: true
  }
});

const DEFAULT_CLD_DATA = {
  main: undefined,
  transparent: undefined
};

const DEMO_CLD_DATA = {
  main: {
    public_id: `${CLOUDINARY_ASSETS_FOLDER}/default-photo`
  },
  transparent: {
    public_id: `${CLOUDINARY_ASSETS_FOLDER}/default-photo-transparent`
  },
  isDemo: true
}

const DEFAULT_ASSET_STATE = {
  main: {
    loading: false,
    loaded: false,
    error: false
  },
  transparent: {
    loading: false,
    loaded: false,
    error: false
  }
}

const DEFAULT_FILTERS = {};

const CldCamera = ({ ...props }) => {
  const [cldData, setCldData] = useState(DEFAULT_CLD_DATA);
  const [filters, setFilters] = useState(DEFAULT_FILTERS);
  const [assetState, setAssetState] = useState(DEFAULT_ASSET_STATE);

  const { isDemo = false } = cldData;

  const { image, hash, isActive, capture, reset } = useCamera();

  const hasFilters = Object.keys(filters).length > 0;
  const hasBackgroundFilter = Object.keys(filters).find(key => filters[key].type === 'backgrounds');

  let src, cloudImageId;
  const thumbnailPublicId = cldData?.main?.public_id || DEMO_CLD_DATA.main.public_id;

  // If we have any of the background filters applied attempt to use the transparent ID if available
  // for background effects. If it's not available, fall back to the main ID no matter the case until
  // it loads and refreshes state

  if ( hasBackgroundFilter && cldData?.transparent ) {
    cloudImageId = cldData.transparent.public_id;
  } else if ( cldData?.main ) {
    cloudImageId = cldData.main.public_id;
  }

  // If we have a Cloudinary Public ID assigned, use it to start to construct
  // an image URL

  if ( cloudImageId ) {
    const cloudImage = cld.image(cloudImageId).format('auto').quality('auto');

    // If filters are applied, work through them and add each one

    if ( hasFilters ) {
      Object.keys(filters).forEach(filterKey => {
        const filter = filters[filterKey];

        filter.transformations?.forEach(transformation => {
          cloudImage.addTransformation(transformation);
        });

        filter.effects?.forEach(effect => {
          cloudImage.effect(effect);
        });
      })
    }

    cloudImage.addTransformation(`l_${CLOUDINARY_ASSETS_FOLDER}:cloudinary_white,h_20,o_40,g_south_east,x_10,y_10`);

    src = cloudImage.toURL();
  }

  // Determines whether or not the webcam should be active for capture mode

  const canCapture = !image && !cloudImageId;

  // Construct props to use as data attributes that allow the ability to target different
  // loading states with styling

  const assetStateProps = {};

  Object.keys(assetState).forEach(assetKey => {
    Object.keys(assetState[assetKey]).forEach(stateKey => {
      assetStateProps[`data-${assetKey}-${stateKey}`] = assetState[assetKey][stateKey];
    });
  })

  // If a filter is selected but someone has yet to take an image, default to
  // demo mode and load demo data

  useEffect(() => {
    if ( hasFilters && !image ) {
      setCldData(DEMO_CLD_DATA);
    }
  }, [cloudImageId, hasFilters])

  // Once we have an image stored, attempt to upload it to Cloudinary

  useEffect(() => {
    if ( !image || !hash ) {
      setCldData(DEFAULT_CLD_DATA);
      return;
    }

    setAssetState(prev => {
      return {
        ...prev,
        main: {
          loading: true,
          loaded: false,
          error: false
        },
        transparent: {
          loading: true,
          loaded: false,
          error: false
        }
      }
    });

    (async function run() {
      try {
        const response = await fetch('/api/cloudinary/upload', {
          method: 'POST',
          body: JSON.stringify({
            image,
            options: {
              public_id: hash
            }
          })
        }).then(r => r.json());

        setCldData(prev => {
          return {
            main: response,
            transparent: undefined
          }
        });

        setAssetState(prev => {
          return {
            ...prev,
            main: {
              loading: false,
              loaded: true,
              error: false
            }
          }
        })
      } catch(e) {
        setAssetState(prev => {
          return {
            ...prev,
            main: {
              loading: false,
              loaded: false,
              error: true
            }
          }
        })
      }
    })();
  }, [image, hash]);

  // After a successful Cloudinary upload, try to upload it again with
  // background removal to use for background effects

  useEffect(() => {
    if ( !cldData?.main || cldData?.transparent ) {
      return;
    }

    setAssetState(prev => {
      return {
        ...prev,
        transparent: {
          loading: true,
          loaded: false,
          error: false
        }
      }
    });

    (async function run() {
      try {
        const transparentPublicId = `${hash}-transparent`;

        const response = await fetch('/api/cloudinary/upload', {
          method: 'POST',
          body: JSON.stringify({
            image: cldData.main.secure_url,
            options: {
              public_id: transparentPublicId,
              background_removal: 'cloudinary_ai',
            }
          })
        }).then(r => r.json());

        setCldData(prev => {
          return {
            ...prev,
            transparent: response
          }
        });

        setAssetState(prev => {
          return {
            ...prev,
            transparent: {
              loading: false,
              loaded: true,
              error: false
            }
          }
        })
      } catch(e) {
        setAssetState(prev => {
          return {
            ...prev,
            transparent: {
              loading: false,
              loaded: false,
              error: true
            }
          }
        })
      }
    })();
  }, [cldData]);

  /**
   * onEnableDemo
   * @description Resets state and applies demo data
   */

  function onEnableDemo() {
    handleOnReset();
    setCldData(DEMO_CLD_DATA);
  }

  /**
   * handleOnReset
   * @description Resets all application state
   */

  function handleOnReset() {
    console.log('reset')
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
    toggleFilter(filterId)
  }

  /**
   * toggleFilter
   * @description Given a filter's ID, attempt to switch it on or off based on current state
   */

  function toggleFilter(filterId) {
    const filter = ALL_FILTERS.find(({ id }) => id === filterId);

    setFilters(prev => {
      const next = {...prev};

      // Clear all filters with the same type to avoid multiple
      // overlapping filters that won't work properly

      Object.keys(next).forEach(key => {
        if ( next[key].type === filter.type ) {
          delete next[key];
        }
      });

      // If the previous state didn't have the new filter, make
      // sure to add it, but we don't need to worry about deleting
      // as it should be cleared in the above check

      if ( !prev[filter.id] ) {
        next[filter.id] = filter;
      }

      return next;
    });
  }

  return (
    <div className={styles.container} {...assetStateProps}>
      <Camera {...props} className={styles.camera} src={src} controls={false} />

      <div className={styles.actions}>

        <div className={styles.effects}>

          <Tabs key={`${cldData.main?.public_id}-${cldData.transparent?.public_id}`}>

            <div className={styles.effectsHeaders}>
              <TabList>
                {FILTER_TYPES.map(type => {
                  const isActive = typeof type.checkActive === 'function' ? type.checkActive(cldData) : true;
                  return <Tab key={type.id} disabled={!isActive} data-type={type.id}>{ type.title }</Tab>
                })}
              </TabList>
            </div>

            {FILTER_TYPES.map(type => {
              const availableFilters = ALL_FILTERS.filter(filter => filter.type === type.id);
              const publicId = cldData?.transparent && type.id === 'backgrounds' ? cldData.transparent.public_id : thumbnailPublicId;
              return (
                <TabPanel key={type.id} className={styles.effectsPanel}>
                  <ul className={styles.filters}>
                    {availableFilters.map(filter => {
                      return (
                        <li key={filter.id} data-is-active-filter={!!filters[filter.id]}>
                          <button className={styles.filterThumb} data-filter-id={filter.id} onClick={handleOnFilterSelect}>
                            <span className={styles.filterThumbImage}>
                              <CldImage
                                src={publicId}
                                width={FILTER_THUMB_WIDTH}
                                height={FILTER_THUMB_HEIGHT}
                                resize={{
                                  width: FILTER_THUMB_WIDTH * 2,
                                  height: FILTER_THUMB_HEIGHT * 2
                                }}
                                transformations={filter.thumb?.transformations || filter.transformations}
                                effects={filter.thumb?.effects || filter.effects}
                                alt={filter.name}
                              />
                            </span>
                            <span>{ filter.title }</span>
                          </button>
                        </li>
                      )
                    })}
                  </ul>
                </TabPanel>
              );
            })}

          </Tabs>
        </div>

        <ul className={styles.controls}>
          {canCapture && (
            <>
              <li className={`${styles.control} ${styles.controlDemo}`}>
                <Button onClick={onEnableDemo} color="blue-800" shape="capsule" iconPosition="left">
                  <FaImages />
                  <span>Try a Demo Image</span>
                </Button>
              </li>
              <li className={styles.control}>
                <Button onClick={capture} color="cloudinary-yellow" shape="circle">
                  <FaCamera />
                  <span className="sr-only">Capture Photo</span>
                </Button>
              </li>
            </>
          )}
          {!canCapture && (
            <li className={styles.control}>
              <Button onClick={handleOnReset} color="red" shape="circle">
                <FaTimes />
                <span className="sr-only">Reset Photo</span>
              </Button>
            </li>
          )}
        </ul>

      </div>
    </div>
  )
}

export default CldCamera;