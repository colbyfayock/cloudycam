import { useState, useEffect } from 'react';
import { Cloudinary } from '@cloudinary/url-gen';
import { FaCamera, FaTimes } from 'react-icons/fa';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';

import { useCamera } from '@hooks/useCamera';

import Camera from '@components/Camera';
import Button from '@components/Button';

import { ALL_FILTERS, FILTER_TYPES, FILTERS_STYLES, FILTERS_EFFECTS } from '@data/filters';

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
  public_id: 'cloudycam-assets/default-photo'
}

const DEFAULT_FILTERS = {};

const CldCamera = ({ ...props }) => {
  const [cldData, setCldData] = useState(DEFAULT_CLD_DATA);
  const [filters, setFilters] = useState(DEFAULT_FILTERS);

  const { ref, image, capture, reset } = useCamera();

  const hasFilters = Object.keys(filters).length > 0;
  const isDefaultPhoto = cldData?.public_id === DEFAULT_CLD_DATA.public_id;
  let src;

  if ( cldData.public_id ) {
    const cloudImage = cld.image(cldData.public_id).format('auto').quality('auto');

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

    src = cloudImage.toURL();
  }

  const canCapture = !image && !(isDefaultPhoto && hasFilters);

  useEffect(() => {
    if ( !image ) {
      setCldData(DEFAULT_CLD_DATA);
      return;
    }

    (async function run() {
      const response = await fetch('/api/cloudinary/upload', {
        method: 'POST',
        body: JSON.stringify({
          image
        })
      }).then(r => r.json());
      setCldData(response);
    })();
  }, [image]);

  /**
   * handleOnReset
   */

  function handleOnReset() {
    setFilters(DEFAULT_FILTERS);
    reset();
  }

  /**
   * handleOnFilterSelect
   */

  function handleOnFilterSelect(e) {
    const filterId = e.currentTarget.dataset.filterId;
    toggleFilter(filterId)
  }

  /**
   * toggleFilter
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

    reset();
  }

  return (
    <div className={styles.container}>
      <Camera {...props} className={styles.camera} src={src} controls={false} />

      <div className={styles.actions}>

        <div className={styles.effects}>

          <Tabs>

            <TabList className={styles.effectsHeaders}>
              {FILTER_TYPES.map(type => {
                return <Tab key={type.id}>{ type.title }</Tab>
              })}
            </TabList>

            {FILTER_TYPES.map(type => {
              const availableFilters = ALL_FILTERS.filter(filter => filter.type === type.id);
              return (
                <TabPanel key={type.id} className={styles.effectsPanel}>
                  <ul className={styles.filters}>
                    {availableFilters.map(filter => {
                      let thumb = cld.image(cldData.public_id)
                                      .format('auto')
                                      .quality('auto')
                                      .resize(`w_${FILTER_THUMB_WIDTH * 2},h_${FILTER_THUMB_HEIGHT * 2}`);

                      filter.transformations?.forEach(transformation => {
                        thumb.addTransformation(transformation);
                      });

                      filter.effects?.forEach(effect => {
                        thumb.effect(effect);
                      });

                      thumb = thumb.toURL();

                      return (
                        <li key={filter.id} data-is-active-filter={!!filters[filter.id]}>
                          <button className={styles.filterThumb} data-filter-id={filter.id} onClick={handleOnFilterSelect}>
                            <span className={styles.filterThumbImage}>
                              <img width={FILTER_THUMB_WIDTH} height={FILTER_THUMB_HEIGHT} src={thumb} alt={filter.name} />
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
            <li className={styles.control}>
              <Button onClick={capture} color="cloudinary-yellow">
                <FaCamera />
                <span className="sr-only">Capture Photo</span>
              </Button>
            </li>
          )}
          {!canCapture && (
            <li className={styles.control}>
              <Button onClick={handleOnReset} color="red">
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