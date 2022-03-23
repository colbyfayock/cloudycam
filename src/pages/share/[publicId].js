import { useState, useEffect } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { v2 as cloudinary } from 'cloudinary';
import { FaCamera, FaTwitter } from 'react-icons/fa';

import { createTweetAction, openTweet } from '@lib/social';

import Layout from '@components/Layout';
import Container from '@components/Container';
import Button from '@components/Button';

import styles from '@styles/Share.module.scss'

import { CLOUDINARY_UPLOADS_FOLDER } from '@data/cloudinary';

const HOST = process.env.URL || process.env.NEXT_PUBLIC_URL;

export default function Share({ resource, original, filters }) {

  console.log('filters', filters)

  const router = useRouter();

  const twitterAction = createTweetAction({
    message: [
      'My Transformations',
      '',
      '#CloudyCam',
      '',
      `${HOST}${router.asPath}`
    ],
    related: [
      'Cloudinary'
    ]
  });

  console.log('resource', resource)



  /**
   * handleOnTwitterClick
   */

  function handleOnTwitterClick(e) {
    e.preventDefault();
    openTweet({
      message: twitterAction
    });
  }

  return (
    <Layout>
      <Head>
        <title>CloudyCam</title>
        <meta name="description" content="From Cloudinary" />
      </Head>

      <Container className={styles.shareContainer}>
        <div className={styles.imageTransformed}>
          <p>
            <img src={resource.secure_url} alt="Transformed Image" />
          </p>
        </div>

        <div className={styles.content}>

          <ul className={styles.actions}>
            <li>
              <Button color="twitter-blue" iconPosition="left" onClick={handleOnTwitterClick}>
                <FaTwitter /> Share on Twitter
              </Button>
            </li>
            <li>
              <Link href="/camera" passHref={true}>
                <Button color="cloudinary-yellow" iconPosition="left">
                  <FaCamera /> Create Your Own
                </Button>
              </Link>
            </li>
          </ul>

          {original && (
            <div className={styles.imageOriginal}>
              <div className={styles.imageOriginalDetails}>
                <h2>Original Image</h2>
                <p className={styles.imageOriginalLink}>
                  <a href={ original.secure_url } target="_blank">View Image</a>
                </p>
              </div>
              <p className={styles.imageOriginalImage}>
                <img src={original.secure_url} alt="Transformed Image" />
              </p>
            </div>
          )}

        </div>
      </Container>

      <Container>
        <h2>How it Works</h2>

        <h2>Transformations</h2>
        
        <div className={styles.transformations}>
          {Object.keys(filters).map(key => {
            const { id, title, transformations } = filters[key];
            return (
              <div className={styles.transformation}>
                { title }
              </div>
            )
          })}
        </div>

      </Container>

    </Layout>
  )
}

export async function getServerSideProps({ params, query }) {
  cloudinary.config({
    cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
    secure: true
  });

  const publicId = `${CLOUDINARY_UPLOADS_FOLDER}/${params.publicId}`;
  const resourceResults = await cloudinary.api.resource(publicId);

  const originalPublicId = resourceResults?.context?.custom?.original_public_id;
  const originalResults = originalPublicId && await cloudinary.api.resource(originalPublicId);
  console.log('originalResults', originalResults)

  const keys = [
    'public_id',
    'resource_type',
    'created_at',
    'width',
    'height',
    'secure_url',
  ];

  const resource = {};
  const original = {};
  
  const filtersString = resourceResults?.context?.custom?.cloudycam_filters;
  const filters = filtersString && JSON.parse(filtersString);

  keys.forEach(key => resource[key] = resourceResults[key]);

  if ( originalResults ) {
    keys.forEach(key => original[key] = originalResults[key]);
  }

  return {
    props: {
      resource,
      original,
      filters
    }
  }
}