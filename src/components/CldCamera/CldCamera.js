import { useState, useEffect } from 'react';
import { Cloudinary } from '@cloudinary/url-gen';
import { FaCamera, FaTimes } from 'react-icons/fa';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';

import { useCamera } from '@hooks/useCamera';

import Camera from '@components/Camera';
import Button from '@components/Button';

import { FILTERS_ART, FILTERS_OVERLAYS } from '@data/filters';

import styles from './CldCamera.module.scss';

const FILTER_THUMB_WIDTH = 100;
const FILTER_THUMB_HEIGHT = 100;

const artFilters = FILTERS_ART.map(f => ({ name: f, type: 'art' }));

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

const CldCamera = ({ ...props }) => {
  const [cldData, setCldData] = useState(DEFAULT_CLD_DATA);

  const [filter, setFilter] = useState();

  const { ref, image, capture, reset } = useCamera();

  const isDefaultPhoto = cldData?.public_id === DEFAULT_CLD_DATA.public_id;
  let src;

  if ( cldData.public_id && ( !isDefaultPhoto || filter )  ) {
    const cloudImage = cld.image(cldData.public_id).format('auto').quality('auto');

    if ( filter?.transformations ) {
      filter.transformations.forEach(transformation => {
        cloudImage.addTransformation(transformation);
      });
    } else if ( filter ) {
      cloudImage.effect(`e_${filter.type}:${filter.name}`);
    }

    src = cloudImage.toURL();
  }

  const canCapture = !image && !(isDefaultPhoto && filter);

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

  function handleOnReset() {
    setFilter(undefined);
    reset();
  }

  return (
    <div className={styles.container}>
      <Camera {...props} className={styles.camera} src={src} controls={false} />

      <div className={styles.actions}>

        <div className={styles.effects}>

          <Tabs>

            <TabList className={styles.effectsHeaders}>
              <Tab>Overlays</Tab>
              <Tab>Art Filters</Tab>
            </TabList>

            <TabPanel className={styles.effectsPanel}>
              <ul className={styles.filters}>
                {FILTERS_OVERLAYS.map(overlayFilter => {
                  let thumb = cld.image(cldData.public_id)
                                  .format('auto')
                                  .quality('auto')
                                  .resize(`w_${FILTER_THUMB_WIDTH},h_${FILTER_THUMB_HEIGHT}`);

                  overlayFilter.transformations.forEach(transformation => {
                    thumb.addTransformation(transformation);
                  });

                  thumb = thumb.toURL();

                  return (
                    <li key={overlayFilter.title} data-is-active-filter={overlayFilter.title === filter?.title}>
                      <button className={styles.filterThumb} onClick={() => setFilter(overlayFilter)}>
                        <span className={styles.filterThumbImage}>
                          <img width={FILTER_THUMB_WIDTH} height={FILTER_THUMB_HEIGHT} src={thumb} alt={overlayFilter.name} />
                        </span>
                        <span>{ overlayFilter.title }</span>
                      </button>
                    </li>
                  )
                })}
              </ul>
            </TabPanel>

            <TabPanel className={styles.effectsPanel}>
              <ul className={styles.filters}>
                {artFilters.map(artFilter => {
                  const thumb = cld.image(cldData.public_id)
                                  .format('auto')
                                  .quality('auto')
                                  .resize(`w_${FILTER_THUMB_WIDTH},h_${FILTER_THUMB_HEIGHT}`)
                                  .effect(`e_${artFilter.type}:${artFilter.name}`)
                                  .toURL();
                  return (
                    <li key={artFilter.name} data-is-active-filter={artFilter.name === filter?.name}>
                      <button className={styles.filterThumb} onClick={() => setFilter(artFilter)}>
                        <span className={styles.filterThumbImage}>
                          <img width={FILTER_THUMB_WIDTH} height={FILTER_THUMB_HEIGHT} src={thumb} alt={artFilter.name} />
                        </span>
                        <span>{ artFilter.name }</span>
                      </button>
                    </li>
                  )
                })}
              </ul>
            </TabPanel>

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