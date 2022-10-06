import dynamic from 'next/dynamic';
// https://github.com/reactjs/react-tabs/issues/56#issuecomment-791029642
const Tabs = dynamic(
  import('react-tabs').then((mod) => mod.Tabs),
  { ssr: false }
);
import { Tab, TabList, TabPanel } from 'react-tabs';

import CldImage from '@components/CldImage';

import { CLOUDINARY_ASSETS_FOLDER } from '@data/cloudinary';

import styles from './CameraFilters.module.scss';

const FILTER_THUMB_WIDTH = 500;
const FILTER_THUMB_HEIGHT = 500;

const CameraFilters = ({ className, filters, types, srcMain, srcTransparent, onFilterSelect }) => {
  let cameraFiltersClassName = styles.cameraFilters;

  if (className) {
    cameraFiltersClassName = `${cameraFiltersClassName} ${className}`;
  }

  /**
   * handleOnFilterSelect
   * @description Finds the selected filter's ID and toggles it on or off
   */

  function handleOnFilterSelect(e) {
    const filterId = e.currentTarget.dataset.filterId;
    if (typeof onFilterSelect === 'function') {
      onFilterSelect({ filterId }, e);
    }
  }

  return (
    <div className={cameraFiltersClassName} data-effects-active={!!srcMain?.public_id}>
      {/* TODO: is this needed? <Tabs key={`${srcMain?.public_id}-${srcTransparent?.public_id}`}> */}
      <Tabs>
        <div className={styles.effectsHeaders}>
          <TabList>
            {types.map((type) => {
              return (
                <Tab key={type.id} disabled={!srcMain} data-type={type.id}>
                  <span className={styles.effectsHeaderLabel}>{type.title}</span>
                </Tab>
              );
            })}
          </TabList>
        </div>

        {types.map((type) => {
          const typeFilters = filters.filter((filter) => filter.type === type.id);

          let publicId = srcMain?.public_id;

          if (srcTransparent && type.id === 'backgrounds') {
            publicId = srcTransparent.public_id;
          }

          let isActive = true;

          if (typeof type.checkActive === 'function') {
            isActive = type.checkActive({
              main: srcMain,
              transparent: srcTransparent,
            });
          }

          return (
            <TabPanel key={type.id} className={styles.effectsPanel}>
              <ul className={styles.filters}>
                {typeFilters.map((filter) => {
                  return (
                    <li key={filter.id} data-is-active-filter={filter.active}>
                      <button className={styles.filterThumb} data-filter-id={filter.id} onClick={handleOnFilterSelect}>
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
                            isLoading={!isActive}
                          />
                        </span>
                        <span className={styles.filterThumbImageLabel}>{filter.title}</span>
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
  );
};

export default CameraFilters;
