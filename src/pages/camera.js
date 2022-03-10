import { useState } from 'react';
import Head from 'next/head';
import Image from 'next/image';

import Layout from '@components/Layout';
import Container from '@components/Container';
import CldCamera from '@components/CldCamera';

export default function Camera() {
  return (
    <>
      <CldCamera />
      <style global jsx>{`
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
      `}</style>
    </>
  )
}