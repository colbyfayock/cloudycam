import dynamic from 'next/dynamic';
// https://github.com/reactjs/react-tabs/issues/56#issuecomment-791029642
const Tabs = dynamic(
  import('react-tabs').then((mod) => mod.Tabs),
  { ssr: false }
);
import { Tab, TabList, TabPanel } from 'react-tabs';
import { FaBan } from 'react-icons/fa';

import CldImage from '@components/CldImage';

import { CLOUDINARY_ASSETS_FOLDER } from '@data/cloudinary';
import { FILTER_ID_NONE } from '@data/filters';

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
    const filterType = e.currentTarget.dataset.filterType;
    if (typeof onFilterSelect === 'function') {
      onFilterSelect({ filterId, filterType }, e);
    }
  }

  return (
    <div className={cameraFiltersClassName} data-effects-active={!!srcMain?.public_id}>
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

          let activePublicId = srcMain?.public_id;

          if (srcTransparent && type.id === 'backgrounds') {
            activePublicId = srcTransparent.public_id;
          }

          let typeIsActive = true;

          if (typeof type.checkActive === 'function') {
            typeIsActive = type.checkActive({
              main: srcMain,
              transparent: srcTransparent,
            });
          }

          return (
            <TabPanel key={type.id} className={styles.effectsPanel}>
              {!typeIsActive && (
                <p className={styles.effectsPanelLoading}>
                  Still loading... check back in a few. It&apos;s worth the wait!
                </p>
              )}
              <ul className={styles.filters}>
                <li>
                  <button
                    className={styles.filterThumb}
                    data-filter-id={FILTER_ID_NONE}
                    data-filter-type={type.id}
                    onClick={handleOnFilterSelect}
                  >
                    <span className={styles.filterThumbImage}>
                      <span
                        style={{
                          aspectRatio: FILTER_THUMB_WIDTH / FILTER_THUMB_HEIGHT,
                        }}
                      >
                        <FaBan />
                      </span>
                    </span>
                    <span className={styles.filterThumbImageLabel}>None</span>
                  </button>
                </li>
                {typeFilters.map((filter) => {
                  const activeTransformations = [
                    `l_${activePublicId?.replaceAll('/', ':')},w_1.0,h_1.0,fl_region_relative/fl_layer_apply`,
                    ...(filter?.transformations || []),
                  ];

                  return (
                    <li key={filter.id} data-is-active-filter={filter.active}>
                      <button
                        className={styles.filterThumb}
                        data-filter-id={filter.id}
                        data-filter-type={type.id}
                        onClick={handleOnFilterSelect}
                        disabled={!typeIsActive}
                      >
                        <span className={styles.filterThumbImage}>
                          <CldImage
                            src={activePublicId || `${CLOUDINARY_ASSETS_FOLDER}/transparent-1x1`}
                            width={FILTER_THUMB_WIDTH}
                            height={FILTER_THUMB_HEIGHT}
                            rawTransformations={activeTransformations}
                            alt={filter.name}
                            loading={!typeIsActive}
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
