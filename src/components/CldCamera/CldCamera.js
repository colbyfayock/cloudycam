import { useState, useEffect } from 'react';
import { Cloudinary } from '@cloudinary/url-gen';

import { useCamera } from '@hooks/useCamera';

import Camera from '@components/Camera';

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

const CldCamera = ({ className, ...props }) => {
  const cameraClassName = [styles.camera, className].filter(c => !!c).join(' ');

  const [cldData, setCldData] = useState();

  // const cldData = {
  //   public_id: 'rrm3q6isbrespeeotkr7'
  // }
  // const setCldData = () => {};

  const [filter, setFilter] = useState();

  const { image } = useCamera();

  const cloudImage = cldData && cld.image(cldData.public_id).format('auto').quality('auto');
  let src;

  if ( cloudImage ) {
    if ( filter?.transformations ) {
      filter.transformations.forEach(transformation => {
        cloudImage.addTransformation(transformation);
      });
    } else if ( filter ) {
      cloudImage.effect(`e_${filter.type}:${filter.name}`);
    }

    src = cloudImage.toURL();
  }

  useEffect(() => {
    if ( !image ) {
      setCldData(undefined);
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

  return (
    <>
      <Camera {...props} className={cameraClassName} src={src} />

      {cloudImage && (
        <div className={styles.effects}>
          <h2>Overlays</h2>
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
                <li key={overlayFilter.name} data-is-active-filter={overlayFilter.title === filter?.title}>
                  <button className={styles.filterThumb} onClick={() => setFilter(overlayFilter)}>
                    <img width={FILTER_THUMB_WIDTH} height={FILTER_THUMB_HEIGHT} src={thumb} alt={overlayFilter.name} />
                    <span>{ overlayFilter.title }</span>
                  </button>
                </li>
              )
            })}
          </ul>
          <h2>Art Filters</h2>
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
                    <img width={FILTER_THUMB_WIDTH} height={FILTER_THUMB_HEIGHT} src={thumb} alt={artFilter.name} />
                    <span>{ artFilter.name }</span>
                  </button>
                </li>
              )
            })}
          </ul>
        </div>
      )}
    </>
  )
}

export default CldCamera;