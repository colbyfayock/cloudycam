import { useState } from 'react';
import Head from 'next/head';
import Image from 'next/image';

import Layout from '@components/Layout';
import Container from '@components/Container';
import CldCamera from '@components/CldCamera';

import styles from '@styles/Camera.module.scss'

export default function Home() {
  return (
    <div>
      <CldCamera className={styles.camera} />
    </div>
  )
}